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
import datetime
from rasa_sdk.events import SlotSet

import psycopg2
import datetime

def SaveConversation(dialogue_id, client_id, chatbot_id):
    conn = psycopg2.connect( host="localhost", user="postgres", password="gabi123", dbname="gabidata" )
    cur = conn.cursor()
    start_dialogue = datetime.datetime.now()
    end_dialogue = datetime.datetime.now()
    clientscore = -1
    
    query = """INSERT INTO dialogue (dialogue_id, client_id, chatbot_id,start_dialogue,end_dialogue,client_score) VALUES (DEFAULT,%s,%s,%s,%s,%s)"""
    record = (client_id, chatbot_id,start_dialogue,end_dialogue,clientscore)
    
    cur.execute(query,record)   
    conn.commit()


class ActionInitConvertation(Action):

    def name(self) -> Text:
        return "action_init_convertation"

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
        conversationID = tracker.sender_id

        SaveConversation(5, userID, chatbotID)

        return [SlotSet('userID',userID),SlotSet('conversationID',conversationID),SlotSet('chatbotID',chatbotID)]


class ActionSaveMessage(Action):
    def name(self) -> Text:
        return "action_save_message"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Guardado!")
        userMessage = tracker.latest_message['text']
        userIntention = tracker.latest_message['intent']
        return []    

