//import Main from '../Views/Main'
import './App.css';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import { render } from '@testing-library/react';
import Movies from '../movies';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

function App() {
  return (
    <div className="App">
      <Movies/>
    </div>
  );
}

render(
  <ApolloProvider client={client}>
    </ApolloProvider>,
);

export default App;
