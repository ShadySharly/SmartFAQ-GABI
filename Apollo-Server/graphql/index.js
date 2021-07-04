require('dotenv').config();
const chatbot_funct = require('./chatbotfunctions');
const { gql } = require('apollo-server-core');
const {makeExecutableSchema} = require('graphql-tools');
const fs = require('fs');
const { domain } = require('process');
var shell = require('shelljs');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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

    type Request{
        request_id: Int!
        intention: Intention
        information: String!
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
        createRequest(intention_id: Int!, information: String!): Boolean
        updateRequest(request_id: Int!, intention_id: Int!, information: String!): Boolean
        removeRequest(request_id: Int!): Boolean
        generateChatbotFiles(chatbot_version: String!): Boolean
        trainChatbot:Boolean
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
                const [aux] = await knex("intention")
                .max('intention_id')
                let current_id = aux['max']+1
                const [intention] = await knex("intention")
                .returning("*")
                .insert({intention_id:current_id,intention_name: intention_name});
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
        },
        async createRequest(_,{intention_id,information}){
            try {
                const [intention] = await knex("intention")
                .returning("*")
                .where({intention_id: intention_id})
                if(intention==null){return false}
                else{
                    const [aux] = await knex("request")
                    .max('request_id')
                    let current_id = aux['max']+1
                    const [request] = await knex("request")
                    .returning("*")
                    .insert({request_id:current_id,information: information, intention_id: intention_id});
                    return true
                }                        
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async updateRequest(_,{request_id,intention_id,information}){
            try {
                const [intention] = await knex("intention")
                .returning("*")
                .where({intention_id: intention_id})
                if(intention==null){return false}
                else{                
                    const [request] = await knex("request")
                    .returning("*")
                    .where({request_id: request_id})
                    .update({intention_id:intention_id, information:information}); 
                    if(request==null){return false}
                    else{return true}  
                }        
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async removeRequest(_,{request_id}){
            try {
                const [request] = await knex("request")
                .returning("*")
                .where({request_id: request_id})
                .del(['request_id', 'request_id'], { includeTriggerModifications: true })
                if(request==null){return false}
                else{return true}          
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async generateChatbotFiles(_, {chatbot_version}){
            try {
                let nlu_content = "";
                let rules_content = "";
                let stories_content = "";
                let domain_content = "";

                const intentions = await knex("intention")
                .where("intention_name","not like","utter%")
                .andWhere("intention_name","not like","action%")
                .select("*");
                let lista = new Array();
                for (let i = 0; i < intentions.length ; i++){
                    lista.push(intentions[i]['intention_id'])
                }
                const requests = await knex("request")
                .innerJoin('intention','request.intention_id',"=","intention.intention_id")
                .select("information","intention_name");
                nlu_content = chatbot_funct.generateNLU(requests,chatbot_version)
                
                const routine_intention = await knex("routine_intention")
                .innerJoin('intention','routine_intention.intention_id',"=","intention.intention_id")
                .innerJoin('routine','routine_intention.routine_id',"=","routine.routine_id")
                .select("step_labbel","step_order","intention_name","title","type");                
                rules_content = chatbot_funct.generateRules(routine_intention, chatbot_version)
                stories_content = chatbot_funct.generateStories(routine_intention, chatbot_version)

                const slots = await knex("slot")
                .select("*")
                const answer_withButtons = await knex("answer")
                .innerJoin('button','answer.answer_id',"=","button.answer_id")
                .innerJoin('intention','answer.intention_id',"=","intention.intention_id")
                .select("payload","title","information","intention_name")
                const answer_withoutButtons = await knex("answer")
                .leftJoin('button','answer.answer_id',"=","button.answer_id")
                .innerJoin('intention','answer.intention_id',"=","intention.intention_id")
                .whereNull("button.answer_id")
                .select("intention_name","information")
                const actions = await knex("intention")
                .where("intention_name","like","action%")
                .select("*")
                domain_content = chatbot_funct.generateDomain_addIntention(intentions, chatbot_version)
                domain_content = chatbot_funct.generateDomain_addslots(slots,domain_content)
                domain_content = chatbot_funct.generateDomain_addRWithB(answer_withButtons, domain_content)
                domain_content = chatbot_funct.generateDomain_addRWithoutB(answer_withoutButtons, domain_content)
                domain_content = chatbot_funct.generateDomain_addActions(actions, domain_content)

                chatbot_funct.generateFiles('rules.yml', rules_content)
                chatbot_funct.generateFiles('stories.yml', stories_content)
                chatbot_funct.generateFiles('nlu.yml', nlu_content)
                chatbot_funct.generateFiles('domain.yml', domain_content)

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async trainChatbot(_,args){
            try{
                var root_path = __dirname.replace('/Apollo-Server/graphql','/RASA/')
                fs.unlinkSync(root_path+'data/nlu.yml') 
                fs.unlinkSync(root_path+'data/rules.yml')   
                fs.unlinkSync(root_path+'data/stories.yml')   
                fs.unlinkSync(root_path+'domain.yml')
                fs.rename('nlu.yml',root_path+'data/nlu.yml',function(err){if(err) throw err})
                fs.rename('rules.yml',root_path+'data/rules.yml',function(err){if(err) throw err})
                fs.rename('stories.yml',root_path+'data/stories.yml',function(err){if(err) throw err})
                fs.rename('domain.yml',root_path+'domain.yml',function(err){if(err) throw err})                
                shell.exec('kill -9 $(lsof -t -i:5005)');
                shell.exec('kill -9 $(lsof -t -i:5055)');
                shell.cd(root_path);
                shell.exec('rasa run -m models --enable-api --cors "*" --debug',{async:true});
                shell.exec('rasa run actions',{async:true});
                shell.cd(__dirname)
                return true
            }catch(err){
                console.error(err)
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