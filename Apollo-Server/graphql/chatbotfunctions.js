const fs = require('fs');

async function generateNLU (knex, chatbot_version){
    const requests = await knex("request")
    .innerJoin('intention','request.intention_id',"=","intention.intention_id")
    .select("information","intention_name");
    let nlu_content = "version: \""+ chatbot_version +"\"\nnlu: \n";
    let auxIntention = 'null'
    for(let i=0 ; i < requests.length ; i++){
        if(requests[i]['intention_name'] == auxIntention){
            nlu_content = nlu_content + "   - "+requests[i]['information']+"\n"
        }else{
            auxIntention = requests[i]['intention_name']
            nlu_content = nlu_content + "- intent: "+auxIntention+"\n  examples: |\n"
            i = i - 1
        }
    }
    return nlu_content
}

async function generateRules (knex, chatbot_version){
    const routine_intention = await knex("routine_intention")
    .innerJoin('intention','routine_intention.intention_id',"=","intention.intention_id")
    .innerJoin('routine','routine_intention.routine_id',"=","routine.routine_id")
    .select("step_labbel","step_order","intention_name","title","type");   
    rules_content = "version: \""+chatbot_version+"\"\nrules: \n";
    let auxTitle = 'null'
    let auxValues = null
    for(let i=0 ; i < routine_intention.length ; i++){
        if(routine_intention[i]['type'] == 'rule'){
            if(routine_intention[i]['title'] == auxTitle){
                auxValues.push(routine_intention[i])
                //rules_content = rules_content + "  - "+routine_intention[i]['step_labbel']+": "+routine_intention[i]['intention_name']+"\n"
            }else{
                if(auxValues!=null){
                    auxValues.sort(function(a,b){
                        if(a['step_order'] > b['step_order']){
                            return 1;
                        }
                        if(a['step_order'] < b['step_order']){
                            return -1;
                        }else{
                            return 0;
                        }
                    })
                    for(let j = 0; j < auxValues.length;j++){
                        rules_content = rules_content + "  - "+auxValues[j]['step_labbel']+": "+auxValues[j]['intention_name']+"\n"
                    }
                    auxValues = new Array();
                }else{
                    auxValues = new Array();
                }
                auxTitle = routine_intention[i]['title']
                rules_content = rules_content + "- rule: "+auxTitle+"\n  steps:\n"
                i = i - 1
                //Procerso que guarda los pasos
            }  
        } 
    }
    for(let j = 0; j < auxValues.length;j++){
        rules_content = rules_content + "  - "+auxValues[j]['step_labbel']+": "+auxValues[j]['intention_name']+"\n"
    }
    return rules_content 
}

async function generateStories(knex,chatbot_version){
    const routine_intention = await knex("routine_intention")
    .innerJoin('intention','routine_intention.intention_id',"=","intention.intention_id")
    .innerJoin('routine','routine_intention.routine_id',"=","routine.routine_id")
    .select("step_labbel","step_order","intention_name","title","type");   
    stories_content = "version: \""+ chatbot_version +"\"\nstories: \n";
    let auxTitle = 'null'
    let auxValues = null
    for(let i=0 ; i < routine_intention.length ; i++){    
        if(routine_intention[i]['type'] == 'story'){
            if(routine_intention[i]['title'] == auxTitle){
                auxValues.push(routine_intention[i])
            }else{
                if(auxValues!=null){
                    auxValues.sort(function(a,b){
                        if(a['step_order'] > b['step_order']){
                            return 1;
                        }
                        if(a['step_order'] < b['step_order']){
                            return -1;
                        }else{
                            return 0;
                        }
                    })
                    for(let j = 0; j < auxValues.length;j++){
                        stories_content = stories_content + "  - "+auxValues[j]['step_labbel']+": "+auxValues[j]['intention_name']+"\n"
                    }
                    auxValues = new Array();
                }else{
                    auxValues = new Array();
                }
                auxTitle = routine_intention[i]['title']
                stories_content = stories_content + "- story: "+auxTitle+"\n  steps:\n"
                i = i - 1
            }
        }
    }
    for(let j = 0; j < auxValues.length;j++){
        stories_content = stories_content + "  - "+auxValues[j]['step_labbel']+": "+auxValues[j]['intention_name']+"\n"
    }
    return stories_content    
}

async function generateDomain_addIntention(knex,chatbot_version){
    const intentions = await knex("intention")
    .where("intention_name","not like","utter%")
    .andWhere("intention_name","not like","action%")
    .select("*");    
    domain_content = "version: \""+ chatbot_version +"\"\nconfig: \n store_entities_as_slots: true\nintents:\n";    
    for (let i = 0; i < intentions.length ; i++){
        domain_content = domain_content + " - "+intentions[i]['intention_name']+"\n"
    }
    return domain_content
}


async function generateDomain_addslots(knex, domain_content){
    const slots = await knex("slot")
    .select("*")
    domain_content = domain_content + "entities:\n"
    for(let i = 0 ; i < slots.length ; i++){
        domain_content = domain_content + "  - "+slots[i]['content']+"\n"
    }                
    domain_content = domain_content + "slots:\n"
    for(let i = 0 ; i < slots.length ; i++){
        domain_content = domain_content + " "+slots[i]['content']+":\n  type: "+slots[i]['slot_type']+"\n"
    }
    domain_content = domain_content + "responses:\n"
    return domain_content
}


async function generateDomain_addRWithB(knex, domain_content){
    const answer_withButtons = await knex("answer")
    .innerJoin('button','answer.answer_id',"=","button.answer_id")
    .innerJoin('intention','answer.intention_id',"=","intention.intention_id")
    .select("payload","title","information","intention_name")    
    let auxIntention = 'null'
    for(let i = 0 ; i < answer_withButtons.length ; i++){
        if(answer_withButtons[i]['intention_name'] == auxIntention){
            domain_content = domain_content + "    - payload: "+answer_withButtons[i]['payload']+"\n      title: "+answer_withButtons[i]['title']+"\n"
        }else{
            if(auxIntention != 'null'){
                domain_content = domain_content + "   text: "+answer_withButtons[i-1]['information']+"\n"
            }
            auxIntention = answer_withButtons[i]['intention_name']
            domain_content = domain_content+" "+auxIntention+":\n - buttons:\n"
            i = i - 1
        }
    }
    domain_content = domain_content + "   text: "+answer_withButtons[answer_withButtons.length-1]['information']+"\n"
    return domain_content
}

async function generateDomain_addRWithoutB(knex, domain_content){
    const answer_withoutButtons = await knex("answer")
    .leftJoin('button','answer.answer_id',"=","button.answer_id")
    .innerJoin('intention','answer.intention_id',"=","intention.intention_id")
    .whereNull("button.answer_id")
    .select("intention_name","information")    
    for(let i=0 ; i < answer_withoutButtons.length ; i++){
        domain_content = domain_content +" "+ answer_withoutButtons[i]['intention_name']+":\n  - text: "+answer_withoutButtons[i]['information']+"\n"
    }       
    return domain_content
}

async function generateDomain_addActions(knex, domain_content){
    const actions = await knex("intention")
    .where("intention_name","like","action%")
    .select("*")   
    domain_content = domain_content + "actions:\n"
    for(let i=0 ; i < actions.length;i++){
        domain_content = domain_content + " - "+actions[i]['intention_name']+"\n"
    }
    return domain_content + "forms: {}\ne2e_actions: []\nsesion_config:\n session_expiration_time: 60\n carry_over_slots_to_new_session: true"
}

async function generateDomain(knex, chatbot_version){
    let domain_content = "";
    domain_content = await generateDomain_addIntention(knex, chatbot_version)
    domain_content = await generateDomain_addslots(knex,domain_content)
    domain_content = await generateDomain_addRWithB(knex, domain_content)
    domain_content = await generateDomain_addRWithoutB(knex, domain_content)
    domain_content = await generateDomain_addActions(knex, domain_content)
    return domain_content
}

async function generatePLNFiles(knex){
    const aux = await knex("chatmessage")
    .innerJoin('intention','chatmessage.intention_id',"=","intention.intention_id")
    .where("intention_name","like","ask_%")
    .select("chatmessage_id")

    let lista_ids = new Array();
    for (let i = 0; i < aux.length ; i++){
        lista_ids.push(aux[i]['chatmessage_id'])
        lista_ids.push(aux[i]['chatmessage_id']+1)
    }
    const chatmessage = await knex("chatmessage")
    .whereIn("chatmessage_id", lista_ids)
    .select("information")

    var data = []
    var csv = 'Pregunta,Respuesta\n'
    for(let i = 0; i < chatmessage.length;i=i+2){
        data[i] = new Array ();
        data[i].push(chatmessage[i]['information'])
        data[i].push(chatmessage[i+1]['information'])
    }
    data.forEach(function(row){
        csv += row.join(',');
        csv += "\n";
    })
    return csv
}

async function generateFiles(name, content){
    fs.writeFile(name, content, function (err) {
        if (err) return console.log(err);
        console.log("Generated: "+name)
    });
}

module.exports = ({generateNLU,
    generateRules,
    generateStories,
    generateDomain,
    generatePLNFiles,
    generateFiles
})

