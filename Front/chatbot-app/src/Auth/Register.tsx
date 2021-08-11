import { useState } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
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
`


const Register = () => {

    const [{username,email,password,repeatPassword}, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword:''
    })

    const [error,setError] = useState('')

    const register= (event:React.FormEvent)=> {
        event.preventDefault();
        if(password===repeatPassword){
            //llamado a api
        }else{
            setError('Las  contrasenas deben coincidir')
        }
        console.log('registrado')
    }

    return (
        <StyledDiv>
            <StyledForm onSubmit={register}>
                <label htmlFor="username"/>
                <StyledInput placeholder="Nombre Completo" name="username" value={username} onChange={(event)=> setRegisterData({
                    username:event.target.value,
                    email,
                    password,
                    repeatPassword
                })}/>
                <label htmlFor="email"/>
                <StyledInput placeholder="Correo Electronico" name="email" value={email} onChange={(event)=> setRegisterData({
                    username,
                    email:event.target.value,
                    password,
                    repeatPassword
                })}/>
                <label htmlFor="password"/>
                <StyledInput type="password" placeholder="Contrasena" name="password" value={password} onChange={(event)=> setRegisterData({
                    username,
                    email,
                    password:event.target.value,
                    repeatPassword
                })}/>
                <label htmlFor="repeatPassword"/>
                <StyledInput type="password" placeholder="Repetir contrasena" name="repeatPassword" value={repeatPassword} onChange={(event)=> setRegisterData({
                    username:event.target.value,
                    email,
                    password,
                    repeatPassword:event.target.value
                })}/>
                <StyledButton type="submit"> Registrarse </StyledButton>
                {error.length > 0 && <p>{error}</p>}
            </StyledForm>
        </StyledDiv>
    )
}

export default Register;