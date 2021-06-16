# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher

#Dependencias para conectar con mysql
#pip install mysql-connector-python-rf
#https://stackoverflow.com/questions/7475223/mysql-config-not-found-when-installing-mysqldb-python-interface

from typing import Any, Text, Dict, List
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from datetime import datetime
from rasa_sdk.events import SlotSet

import psycopg2

def createConnection():
    return psycopg2.connect( host="ec2-54-163-254-204.compute-1.amazonaws.com", user="nztcvlwuphyxdn", password="bfae001ab6a28f99ba644460cb696ee8476aec9e6df4d69befbc2baaaa8fbe5c", dbname="df0iofqaap79fh")

def saveConversation(client_id, chatbot_id):
    start_dialogue = datetime.now()
    end_dialogue = datetime.now()
    clientscore = -1
    query = """INSERT INTO dialogue (client_id, chatbot_id,start_dialogue,end_dialogue,client_score) VALUES (%s,%s,%s,%s,%s) RETURNING dialogue_id"""
    record = (client_id, chatbot_id,start_dialogue,end_dialogue,clientscore)
    conn = createConnection()
    cur = conn.cursor()
    cur.execute(query,record)   
    dialogue_id = cur.fetchone()[0]
    conn.commit()
    return dialogue_id

def updateConversation(dialogue_id, client_score):
    end_dialogue = datetime.now()
    query = """UPDATE dialogue SET client_score = %s, end_dialogue = %s WHERE dialogue_id = %s"""
    record = (client_score, end_dialogue ,dialogue_id)
    conn = createConnection()
    cur = conn.cursor()
    cur.execute(query,record)   
    conn.commit()
    return []

def getIntentID(intention_name):
    query = """SELECT intention_id FROM intention WHERE intention_name = '{0}'""".format(intention_name)
    conn = createConnection()
    cur = conn.cursor()
    try:
        cur.execute(query)
        intention_id = cur.fetchone()[0]
        conn.commit()           
    except:
        intention_id = 0
    return intention_id    

def saveMessage(dialogue_id, intention_id, information,confidence,date_issue):
    query = """INSERT INTO chatmessage (chatmessage_id, dialogue_id, intention_id,information,confidence,date_issue) VALUES (DEFAULT,%s,%s,%s,%s,%s)"""
    record = (dialogue_id, intention_id, information,confidence,date_issue)
    conn = createConnection()
    cur = conn.cursor()
    cur.execute(query,record)   
    conn.commit()
    return []

def getUserEvaluation(userEvaluation):
    switcher= { 
        "/bad_evaluate" : 1,
        "/regular_evaluate": 2,
        "/good_evaluate": 3
    }        
    return switcher.get(userEvaluation,-1)



class ActionInitConversation(Action):

    def name(self) -> Text:
        return "action_init_conversation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Contectado!")
        try:
            userID = tracker.latest_message['text'].split('@')[1]
            chatbotID = tracker.latest_message['text'].split('@')[2]
        except:
            userID = tracker.get_slot('userID')
            chatbotID = tracker.get_slot('chatbotID')

        conversationID = saveConversation(userID, chatbotID)

        return [SlotSet('userID',userID),SlotSet('conversationID',conversationID),SlotSet('chatbotID',chatbotID)]


class ActionSaveConversation(Action):
    def name(self) -> Text:
        return "action_save_conversation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Adios!")
        events = tracker.events

        conversationID = tracker.get_slot('conversationID')
        userID = tracker.get_slot('userID')
        chatbotID = tracker.get_slot('chatbotID')
        userEvaluation = getUserEvaluation(tracker.latest_message['text'])
        updateConversation(conversationID,userEvaluation)
        for i in range(len(events)):
            if(events[i]['event'] == 'user'):
                dateIssue = datetime.fromtimestamp(events[i]['timestamp'])
                userMessage = events[i]['text']
                userIntent = events[i]['parse_data']['intent']
                intentID = getIntentID(userIntent['name'])
                intentConfidence = userIntent['confidence']
                saveMessage(conversationID, intentID, userMessage,intentConfidence*100,dateIssue)

            if(events[i]['event'] == 'bot'):    
                dateIssue = datetime.fromtimestamp(events[i]['timestamp'])
                botMessage = events[i]['text']
                botIntent = events[i-1]
                intentID = getIntentID(botIntent['name'])
                intentConfidence = events[i-1]['confidence']
                saveMessage(conversationID, intentID, botMessage,intentConfidence*100,dateIssue)

        return []    

