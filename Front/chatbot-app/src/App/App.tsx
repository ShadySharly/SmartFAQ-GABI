//import Main from '../Views/Main'
import './App.css';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import ChatbotData from '../chatbotData'
import Chatbot from '../Views/Chatbot';
import Sidebar from '../Components/Sidebar';
import Container from '../Components/Container';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import Overview from '../Views/Overview';
import { useState } from 'react';
import QueryAssignment from '../Views/QueryAssignment';
import IntentIndex from '../Views/IntentIndex';
import FaqIndex from '../Views/FaqIndex';
import GroupIntention from '../Views/GroupIntention';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import AuthContext from '../Context/auth-context';


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
                    <Redirect from="/" to="/login" exact/> 
                    <Route path="/login" component={Login} exact></Route>
                    <Route path="/register" component={Register} exact></Route>
                    <Route path="/overview" component={Overview} exact></Route>
                    <Route path="/movies" component={ChatbotData} exact></Route>
                    <Route path="/generalFAQ" component={Chatbot} exact></Route>
                    <Route path="/queryassignment" component={QueryAssignment} exact></Route>
                    <Route path="/intentindex" component={IntentIndex} exact></Route>
                    <Route path="/groupintention" component={GroupIntention} exact></Route>
                    <Route path="/faqindex" component={FaqIndex} exact></Route>
                </Switch>
            </Container>
        </Router>
      </ApolloProvider>
  );
}



export default (App);