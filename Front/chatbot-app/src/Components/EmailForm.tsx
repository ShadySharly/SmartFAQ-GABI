import React from "react";
import * as emailjs from "emailjs-com";
import { useQuery, gql, useMutation } from '@apollo/client';

const SERVICE_ID = "email_gabi"
const TEMPLATE_ID = "template_gabi"
const USER_ID = "user_vV0bKQTzetKpbPwajilRT"
const GABI_EMAIL = "smartfaq.gabi@gmail.com"

type Client = {
  client_id: number
  first_name: string
  last_name: string
  email: string
}

type Intention = {
  intention_id: number,
  intention_name: string
}

interface IProps {
  client: Client;
  intention: Intention;
  question: string;
}

const EmailForm: React.FunctionComponent<IProps> = props => {
  const [answer, setAnswer] = React.useState("");

  function handleClick() {
    var info = {
      to_email: props.client.email,
      to_first_name: props.client.first_name,
      to_last_name: props.client.last_name,
      from_name: 'GABI',
      mentor_name: 'El dios Sharly',
      subject: props.intention.intention_name,
      question: props.question,
      message: answer,
      reply_to: GABI_EMAIL
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, info, USER_ID).then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
  }
  return (

    <p>
      Enter your email here
      <input
        type="email"
        onChange={(event) => setAnswer(event.target.value)}
      ></input>
      <button type="submit" onClick={handleClick}>
        Send mail
      </button>
    </p>

  );
}

export default EmailForm;