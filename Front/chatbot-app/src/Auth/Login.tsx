import { useState } from 'react';
import styled from 'styled-components';
import {gql, useMutation} from '@apollo/client';
import { Link, Redirect } from 'react-router-dom';


const StyledLoginDiv = styled.div`
  padding:10px;
  margin:auto;
  margin-top:50px;
  background-color:#043C8B;
  border-radius:30px;
  width:25%;
  height:200px;
  box-shadow: 10px 10px 10px rgba(9, 19, 20, 0.35);
`

const StyledForm = styled.form`
    display:flex;
    align-items: center;
    padding:10%;
    flex-direction: column;
    width: 50%;
    margin:0 auto;

`
const StyledInput = styled.input`
    border-radius:5px;
    margin-top:10px;
    margin-bottom:10px;
    width: 350px;
    height:25px;
`

const StyledButton = styled.button`
    border-color:#EA7600;
    margin-bottom:10px;
    background-color:#EA7600;
    border-radius:5px;
    color: white;
    width: 150px;
    height:35px;
    font-size:20px;
    cursor:pointer;

    &:hover{
        background-color: #FF9933;
        border-color:#FF9933;
        color: white;
    };
`

const StyledSpan = styled.span`
  margin-top:50px;
    color: black;
    margin-left:44%;
`

const REQUEST_LOGIN = gql`
  mutation requestLogin ($email: String!, $password: String!) {
    login (email: $email, password: $password) {
      client_id,
      first_name,
      last_name,
      email,
      duty {
        duty_id,
        duty_name
      }
    }
  }
`;

type Client = {
  client_id: number,
  first_name: string,
  last_name: string,
  email: string,
  duty:Duty
}

type Duty = {
  duty_id: number,
  duty_name: string
}


interface IProps {
  setActiveUser:React.Dispatch<React.SetStateAction<Client>>,
}

const DefaultUser: Client = { client_id: -1, first_name: "", last_name: "", email: "", duty:{duty_id:-1, duty_name:""}};

const Login: React.FunctionComponent<IProps> = props => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(DefaultUser);

  const [getValidation] = useMutation(REQUEST_LOGIN, {
    onCompleted(getValidation) {
      setUser(getValidation.login);
      props.setActiveUser(getValidation.login);
      localStorage.setItem("user", JSON.stringify(getValidation.login));
    }
  });


  const onSubmitButton = (e: React.FormEvent) => {
    e.preventDefault();
    getValidation({
      variables: {
        email: email,
        password: password
      }
    });
  }

  if (user.client_id !== -1){
    return (
      <Redirect to="/overview" exact />
    )
  }

  return (
    <div>
      <StyledLoginDiv>
        <StyledForm onSubmit={onSubmitButton}>
          <label htmlFor="email" />
          <StyledInput placeholder="Correo" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password" />
          <StyledInput placeholder="Contrasena" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <StyledButton type="submit"> Iniciar sesion </StyledButton>
        </StyledForm>
      </StyledLoginDiv>
      
        <StyledSpan>No tienes cuenta? </StyledSpan>
        <Link to="/register">Registrate</Link>
      </div>
    
  )
}

export default Login;