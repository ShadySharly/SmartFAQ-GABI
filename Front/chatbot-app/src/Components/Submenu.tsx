import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SidebarItem } from '../Models/SidebarItem';

type SidebarLinkProps = {
    item: SidebarItem;
};

const SidebarLink = styled(Link) 
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    font-size: 1.125rem;
    padding: 1rem;
    text-decoration: none;
    color: #ffffff;

    &:hover{
        background-color: #7d766e;
        border-left: 4px solid #ccc;
    };
;

const SidebarLabel = styled.span 
    margin-left: 1rem;
;

const DropdownLink = styled(Link)
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #043C8B;
    height: 3rem;
    font-size: 1.125rem;
    padding-left: 3rem;
    text-decoration: none;
    color: #ffffff;

    &:hover{
        background-color: #EA7600;
    };
;

const Submenu: FC<SidebarLinkProps> = ({item}) => {
    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);

    return ( <>
            <SidebarLink to={item.path} onClick={showSubnav}>
                <div>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div>{item?.subnav && subnav ? item?.iconOpened : item?.iconClosed }</div>
            </SidebarLink>
            {subnav && 
                item?.subnav?.map((subnavItem, index) => {
                    return (
                        <DropdownLink to={subnavItem.path} key={index} >
                            {subnavItem.icon}
                        <SidebarLabel>{subnavItem.title}</SidebarLabel>
                    </DropdownLink>
                    );
            })}
    </>
    );
};

export default Submenu;