require('dotenv').config();
const { gql } = require('apollo-server-core');
const {makeExecutableSchema} = require('graphql-tools');
const fs = require('fs');
const { domain } = require('process');


function generateNLU (requests, chatbot_version){
    nlu_content = "version: \""+ chatbot_version +"\"\nnlu: \n";
    let auxIntention = 'null'
    for(let i=0 ; i < requests.length ; i++){
        if(requests[i]['intention_name'] == auxIntention){
            nlu_content = nlu_content + "\t\t- "+requests[i]['information']+"\n"
        }else{
            auxIntention = requests[i]['intention_name']
            nlu_content = nlu_content + "- intent: "+auxIntention+"\n \texamples: |\n"
            i = i - 1
        }
    }
    return nlu_content
}

function generateRules (routine_intention, chatbot_version){
    rules_content = "version: \""+chatbot_version+"\"\nrules: \n";
    let auxTitle = 'null'
    for(let i=0 ; i < routine_intention.length ; i++){
        if(routine_intention[i]['type'] == 'rule'){
            if(routine_intention[i]['title'] == auxTitle){
                rules_content = rules_content + "\t- "+routine_intention[i]['step_labbel']+": "+routine_intention[i]['intention_name']+"\n"
            }else{
                auxTitle = routine_intention[i]['title']
                rules_content = rules_content + "- rule: "+auxTitle+"\n \tsteps:\n"
                i = i - 1
            }  
        } 
    }
    return rules_content 
}

function generateStories(routine_intention,chatbot_version){
    stories_content = "version: \""+ chatbot_version +"\"\nstories: \n";
    let auxTitle = 'null'
    for(let i=0 ; i < routine_intention.length ; i++){    
        if(routine_intention[i]['type'] == 'story'){
            if(routine_intention[i]['title'] == auxTitle){
                stories_content = stories_content + "\t- "+routine_intention[i]['step_labbel']+": "+routine_intention[i]['intention_name']+"\n"
            }else{
                auxTitle = routine_intention[i]['title']
                stories_content = stories_content + "- story: "+auxTitle+"\n \tsteps:\n"
                i = i - 1
            }
        }
    }
    return stories_content    
}

function generateDomain_addIntention(intentions,chatbot_version){
    domain_content = "version: \""+ chatbot_version +"\"\nconfig: \n\tstore_entities_as_slots: true\nintents:\n";    
    for (let i = 0; i < intentions.length ; i++){
        domain_content = domain_content + "\t- "+intentions[i]['intention_name']+"\n"
    }
    return domain_content
}


function generateDomain_addslots(slots, domain_content){
    domain_content = domain_content + "entities:\n"
    for(let i = 0 ; i < slots.length ; i++){
        domain_content = domain_content + "\t - "+slots[i]['content']+"\n"
    }                
    domain_content = domain_content + "slots:\n"
    for(let i = 0 ; i < slots.length ; i++){
        domain_content = domain_content + "\t"+slots[i]['content']+":\n\t\ttype: "+slots[i]['slot_type']+"\n"
    }
    domain_content = domain_content + "responses:\n"
    return domain_content
}


function generateDomain_addRWithB(answer_withButtons, domain_content){
    let auxIntention = 'null'
    for(let i = 0 ; i < answer_withButtons.length ; i++){
        if(answer_withButtons[i]['intention_name'] == auxIntention){
            domain_content = domain_content + "\t\t- payload: "+answer_withButtons[i]['payload']+"\n\t\t\ttitle: "+answer_withButtons[i]['title']+"\n"
        }else{
            if(auxIntention != 'null'){
                domain_content = domain_content + "\t\ttext: "+answer_withButtons[i-1]['information']+"\n"
            }
            auxIntention = answer_withButtons[i]['intention_name']
            domain_content = domain_content+"\t"+auxIntention+":\n\t- buttons:\n"
            i = i - 1
        }
    }
    return domain_content
}

function generateDomain_addRWithoutB(answer_withoutButtons, domain_content){
    for(let i=0 ; i < answer_withoutButtons.length ; i++){
        domain_content = domain_content +"\t"+ answer_withoutButtons[i]['intention_name']+":\n\t\ttext: "+answer_withoutButtons[i]['information']+"\n"
    }       
    return domain_content
}

function generateDomain_addActions(actions, domain_content){
    domain_content = domain_content + "actions:\n"
    for(let i=0 ; i < actions.length;i++){
        domain_content = domain_content + "\t- "+actions[i]['intention_name']+"\n"
    }
    return domain_content + "forms: {}\ne2e_actions: []\nsesion_config:\n\tsession_expiration_time: 60\n\tcarry_over_slots_to_new_session: true"
}

function generateFiles(name, content){
    fs.writeFile(name, content, function (err) {
        if (err) return console.log(err);
        console.log("Generated: "+name)
    });
}

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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

    type Userquestion {
        userquestion_id: Int!
        intention: Intention!
        information: String!
    }    

    type Query {
        permissions: [Permission]
        permission(permission_id: Int!): Permission
        intentions: [Intention]
        intention(intention_id: Int!): Intention
        userquestions: [Userquestion]
        userquestion(userquestion_id: Int!): Userquestion        
    }

    type Mutation{
        createPermission(permission_name: String!): Boolean
        createIntention(intention_name: String!): Boolean
        updateIntention(intention_id: Int!, intention_name: String!): Boolean
        removeIntention(intention_id: Int!): Boolean
        updateUserquestion(userquestion_id: Int!, intention_id: Int!): Boolean
        generateChatbotFiles: Boolean
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
        async userquestions(_,args){ 
            const userquestions = await knex("userquestion").select("*")
            const intentionIds = Array.from(new Set(userquestions.map((t) => t.intention_id)))
            const intentions = await knex('intention').whereIn('intention_id', intentionIds)
            return userquestions.map((t) => {
                return {
                  ...t,
                  intention: intentions.find((u) => u.intention_id === t.intention_id),
                }
              })
        },
        async userquestion(_,{userquestion_id}){
            const userquestion = await knex("userquestion").where('userquestion_id',userquestion_id).select("*")
            const intentionId = userquestion.map((t) => t.intention_id)
            const intention = await knex('intention').whereIn('intention_id', intentionId).select("*")
            return userquestion.map((t) => {
                return {
                  ...t,
                  intention: intention.find((u) => u.intention_id === t.intention_id),
                }
              })[0]
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
        async generateChatbotFiles(_, args){
            try {
                //obtener version del chatbot mas actual
                const [chatbot] = await knex('chatbot')
                .orderBy('chatbot_id','desc')
                .select("chatbot_version");
                chatbot_version = chatbot['chatbot_version']
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

                ////////////////////////////NLU/////////////////////////
                const requests = await knex("request")
                .innerJoin('intention','request.intention_id',"=","intention.intention_id")
                .select("information","intention_name");
                nlu_content = generateNLU(requests,chatbot_version)
                
                ////////////////////////////RULES AND STORIES////////////////////////
                const routine_intention = await knex("routine_intention")
                .innerJoin('intention','routine_intention.intention_id',"=","intention.intention_id")
                .innerJoin('routine','routine_intention.routine_id',"=","routine.routine_id")
                .select("step_labbel","step_order","intention_name","title","type");                
                rules_content = generateRules(routine_intention, chatbot_version)
                stories_content = generateStories(routine_intention, chatbot_version)

                ////////////////////////////DOMAIN////////////////////////
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
                domain_content = generateDomain_addIntention(intentions, chatbot_version)
                domain_content = generateDomain_addslots(slots,domain_content)
                domain_content = generateDomain_addRWithB(answer_withButtons, domain_content)
                domain_content = generateDomain_addRWithoutB(answer_withoutButtons, domain_content)
                domain_content = generateDomain_addActions(actions, domain_content)

                generateFiles('rules.yml', rules_content)
                generateFiles('stories.yml', stories_content)
                generateFiles('nlu.yml', nlu_content)
                generateFiles('domain.yml', domain_content)

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