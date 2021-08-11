import { useState } from 'react';
import styled from 'styled-components';


const StyledDiv = styled.div`
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
`

const Login = () => {

    const[{email,password}, setCredentials]=useState({
        email:'',
        password:''
    })
    const login = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('logeado')
    }
    return (
        <StyledDiv>
            <StyledForm onSubmit={login}>
                <label htmlFor="email"/>
                <StyledInput  placeholder="Correo" value={email} onChange={(event)=> setCredentials({
                    email: event.target.value,
                    password
                })}/>
                <label htmlFor="password"/>
                <StyledInput  placeholder="Contrasena" type="password" value={password} onChange={(event)=> setCredentials({
                    email,
                    password: event.target.value,
                })}/>
                <StyledButton type="submit"> Iniciar sesion </StyledButton>
            </StyledForm>
        </StyledDiv>
    
    )
}

export default Login;