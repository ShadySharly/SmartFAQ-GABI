require('dotenv').config();
const {makeExecutableSchema} = require('graphql-tools');
const movies = require('../data.js');

const typeDefs = `
    type Movie {
        id: Int!
        title: String!
    }

    type Query {
        movies: [Movie]
        movie(id: Int!): Movie
    }

    type Mutation{
        createMovie(title: String!): Boolean
    }
`;

const resolvers = {
    Query: {
        async movies(_, args){
            return await movies;
        },
        async movie(_,{id}){
            return await movies.find((movie)=> movie.id === id);
        },
    },
    
    Mutation: {
        async createMovie(_,{title}){
            let newMovie = {
                id: movies.length,
                title,
            };
            return await movies.push(newMovie); 
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;