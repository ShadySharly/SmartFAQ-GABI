//import Main from '../Views/Main'
import './App.css';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import ChatbotData from '../chatbotData'
import Chatbot from '../Views/Chatbot';
import Sidebar from '../Components/Sidebar';
import Container from '../Components/Container';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Overview from '../Views/Overview';
import { useState } from 'react';
import QueryAssignment from '../Views/QueryAssignment';
import IntentIndex from '../Views/IntentIndex';

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:4000/graphql'
})



const App = () => { 
    const [sidebarOpen, setSidebar] = useState(false);
    const showOpenSidebar = () => setSidebar(!sidebarOpen);
    return (
        <ApolloProvider client={client}>
        <Router>
          <Sidebar isOpen={sidebarOpen} showSidebar={showOpenSidebar} />
            <Container isSidebarOpen={sidebarOpen}>
                <Switch>
                    <Route path="/overview" component={Overview} exact></Route>
                    <Route path="/movies" component={ChatbotData} exact></Route>
                    <Route path="/generalFAQ" component={Chatbot} exact></Route>
                    <Route path="/queryassignment" component={QueryAssignment} exact></Route>
                    <Route path="/intentindex" component={IntentIndex} exact></Route>
                </Switch>
            </Container>
        </Router>
    </ApolloProvider>
  );
}



export default (App);