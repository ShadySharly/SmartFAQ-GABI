// @ts-ignore
import RasaWebchat from 'rasa-webchat';
import React, { useRef, useLayoutEffect } from 'react';
import { FC } from "react";
import styled from 'styled-components';

const ChatbotNav = styled.div`
    width: 1250px;
    height: 80vh;
    margin-left: 250px;
    background-color: #043C8B;
    position: center;
    top: 0;
`;

function ChatbotConversation (){
    sessionStorage.clear();
    return (
      <RasaWebchat
        ///login @userID @chatbotID
        initPayload= {'/login @1 @1'}
        socketUrl={"http://localhost:5005"}
        socketPath={"/socket.io/"}
        title={"GABI - General"}
        inputTextFieldHint={"Escribe un mensaje"}
        customData= {{ language: "en"}}
        embedded = {true}
        showFullScreenButton={true}
        displayUnreadCount={true}
        connectOn={"mount"}
        showMessageDate={true}
        params = {{
          storage: "session"
        }}
      />
    )
  }

const Chatbot: FC = () => {
    return <div className = "chatbot">
        <ChatbotNav>
            <ChatbotConversation />
        </ChatbotNav>        
    </div>
}

export default Chatbot;