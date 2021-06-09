require('dotenv').config();
const { gql } = require('apollo-server-core');
const {makeExecutableSchema} = require('graphql-tools');
const movies = require('../data.js');
const knex = require("knex")({
    client:"pg",
    connection:{
        host:"localhost",
        user:"postgres",
        password:"gabi123",
        database:"gabidata"
    }
});
const typeDefs = gql`
    type Permission {
        permission_id: Int!
        permission_name: String!
    }

    type Query {
        permissions: [Permission]
        permission(permission_id: Int!): Permission
    }

    type Mutation{
        createPermission(name: String!): Boolean
    }
`;

const resolvers = {
    Query: {
        async permissions(_, args){
            return await knex("permission").select("*");
        },
        async permission(_,{id}){
            return await knex("permission").whereIn("id_permission",id)
        },
    },
    
    Mutation: {
        async createPermission(_,{name}){
            const [permission] = await knex("permission")
            .returning("*")
            .insert({name});
            return permission
        },
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;