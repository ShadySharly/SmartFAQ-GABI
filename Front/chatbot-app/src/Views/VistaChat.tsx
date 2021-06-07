import * as React from 'react';
import ReactDOM from 'react-dom';
import Logo from './img/LogoGabiWhite.png';
import './VistaChat.css';



class BarraSuperior extends React.Component{
  render(){
    return(
    <header className="header">
      <div className="left-zone">
        <div className="logo">
          <img src= {Logo} className="logo-img"></img>
        </div>
      </div>
      <div className="right-zone">
        <div className="nombre">
          <a href="">Nombre Completo</a>
        </div>
        <div className="user-avatar">
          <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="" className="user-img"></img>
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
        <div className="nav-list">
          <a href="" className="nav-sub">Navegación</a>
          <a href="" className="nav-link"><span>Inicio</span></a>
          <a href="" className="nav-link"><span>Mis Cursos</span></a>
          <a href="" className="nav-link"><span>Consultas</span></a>
          <a href="" className="nav-sub">Instituciones</a>
          <a href="" className="nav-link"><span>Universidad</span></a>
          <a href="" className="nav-link"><span>Carrera</span></a>
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
          <div className="cuadro">
          

              
          </div>
        </li>
      </div>
    );
  }
}

class VistaChat extends React.Component{
  render(){
    return(
      <div className= "vistachat">
        <div className= "header">
          <header className="header">
            <BarraSuperior />
          </header>
        </div>
        <div className= "sidebar">
          <div className="side-nav">
            <MenuLateral />
          </div>
        </div>
        <div className= "chatt">
          <div className="chat">
            <ChatAsignatura />
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<VistaChat/>, document.getElementById("root"));

export default VistaChat;
