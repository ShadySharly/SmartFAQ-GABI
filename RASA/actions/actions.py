from typing import Any, Text, Dict, List
from rasa_sdk.events import UserUtteranceReverted
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from datetime import datetime
from rasa_sdk.events import SlotSet
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

transport = AIOHTTPTransport(url="http://localhost:4000/graphql")
client = Client(transport=transport, fetch_schema_from_transport=True)


query1 = gql(
    """
        query q1($dialogue_id: Int!){
            chatmessagesByDialogue(dialogue_id: $dialogue_id){
                information
            }
        }
"""
)

query2 = gql(
    """
        query q2($intention_name: String!){
            intentionByName(intention_name: $intention_name){
                intention_id
            }
        }
"""
)

mutation1 = gql(
    """
        mutation m1($client_id: Int!, $chatbot_id: Int!){
            createDialogue(client_id:$client_id, chatbot_id:$chatbot_id)
        }
"""
)

mutation2 = gql(
    """
        mutation m2($dialogue_id: Int!, $client_score: Int!){
            updateDialogue(dialogue_id:$dialogue_id, client_score:$client_score)
        }
"""
)

mutation3 = gql(
    """
        mutation m3($dialogue_id: Int!, $intention_id: Int!,$information: String!,$confidence: Int!){
            createChatmessage(dialogue_id:$dialogue_id, intention_id:$intention_id,information:$information,confidence:$confidence)
        }
"""
)

mutation4 = gql(
    """
        mutation m4($client_id: Int!, $dialogue_id: Int!,$information: String!){
            createUserquestion(client_id:$client_id, dialogue_id:$dialogue_id,information:$information)
        }
"""
)


async def createDialogue(client_id, chatbot_id):
    params = {"client_id":int(client_id), "chatbot_id":int(chatbot_id)}
    return await client.execute_async(mutation1,variable_values=params)

async def getChatmessagesByDialogue(dialogue_id):
    params = {"dialogue_id":int(dialogue_id)}
    return await client.execute_async(query1,variable_values=params)

async def updateDialogue(dialogue_id,client_score):
    params = {"dialogue_id":int(dialogue_id),"client_score":int(client_score)}
    return await client.execute_async(mutation2,variable_values=params)

async def intentionByName(intention_name):
    params = {"intention_name":intention_name}
    return await client.execute_async(query2,variable_values=params)
 
async def createChatmessage(dialogue_id,intention_id,information,confidence):
    params = {"dialogue_id":int(dialogue_id),"intention_id":int(intention_id),"information":information,"confidence":int(confidence)}
    return await client.execute_async(mutation3,variable_values=params)

async def createUserquestion(client_id,dialogue_id,information):
    params = {"client_id":int(client_id),"dialogue_id":int(dialogue_id),"information":information}
    return await client.execute_async(mutation4,variable_values=params)


def getUserEvaluation(userEvaluation):
    switcher= { 
        "/bad_evaluate" : 1,
        "/regular_evaluate": 2,
        "/good_evaluate": 3
    }        
    return switcher.get(userEvaluation,-1)


class ActionFallback(Action):
    def name(self) -> Text:
        return "action_fallback"
    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        conversationID = tracker.get_slot('conversationID')
        userID = tracker.get_slot('userID')
        information = tracker.latest_message['text']
        await createUserquestion(userID, conversationID, information)
        return []




class ActionInitConversation(Action):

    def name(self) -> Text:
        return "action_init_conversation"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Conectado!")
        try:
            userID = tracker.latest_message['text'].split('@')[1]
            chatbotID = tracker.latest_message['text'].split('@')[2]
            conversationID = tracker.latest_message['text'].split('@')[3]
        except:
            userID = tracker.latest_message['text'].split('@')[1]
            chatbotID = tracker.latest_message['text'].split('@')[2]
            conversationID = 'null'
        if(conversationID == 'null'):
            aux = await createDialogue(userID, chatbotID)
            conversationID = aux['createDialogue']
        else:  
            aux = await getChatmessagesByDialogue(conversationID)
            old_messages = aux['chatmessagesByDialogue']
            dispatcher.utter_message("Cargando conversacion previa: ")
            for i in range(1,len(old_messages)):
                dispatcher.utter_message(old_messages[i]['information'])            
        return [SlotSet('userID',userID),SlotSet('conversationID',conversationID),SlotSet('chatbotID',chatbotID)]


class ActionSaveConversation(Action):
    def name(self) -> Text:
        return "action_save_conversation"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Adios!")
        events = tracker.events
        conversationID = tracker.get_slot('conversationID')
        userID = tracker.get_slot('userID')
        chatbotID = tracker.get_slot('chatbotID')
        userEvaluation = getUserEvaluation(tracker.latest_message['text'])
        await updateDialogue(conversationID,userEvaluation)
        intentID = -1
        
        for i in range(len(events)):
            if(events[i]['event'] == 'user'):
                userMessage = events[i]['text']
                userIntent = events[i]['parse_data']['intent']
                aux = await intentionByName(userIntent['name'])
                try:
                    intentID = aux['intentionByName']['intention_id']
                except:
                    intentID = 0
                intentConfidence = userIntent['confidence']
                await createChatmessage(conversationID, intentID, userMessage,intentConfidence*100)

            if(events[i]['event'] == 'bot'):    
                botMessage = events[i]['text']
                botIntent = events[i-1]
                aux = await intentionByName(botIntent['name'])
                try:
                    intentID = aux['intentionByName']['intention_id']
                except:
                    intentID = 0
                intentConfidence = events[i-1]['confidence']
                await createChatmessage(conversationID, intentID, botMessage,intentConfidence*100)

        return []    

