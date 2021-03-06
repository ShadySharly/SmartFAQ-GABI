import React from 'react'; 
import styled from 'styled-components';



const StyledContainer = styled.div<{isSidebarOpen:boolean}>`
    width: ${({isSidebarOpen}) => (isSidebarOpen ? 'calc(100% - 250px)' : '100%')};
    height: calc(100vh - 48px);
    transition: 350ms;
    margin-left: ${({isSidebarOpen}) => (isSidebarOpen ? '250px' : '0')};
    transition: 350ms;
`

type ContainerProps  = {isSidebarOpen:boolean, children:React.ReactNode} 

const Container = (props: ContainerProps) => {
    const isSidebarOpen = props.isSidebarOpen;
    return <StyledContainer isSidebarOpen={isSidebarOpen}>
        {props.children}
        </StyledContainer>
 }

 export default Container;