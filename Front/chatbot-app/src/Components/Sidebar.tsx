import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { SidebarDataStudent } from './SidebarDataStudent';
import { SidebarDataMentor } from './SidebarDataMentor';
import { SidebarDataScientist } from './SidebarDataScientist';
import Submenu from './Submenu';
import React, { useState, useEffect } from 'react';


const Nav = styled.div`
    display:flex;
    jusfity-content: flex-start;
    align-items: center;
    height: 3rem;
    background-color: #394049;
`

const SidebarNav = styled.div<{ sidebar: boolean }>`
    width: 250px;
    height: 100vh;
    background-color: white;
    position: fixed;
    top: 0;
    left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
    transition: 350ms;
`

const NavIcon = styled(Link)` 
    display:flex;
    jusfity-content: flex-start;
    align-items: center;
    height: 3rem;
    font-size: 2rem;
    margin-left: 2rem;
`

type Client = {
    client_id: number,
    first_name: string,
    last_name: string,
    email: string,
    duty: Duty
}

type Duty = {
    duty_id: number,
    duty_name: string
}

const DefaultUser: Client = { client_id: -1, first_name: "", last_name: "", email: "", duty: { duty_id: -1, duty_name: "" } };

type SidebarProps = { isOpen: boolean, showSidebar: () => void }
const Sidebar = (props: SidebarProps) => {
    const [user, setUser] = useState(DefaultUser);
    const isOpen = props.isOpen;
    const showSidebar = props.showSidebar;

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    }, []);

    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <Nav>
                <NavIcon to="#" onClick={showSidebar}>
                    <AiOutlineMenu />
                </NavIcon>
            </Nav>

            <SidebarNav sidebar={isOpen}>
                <div>
                    <NavIcon to="#" onClick={showSidebar}>
                        <AiOutlineClose style={{ fill: "#394049", fontSize: "20px" }} />
                    </NavIcon>

                    {user.duty.duty_id === 1 ? (
                        SidebarDataStudent.map((item, index) => {
                            return <Submenu item={item} key={index} />
                        })
                    ) : (
                        user.duty.duty_id === 2 ? (
                            SidebarDataMentor.map((item, index) => {
                                return <Submenu item={item} key={index} />
                            })

                        ) : (
                            SidebarDataScientist.map((item, index) => {
                                return <Submenu item={item} key={index} />
                            })
                        ))
                    }

                </div>
            </SidebarNav>
        </IconContext.Provider>

    )
}

export default Sidebar;