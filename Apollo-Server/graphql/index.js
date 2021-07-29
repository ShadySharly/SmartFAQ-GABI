require('dotenv').config();
const chatbot_funct = require('./chatbotfunctions');
const { gql } = require('apollo-server-core');
const {makeExecutableSchema} = require('graphql-tools');
const { GraphQLDateTime } = require("graphql-iso-date");
const fs = require('fs');
const { domain } = require('process');
var shell = require('shelljs');

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

const customScalarResolver = {
    Date: GraphQLDateTime
};

const typeDefs = gql`
    scalar Date

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
        response: String!
    }    

    type Answer {
        answer_id: Int!
        intention_id: Int!
        information: String!
        image_url: String!
        video_url: String!
    }

    type Chatbot{
        chatbot_id: Int!
        training_date: Date!
        confidence: Int!
        chatbot_version: String!
    }

    type Dialogue{
        dialogue_id: Int!
        client: Client!
        chatbot: Chatbot!
        start_dialog: Date!
        end_dialog: Date!
        client_score: Int!
    }

    type Chatmessage{
        chatmessage_id: Int!
        dialogue: Dialogue!
        intention: Intention!
        information: String!
        confidence: Int!
        date_issue: Date!
    }

    type Query {
        permissions: [Permission]
        permission(permission_id: Int!): Permission
        intentions: [Intention]
        intentionsOfRequest:[Intention]
        intentionByName(intention_name: String): Intention
        intention(intention_id: Int!): Intention
        client(client_id: Int!): Client
        userquestions: [Userquestion]
        userquestion(userquestion_id: Int!): Userquestion    
        requestByIntent(intention_id: Int!): [Request]
        chatmessagesByDialogue(dialogue_id: Int!): [Chatmessage]
    }

    type Mutation{
        createPermission(permission_name: String!): Boolean
        createIntention(intention_name: String!): Boolean
        createAnswer(intention_id: Int!, information: String!, image_url: String!, video_url: String!): Boolean
        updateIntention(intention_id: Int!, intention_name: String!): Boolean
        removeIntention(intention_id: Int!): Boolean
        createUserquestion(client_id: Int!,dialogue_id: Int!,information: String!): Boolean
        updateUserquestion(userquestion_id: Int!, intention_id: Int!,response: String!): Boolean
        removeUserquestion(userquestion_id: Int!): Boolean
        createRequest(intention_id: Int!, information: String!): Boolean
        updateRequest(request_id: Int!, intention_id: Int!, information: String!): Boolean
        removeRequest(request_id: Int!): Boolean
        createDialogue(client_id: Int!, chatbot_id: Int!): Int
        createChatmessage(dialogue_id: Int!, intention_id: Int!, information: String!, confidence: Int!): Boolean
        updateDialogue(dialogue_id: Int!,client_score: Int!): Boolean
        generateChatbotFiles(chatbot_version: String!): Boolean
        generatePLNFiles: Boolean
        trainChatbot: Boolean
        deployChatbot: Boolean
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
        async intentionsOfRequest(_, args){
            return await knex("intention").where("intention.intention_name","not like","utter%").select("*");
        },
        async intention(_,{intention_id}){
            return await knex("intention").where('intention_id',intention_id).select("*").first()
        },
        async intentionByName(_,{intention_name}){
            return await knex("intention").where('intention_name',intention_name).select("*").first()
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
            return await knex("request").where({intention_id:intention_id}).select("*")
        },
        async chatmessagesByDialogue(_,{dialogue_id}) {
            return await knex("chatmessage").where({dialogue_id:dialogue_id}).select("*")
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
                .insert({intention_name: intention_name});
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
        async createUserquestion(_,{client_id,dialogue_id, information}){
            try {
                const [userquestion] = await knex("userquestion")
                .returning("*")
                .insert({client_id, dialogue_id, information,response:'', intention_id: 0});
                return true                            
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async updateUserquestion(_,{userquestion_id,intention_id,response}){
            try {
                const [userquestion] = await knex("userquestion")
                .where({userquestion_id: userquestion_id})
                .update({intention_id:intention_id,response:response})
                .returning("*");
                if(userquestion==null){return false}
                else{
                    let information = userquestion['information']
                    await chatbot_funct.parseUserquestion(knex, intention_id, information,response)
                    return true
                }          
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async removeUserquestion(_,{userquestion_id}){
            try {
                const [userquestion] = await knex("userquestion")
                .returning("*")
                .where({userquestion_id: userquestion_id})
                .del(['userquestion_id', 'userquestion_id'], { includeTriggerModifications: true })
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
                    const [request] = await knex("request")
                    .returning("*")
                    .insert({information: information, intention_id: intention_id});
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
                let nlu_content = await chatbot_funct.generateNLU(knex,chatbot_version)             
                let rules_content = await chatbot_funct.generateRules(knex, chatbot_version)
                let stories_content = await chatbot_funct.generateStories(knex, chatbot_version)
                let domain_content = await chatbot_funct.generateDomain(knex, chatbot_version)
                await chatbot_funct.generateFiles('rules.yml', rules_content)
                await chatbot_funct.generateFiles('stories.yml', stories_content)
                await chatbot_funct.generateFiles('nlu.yml', nlu_content)
                await chatbot_funct.generateFiles('domain.yml', domain_content)
                return true
                
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async generatePLNFiles(_, args){
            try{
                let pln_contenct = await chatbot_funct.generatePLNFiles(knex)
                await chatbot_funct.generateFiles('information.csv', pln_contenct)
                return true
            }catch(err){
                console.error(err)
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
                shell.cd(root_path);                
                shell.exec('rasa train');
                shell.cd(__dirname)
                return true
            }catch(err){
                console.error(err)
                return false
            }
        },
        async deployChatbot(_,args){
            try{
                var root_path = __dirname.replace('/Apollo-Server/graphql','/RASA/')
                shell.cd(root_path)
                shell.exec('kill -9 $(lsof -t -i:5005)');
                shell.exec('kill -9 $(lsof -t -i:5055)');
                shell.exec('rasa run -m models --enable-api --cors "*" --debug',{async:true});
                shell.exec('rasa run actions',{async:true});   
                shell.cd(__dirname)          
                return true
            }catch(err){
                console.error(err)
                return false
            }
        },
        async createDialogue(_, {client_id, chatbot_id}) {
            try {
                var client_score = -1
                var start_dialogue = new Date();
                var end_dialogue = new Date();
                const [dialogue] = await knex("dialogue")
                .returning("*")
                .insert({client_id, chatbot_id, start_dialogue, end_dialogue,client_score});
                return dialogue['dialogue_id']                            
            } catch (error) {
                console.log(error)
                return -1
            }
        },
        async updateDialogue(_,{dialogue_id,client_score}){
            try {
                var end_dialogue = new Date();
                const [dialogue] = await knex("dialogue")
                .returning("*")
                .where({dialogue_id: dialogue_id})
                .update({client_score, end_dialogue}); 
                if(dialogue==null){return false}
                else{return true}          
            } catch (error) {
                console.log(error)
                return false
            }
        },
        async createChatmessage(_, {dialogue_id, intention_id, information, confidence}) {
            try {
                var date_issue = new Date();
                const [dialogue] = await knex("chatmessage")
                .returning("*")
                .insert({dialogue_id, intention_id, information, confidence,date_issue});
                return true                            
            } catch (error) {
                console.log(error)
                return false
            }
        },                
    },
};

const schema = makeExecutableSchema({
    customScalarResolver,
    typeDefs,
    resolvers,
});

module.exports = schema;