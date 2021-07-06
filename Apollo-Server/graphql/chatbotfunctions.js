const fs = require('fs');

function generateNLU (requests, chatbot_version){
    nlu_content = "version: \""+ chatbot_version +"\"\nnlu: \n";
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

function generateRules (routine_intention, chatbot_version){
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

function generateStories(routine_intention,chatbot_version){
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

function generateDomain_addIntention(intentions,chatbot_version){
    domain_content = "version: \""+ chatbot_version +"\"\nconfig: \n store_entities_as_slots: true\nintents:\n";    
    for (let i = 0; i < intentions.length ; i++){
        domain_content = domain_content + " - "+intentions[i]['intention_name']+"\n"
    }
    return domain_content
}


function generateDomain_addslots(slots, domain_content){
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


function generateDomain_addRWithB(answer_withButtons, domain_content){
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

function generateDomain_addRWithoutB(answer_withoutButtons, domain_content){
    for(let i=0 ; i < answer_withoutButtons.length ; i++){
        domain_content = domain_content +" "+ answer_withoutButtons[i]['intention_name']+":\n  - text: "+answer_withoutButtons[i]['information']+"\n"
    }       
    return domain_content
}

function generateDomain_addActions(actions, domain_content){
    domain_content = domain_content + "actions:\n"
    for(let i=0 ; i < actions.length;i++){
        domain_content = domain_content + " - "+actions[i]['intention_name']+"\n"
    }
    return domain_content + "forms: {}\ne2e_actions: []\nsesion_config:\n session_expiration_time: 60\n carry_over_slots_to_new_session: true"
}

function generateFiles(name, content){
    fs.writeFile(name, content, function (err) {
        if (err) return console.log(err);
        console.log("Generated: "+name)
    });
}

module.exports = ({generateNLU,
    generateRules,
    generateStories,
    generateDomain_addIntention,
    generateDomain_addslots,
    generateDomain_addRWithB,
    generateDomain_addRWithoutB,
    generateDomain_addActions,
    generateFiles
})

