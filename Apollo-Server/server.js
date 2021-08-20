const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const schema = require('./graphql');


const app = express();

const server = new ApolloServer({
    schema,
});

server.applyMiddleware({app});

app.listen(4000, ()=> {
    console.log("Server running on http://localhost:4000/graphql");
});