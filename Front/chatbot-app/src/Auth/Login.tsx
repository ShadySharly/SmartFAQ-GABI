import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import AuthContext from '../Context/auth-context';


const StyledLoginDiv = styled.div`
    margin-top:10%;
    background-color:#043C8B;
    border-radius:0px 30px 30px 0px;
    width:30%;
    height:250px;
    box-shadow: 10px 10px 10px rgba(9, 19, 20, 0.35);
`
const StyledRegisterDiv = styled.div`
    padding:10px;
    margin:auto;
    margin-top:50px;
    background-color:#043C8B;
    border-radius:30px;
    width:25%;
    height:350px;
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

const REQUEST_LOGIN = gql`
    query requestLogin ($email: email, $password: password) {
        login (email: $email, password: $password) {
            userID
            token
            tokenExpiration
        }
    }
`;

const Login = () => {


    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const { loading, error, data } = useQuery(REQUEST_LOGIN);



    const onLogin = (event: React.FormEvent) => {
        event.preventDefault();
        
    }
    return (
        
        <StyledForm onSubmit={onLogin}>
                <StyledLoginDiv>
                    <label htmlFor="email"/>
                    <StyledInput  placeholder="Correo" value={email} onChange={(event)=> setEmail(event.target.value)}/>
                    <label htmlFor="password"/>
                    <StyledInput  placeholder="Contrasena" type="password" value={password} onChange={(event)=> setPassword(event.target.value)}/>
                    <StyledButton type="submit" onClick={onLogin}> Iniciar sesion </StyledButton>
                </StyledLoginDiv>
                <div>
                    <span>No tienes cuenta? </span>
                    <Link to ="/register">Registrate</Link>
                </div>
            </StyledForm>
            
        
    
    )
}

export default Login;