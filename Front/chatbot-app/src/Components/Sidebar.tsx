import React, { FC, useState } from 'react'; 
import { Link } from 'react-router-dom';
import styled from 'styled-components';
//import WhiteLogo from '../Images/WhiteLogo.png';
import { IconContext } from 'react-icons';
//import { BiMenu } from 'react-icons/bi';
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import Submenu from './Submenu';


const Nav = styled.div`
    display:flex;
    jusfity-content: flex-start;
    align-items: center;
    height: 3rem;
    background-color: #394049;
`;

const SidebarNav = styled.div<{sidebar:boolean}>`
    width: 250px;
    height: 100vh;
    background-color: #043C8B;
    position: fixed;
    top: 0;
    left: ${({sidebar}) => (sidebar ? '0' : '-100%')};
    transition: 350ms;
`;

const NavIcon = styled(Link) `
    display:flex;
    jusfity-content: flex-start;
    align-items: center;
    height: 3rem;
    font-size: 2rem;
    margin-left: 2rem;
`
const SidebarWrap = styled.div ``;

const Sidebar: FC = () => {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <Nav>
            <NavIcon to="#" onClick={showSidebar}>
                    <AiOutlineMenu />   
                </NavIcon>
            </Nav>
            <SidebarNav sidebar={sidebar}>
                <SidebarWrap>
                    <NavIcon to="#" onClick={showSidebar}>
                        <AiOutlineClose />   
                    </NavIcon>
                    {SidebarData.map((item,index) => {
                        return <Submenu item ={item} key={index}/>
                    })}
                </SidebarWrap>
            </SidebarNav>
        </IconContext.Provider>
            
    )
 }

export default Sidebar; 