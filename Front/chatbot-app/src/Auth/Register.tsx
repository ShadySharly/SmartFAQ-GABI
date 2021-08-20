import { useState } from 'react';
import styled from 'styled-components';
import {gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

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
    p{
        color:white;
        font-size:15px;
    }

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
    margin-top:20px;
    background-color:#EA7600;
    border-radius:5px;
    color: white;
    width: 150px;
    height:40px;
    font-size:20px;

    &:hover{
        background-color: #FF9933;
        border-color:#FF9933;
        color: white;
    };
`
const StyledSpan = styled.span`
    color: black;
    margin-left:44%;
`

const REQUEST_REGISTER = gql`
    mutation requestRegister($first_name:String!, $last_name:String!, $email:String!, $password:String!){
        register(first_name:$first_name, last_name:$last_name, email:$email, password:$password)
    }
`;


const Register = () => {
    const  [setRegisterData] = useMutation(REQUEST_REGISTER);
    const [ first_name, setFirstName ] = useState("");
    const [ last_name, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [error,setError] = useState('')

    const onRegister= (event:React.FormEvent)=> {
        event.preventDefault();
        setRegisterData({ variables: { first_name: first_name, last_name: last_name, email: email, password: password }});
 
        console.log('registrado')
    }

    return (
        <div>
        <StyledRegisterDiv>
            <StyledForm onSubmit={onRegister}>
                <label htmlFor="first_name"/>
                <StyledInput placeholder="Nombre" name="first_name" value={first_name} onChange={(event) => setFirstName(event.target.value)}/>
                <label htmlFor="last_name"/>
                <StyledInput placeholder="Apellido" name="last_name" value={last_name} onChange={(event)=> setLastName(event.target.value)}/>
                <label htmlFor="email"/>
                <StyledInput placeholder="Correo Electronico" name="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                <label htmlFor="password"/>
                <StyledInput type="password" placeholder="Contrasena" name="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
                <StyledButton type="submit"> Registrarse </StyledButton>
                {error.length > 0 && <p>{error}</p>}
            </StyledForm>
        </StyledRegisterDiv>
            <StyledSpan>Ya tienes cuenta? </StyledSpan>
            <Link to="/login">Inicia sesion</Link>
        </div>
    )
}

export default Register;