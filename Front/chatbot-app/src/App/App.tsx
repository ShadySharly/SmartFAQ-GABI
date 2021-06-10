//import Main from '../Views/Main'
import './App.css';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import Movies from '../movies';
import ChatbotData from '../chatbotData'
import Chatbot from '../Views/Chatbot';
import Sidebar from '../Components/Sidebar';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Overview from '../Views/Overview';
import { FC } from 'react';

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:4000/graphql'
})

const App: FC = () => {
  return (
    <ApolloProvider client={client}>
        <Router>
          <Sidebar/>
          <Switch>
            <Route path="/overview" component={Overview} exact></Route>
            <Route path="/movies" component={ChatbotData} exact></Route>
            <Route path="/generalFAQ" component={Chatbot} exact></Route>
          </Switch>
        </Router>
    </ApolloProvider>
  );
}



export default (App);