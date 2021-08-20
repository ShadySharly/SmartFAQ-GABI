// @ts-ignore
import RasaWebchat from 'rasa-webchat';
import { FC } from "react";
import styled from 'styled-components';

const StyledDiv = styled.div`
  .rw-client{
    background-color:#043C8B;
  };
  .rw-response{
    background-color:#394049;
    color:white;
  };
  .rw-reply{
    background-color:#043C8B;
  };
  .rw-sender{
    background-color:#394049;
  };
  .rw-new-message{
    background-color:#D9D9D9;
    margin-left:25px;
    margin-right:25px;
    border-radius:25px;
    padding:10px;
  };
  .rw-send{
    background-color:#394049;
  };
  .rw-send .rw-send-icon-ready{
    fill:#D9D9D9;
  }
`


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
    return <StyledDiv className = "chatbot">
            <ChatbotConversation />    
    </StyledDiv>
}

export default Chatbot;