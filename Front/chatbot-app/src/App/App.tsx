//import Main from '../Views/Main'
import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import ChatbotData from '../chatbotData'
import Chatbot from '../Views/Chatbot';
import Sidebar from '../Components/Sidebar';
import Container from '../Components/Container';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Overview from '../Views/Overview';
import { useState, useEffect } from "react";
import QueryAssignment from '../Views/QueryAssignment';
import IntentIndex from '../Views/IntentIndex';
import FaqIndex from '../Views/FaqIndex';
import GroupingIndex from '../Views/GroupingIndex';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import AdministrationIndex from '../Views/AdministrationIndex';

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:4000/graphql'
})

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

const App = () => {
  const [sidebarOpen, setSidebar] = useState(false);
  const showOpenSidebar = () => setSidebar(!sidebarOpen);

  const [user, setUser] = useState(DefaultUser);
  console.log(user.duty.duty_id);

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

  return (
    <ApolloProvider client={client}>
      <Router>
        {user.client_id !== -1 ? (
          <div>
            <Sidebar isOpen={sidebarOpen} showSidebar={showOpenSidebar} />
            <Container isSidebarOpen={sidebarOpen}>
              <Switch>
                <Redirect from="/" to="/overview" exact />
                <Route path="/overview" component={Overview} exact></Route>

                {user.duty.duty_id === 1 ? (
                  <Route path="/generalFAQ" component={Chatbot} exact></Route>
                ) : (
                  user.duty.duty_id === 2 ? (
                    <div>
                      <Route path="/queryassignment" component={QueryAssignment} exact></Route>
                      <Route path="/intentindex" component={IntentIndex} exact></Route>
                      <Route path="/groupintention" component={GroupingIndex} exact></Route>
                      <Route path="/faqindex" component={FaqIndex} exact></Route>
                    </div>
                  ) : (
                    <div>
                      <Route path="/intentindex" component={IntentIndex} exact></Route>
                      <Route path="/groupintention" component={GroupingIndex} exact></Route>
                      <Route path="/faqindex" component={FaqIndex} exact></Route>
                      <Route path="/adminindex" component={AdministrationIndex} exact></Route>
                    </div>
                  )
                )}
              </Switch>
            </Container>
          </div>
        ) : (
          <Switch>
            <Redirect from="/" to="/login" exact />
            <Route path="/register" component={Register} exact></Route>
            <Route path="/login" render={() => <Login setActiveUser={setUser} />} exact></Route>
          </Switch>

        )}
      </Router>

    </ApolloProvider>
  );
}



export default (App);