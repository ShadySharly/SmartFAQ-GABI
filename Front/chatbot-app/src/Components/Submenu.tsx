import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SidebarItem } from '../Models/SidebarItem';

type SidebarLinkProps = {
    item: SidebarItem;
};

const SidebarLink = styled(Link)`
    display: flex;
    justify-content: start;
    align-items: center;
    height: 3rem;
    font-size: 1.125rem;
    padding: 1rem;
    text-decoration: none;
    color: #394049;
    background-color: #D9D9D9;
    margin-top: 8px;
    margin-left: 12px;
    margin-right: 12px;
    border-radius: 10px;

    &:hover{
        background-color: #043C8B;
        border-left: 4px solid #ccc;
        color: white;
        svg{
            fill: white !important;
        };
    };
`
const IconContainer = styled.div`
    width: 20px;
    margin-right: 20px;
    color:#394049 !important;
`


const Submenu: FC<SidebarLinkProps> = ({item}) => {

    return ( <>
            <SidebarLink to={item.path}>
                <IconContainer>{item.icon}</IconContainer>
                <div>
                    <span>{item.title}</span>
                </div>
            </SidebarLink>
    </>
    );
};

export default Submenu;