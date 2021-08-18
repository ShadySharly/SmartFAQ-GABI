//import Main from '../Views/Main'
import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, useLazyQuery, useQuery, gql } from '@apollo/client';
import ChatbotData from '../chatbotData'
import Chatbot from '../Views/Chatbot';
import Sidebar from '../Components/Sidebar';
import Container from '../Components/Container';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Overview from '../Views/Overview';
import React, { useState, useEffect } from "react";
import QueryAssignment from '../Views/QueryAssignment';
import IntentIndex from '../Views/IntentIndex';
import FaqIndex from '../Views/FaqIndex';
import GroupingIndex from '../Views/GroupingIndex';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import AuthContext from '../Context/auth-context';
import AdministrationIndex from '../Views/AdministrationIndex';

const GET_USER = gql`
  query getUser ($client_id: Int!) {
    client (client_id: $client_id) {
      client_id,
      first_name,
      last_name,
      email
    }
  }
`;

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:4000/graphql'
})

type Client = {
  client_id: number,
  first_name: string,
  last_name: string,
  email: string
}

const DefaultUser: Client = { client_id: -1, first_name: "", last_name: "", email: "" };

const App = () => {
  const [sidebarOpen, setSidebar] = useState(false);
  const showOpenSidebar = () => setSidebar(!sidebarOpen);

  const [user, setUser] = useState(DefaultUser);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleLogout = () => {
    setUser(DefaultUser);
    localStorage.clear();
  };

  const handleSignIn = (loggedClient: Client) => {
    console.log(loggedClient.client_id);
    setUser(loggedClient);
    localStorage.setItem("user", JSON.stringify(loggedClient));
  };

  return (
    <ApolloProvider client={client}>

      <Router>
        {user.client_id !== -1 ? (
          <div>
            <Sidebar isOpen={sidebarOpen} showSidebar={showOpenSidebar} />
            <Container isSidebarOpen={sidebarOpen}>
              <Switch>
                <Redirect from="/" to="/login" exact />
                <Route path="/register" component={Register} exact></Route>
                <Route path="/overview" component={Overview} exact></Route>
                <Route path="/movies" component={ChatbotData} exact></Route>
                <Route path="/generalFAQ" component={Chatbot} exact></Route>
                <Route path="/queryassignment" component={QueryAssignment} exact></Route>
                <Route path="/intentindex" component={IntentIndex} exact></Route>
                <Route path="/groupintention" component={GroupingIndex} exact></Route>
                <Route path="/faqindex" component={FaqIndex} exact></Route>
                <Route path="/adminindex" component={AdministrationIndex} exact></Route>
              </Switch>
            </Container>
          </div>
        ) : (
          <Login onHandleSignIn={handleSignIn} />
        )}
      </Router>

    </ApolloProvider>
  );
}



export default (App);