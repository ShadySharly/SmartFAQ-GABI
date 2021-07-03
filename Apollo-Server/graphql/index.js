require('dotenv').config();
const { gql } = require('apollo-server-core');
const {makeExecutableSchema} = require('graphql-tools');
const movies = require('../data.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const knex = require("knex")({
    client:"pg",
    connection:{
        host:"ec2-54-163-254-204.compute-1.amazonaws.com",
        user:"nztcvlwuphyxdn",
        password:"bfae001ab6a28f99ba644460cb696ee8476aec9e6df4d69befbc2baaaa8fbe5c",
        database:"df0iofqaap79fh",
        ssl: true
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

    type Client {
        client_id: Int!
        first_name: String!
        last_name: String!
        email: String!
    }

    type Userquestion {
        userquestion_id: Int!
        client: Client!
        intention: Intention!
        information: String!
    }    

    type Answer {
        answer_id: Int!
        intention_id: Int!
        information: String!
        image_url: String!
        video_url: String!
    }

    type Request {
        request_id: Int!
        information: String!
    }

    type Query {
        permissions: [Permission]
        permission(permission_id: Int!): Permission
        intentions: [Intention]
        intention(intention_id: Int!): Intention
        client(client_id: Int!): Client
        userquestions: [Userquestion]
        userquestion(userquestion_id: Int!): Userquestion    
        requestByIntent(intention_id: Int!): [Request]
    }

    type Mutation{
        createPermission(permission_name: String!): Boolean
        createIntention(intention_name: String!): Boolean
        createAnswer(intention_id: Int!, information: String!, image_url: String!, video_url: String!): Boolean
        updateIntention(intention_id: Int!, intention_name: String!): Boolean
        removeIntention(intention_id: Int!): Boolean
        updateUserquestion(userquestion_id: Int!, intention_id: Int!): Boolean
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
        async client(_, {client_id}){
            return await knex("client").where('client_id', client_id).select("*").first()
        },
        async userquestions(_,args){ 
            const userquestions = await knex("userquestion").select("*")
            const intentionIds = Array.from(new Set(userquestions.map((t) => t.intention_id)))
            const intentions = await knex('intention').whereIn('intention_id', intentionIds)       
            
            const clientIds = Array.from(new Set(userquestions.map((t) => t.client_id)))
            const clients = await knex('client').whereIn('client_id', clientIds)

            return userquestions.map((t) => {
                return {
                  ...t,
                  client: clients.find((u) => u.client_id === t.client_id),
                  intention: intentions.find((u) => u.intention_id === t.intention_id),
                }
              })
        },
        async userquestion(_,{userquestion_id}){
            const userquestion = await knex("userquestion").where('userquestion_id',userquestion_id).select("*")
            const intentionId = userquestion.map((t) => t.intention_id)
            const intention = await knex('intention').whereIn('intention_id', intentionId).select("*")

            const clientId = userquestion.map((t) => t.client_id)
            const client = await knex('client').whereIn('client_id', clientId).select("*")

            return userquestion.map((t) => {
                return {
                  ...t,
                  client: client.find((u) => u.client_id === t.client_id),
                  intention: intention.find((u) => u.intention_id === t.intention_id),
                }
              })[0]
        },
        async requestByIntent(_,{intention_id}) {
            return await knex("request").where('intention_id', intention_id).select("*")
        }
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

        async updateUserquestion(_,{userquestion_id,intention_id}){
            try {
                const [userquestion] = await knex("userquestion")
                .returning("*")
                .where({userquestion_id: userquestion_id})
                .update({intention_id:intention_id}); 
                if(userquestion==null){return false}
                else{return true}          
            } catch (error) {
                console.log(error)
                return false
            }
        },
        
        async createAnswer(_, {intention_id, information, image_url, video_url}) {
            try {
                const [answer] = await knex("answer")
                .returning("*")
                .insert({intention_id, information, image_url, video_url});
                return true                            
            } catch (error) {
                console.log(error)
                return false
            }
        }

    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;