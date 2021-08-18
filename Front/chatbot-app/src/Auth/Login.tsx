import { useState } from 'react';
import styled from 'styled-components';
import {gql, useMutation} from '@apollo/client';
import { Link, Redirect } from 'react-router-dom';


const StyledLoginDiv = styled.div`
    margin-top:10%;
    background-color:#043C8B;
    border-radius:0px 30px 30px 0px;
    width:30%;
    height:250px;
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
    color: black;
    margin-left 130px;
`

const REQUEST_LOGIN = gql`
  mutation requestLogin ($email: String!, $password: String!) {
    login (email: $email, password: $password) {
      client_id,
      first_name,
      last_name,
      email
    }
  }
`;

type Client = {
  client_id: number,
  first_name: string,
  last_name: string,
  email: string
}

interface IProps {
  setActiveUser:React.Dispatch<React.SetStateAction<Client>>,
}

const DefaultUser: Client = { client_id: -1, first_name: "", last_name: "", email: "" };

const Login: React.FunctionComponent<IProps> = props => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(DefaultUser);

  const [getValidation] = useMutation(REQUEST_LOGIN, {
    onCompleted(getValidation) {
      setUser(getValidation.login);
      props.setActiveUser(getValidation.login);
      localStorage.setItem("user", JSON.stringify(getValidation.login));
      console.log(getValidation);
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