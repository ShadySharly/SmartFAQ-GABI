import mysql.connector
import datetime

def SaveConversation(dialogue_id, client_id, chatbot_id):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="gabi123",
        database="gabidata"
    )
    mycursor = mydb.cursor()

    start_dialogue = datetime.datetime.now()
    end_dialogue = datetime.datetime.now()
    clientscore = -1
    
    query = 'INSET INTO dialoge (dialogue_id, client_id, chatbot_id,start_dialogue,end_dialogue,clientscore) VALUES ("{0}","{1}","{2}","{3}","{4}","{5}")'.format(dialogue_id,client_id, chatbot_id,start_dialogue,end_dialogue,clientscore)
    mycursor.execute(query)    
    mydb.commit()  

"""
def ActionSaveMessage():
    mydb = mysql.connector.connect(
        host="localhost",
        user="postgres",
        passwd="gabi123",
        database="gabidata"
    )

    mycursor = mydb.cursor()

    query = 'INSET INTO '
"""


if __name__ == "__main__":
    SaveConversation(1,2,3)