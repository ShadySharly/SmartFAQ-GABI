import React from 'react'; 
import styled from 'styled-components';



const StyledContainer = styled.div<{isSidebarOpen:boolean}>`
    width: ${({isSidebarOpen}) => (isSidebarOpen ? 'calc(100% - 250px)' : '100%')};
    height: 100%;
    transition: 350ms;
    margin-left: ${({isSidebarOpen}) => (isSidebarOpen ? '250px' : '0')};
    transition: 350ms;
    `
;

const SidebarWrap = styled.div ``;


type ContainerProps  = {isSidebarOpen:boolean, children:React.ReactNode} 

const Container = (props: ContainerProps) => {
    const isSidebarOpen = props.isSidebarOpen;
    return <StyledContainer isSidebarOpen={isSidebarOpen}>
        {props.children}
        </StyledContainer>
 }

 export default Container;