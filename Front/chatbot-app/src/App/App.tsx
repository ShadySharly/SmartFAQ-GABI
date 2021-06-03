//import Main from '../Views/Main'
import './App.css';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import Movies from '../movies';

const cache = new InMemoryCache()

const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:4000/graphql'
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Movies/>
      </div>
    </ApolloProvider>
  );
}



export default (App);
