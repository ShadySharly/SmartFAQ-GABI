import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './img/LogoGabiWhite.png';
import './vistaChat.css';



class BarraSuperior extends React.Component{
  render(){
    return(
    <header class="header">
      <div class="left-zone">
        <div class="logo">
          <img src= {Logo} class="logo-img"></img>
        </div>
      </div>
      <div class="right-zone">
        <div class="nombre">
          <a href="">Nombre Completo</a>
        </div>
        <div class="user-avatar">
          <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="" class="user-img"></img>
        </div>
      </div>
    </header>
    ); 
  } 
}


class MenuLateral extends React.Component{
  render(){
    return(
      <nav id="side-nav">
        <div class="nav-list">
          <a href="" class="nav-sub">Navegación</a>
          <a href="" class="nav-link"><span>Inicio</span></a>
          <a href="" class="nav-link"><span>Mis Cursos</span></a>
          <a href="" class="nav-link"><span>Consultas</span></a>
          <a href="" class="nav-sub">Instituciones</a>
          <a href="" class="nav-link"><span>Universidad</span></a>
          <a href="" class="nav-link"><span>Carrera</span></a>
        </div>
      </nav>
    );
  }
}

class ChatAsignatura extends React.Component{
  render() {
    return (
      <div id="chat">
        <li>
          <h3> MIS CURSOS | Asignatura 1 </h3>
          <div class="cuadro">
          

              
          </div>
        </li>
      </div>
    );
  }
}

class Container extends React.Component{
  render(){
    return( 
      <div className="container">
        {this.props.children}
      </div>
    );
  }
}

class Heading2 extends React.Component{
  render(){
    return(
      <li>{this.props.children}</li>
    ); 
  }
}

class VistaChat extends React.Component{
  render(){
    return(
      <div className= "vistachat">
        <div className= "header">
          <header class="header">
            <BarraSuperior />
          </header>
        </div>
        <div className= "sidebar">
          <div class="side-nav">
            <MenuLateral />
          </div>
        </div>
        <div className= "chatt">
          <div class="chat">
            <ChatAsignatura />
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<VistaChat/>, document.getElementById("root"));