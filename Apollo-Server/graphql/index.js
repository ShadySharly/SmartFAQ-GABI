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

    type Intention {
        intention_id: Int!
        intention_name: String!
    }

    type Query {
        permissions: [Permission]
        permission(permission_id: Int!): Permission
        intentions: [Intention]
        intention(intention_id: Int!): Intention
    }

    type Mutation{
        createPermission(permission_name: String!): Boolean
        createIntention(intention_name: String!): Boolean
        updateIntention(intention_id: Int!, intention_name: String!): Boolean
        removeIntention(intention_id: Int!): Boolean
    }
`;

const resolvers = {
    Query: {
        async permissions(_, args){
            return await knex("permission").select("*");
        },
        async permission(_,{permission_id}){
            return await knex("permission").where('permission_id',permission_id).select("*").first()
        },
        async intentions(_, args){
            return await knex("intention").select("*");
        },
        async intention(_,{intention_id}){
            return await knex("intention").where('intention_id',intention_id).select("*").first()
        },
    },
    
    Mutation: {
        async createPermission(_,{permission_name}){
            try {
                const [permission] = await knex("permission")
                .returning("*")
                .insert({permission_name});
                return true                
            } catch (error) {
                console.log(error)
                return false
            }            
        },
        async createIntention(_,{intention_name}){
            try {
                const [intention] = await knex("intention")
                .returning("*")
                .insert({intention_name});
                return true                            
            } catch (error) {
                console.log(error)
                return false
            }

        },
        async updateIntention(_,{intention_id, intention_name}){
            try {
                const [intention] = await knex("intention")
                .returning("*")
                .where({intention_id: intention_id})
                .update({intention_name:intention_name});    
                if(intention==null){return false}
                else{return true}           
            } catch (error) {
                console.log(error)
                return false
            }

        },
        async removeIntention(_,{intention_id}){
            try {
                const [intention] = await knex("intention")
                .returning("*")
                .where({intention_id: intention_id})
                .del(['intention_id', 'intention_id'], { includeTriggerModifications: true })
                if(intention==null){return false}
                else{return true}          
            } catch (error) {
                console.log(error)
                return false
            }

        },
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;