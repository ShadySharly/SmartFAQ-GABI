
CREATE TABLE topic(
    topic_id SERIAL PRIMARY KEY,
    topic_name varchar(256),
    topic_code varchar(256),
    topic_category int NOT NULL
);


CREATE TABLE duty (
    duty_id SERIAL PRIMARY KEY,
    duty_name varchar(64) NOT NULL
);

CREATE TABLE permission (
    permission_id SERIAL PRIMARY KEY,
    permission_name varchar(64) NOT NULL
);

CREATE TABLE intention (
    intention_id SERIAL PRIMARY KEY,
    intention_name varchar(32)
);

CREATE TABLE answer (
    answer_id SERIAL PRIMARY KEY,
    intention_id int,
    information varchar(256),
    image_url varchar(64),
    video_url varchar(64),
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id) 
        REFERENCES intention(intention_id) ON DELETE CASCADE        
);

CREATE TABLE chatbot(
    chatbot_id SERIAL PRIMARY KEY,
    topic_id int,
    training_date DATE,
    confidence int NOT NULL,
    chatbot_version varchar(256),
    CONSTRAINT fk_topic
        FOREIGN KEY(topic_id) 
        REFERENCES topic(topic_id) ON DELETE CASCADE    
);

CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,
    duty_id int NOT NULL,
    first_name varchar(64) NOT NULL,
    last_name varchar(64) NOT NULL,
    avatar_url varchar(128) NOT NULL,
    auth_key varchar(32) NOT NULL,
    email varchar(128) NOT NULL,
    CONSTRAINT fk_duty 
        FOREIGN KEY(duty_id) 
        REFERENCES duty(duty_id) ON DELETE CASCADE
);

CREATE TABLE permission_duty (
    permission_duty_id SERIAL PRIMARY KEY,
    duty_id int NOT NULL,
    permission_id int NOT NULL,
    CONSTRAINT fk_duty
        FOREIGN KEY(duty_id)
        REFERENCES duty(duty_id) ON DELETE CASCADE,
    CONSTRAINT fk_permission
        FOREIGN KEY(permission_id)
        REFERENCES permission(permission_id) ON DELETE CASCADE   
);

CREATE TABLE dialogue(
    dialogue_id SERIAL PRIMARY KEY,
    client_id int NOT NULL,
    chatbot_id int NOT NULL,    
    start_dialogue DATE,
    end_dialogue DATE,    
    client_score int NOT NULL,
    CONSTRAINT fk_client
        FOREIGN KEY(client_id)
        REFERENCES client(client_id) ON DELETE CASCADE,
    CONSTRAINT fk_chatbot
        FOREIGN KEY(chatbot_id)
        REFERENCES chatbot(chatbot_id) ON DELETE CASCADE             
);

CREATE TABLE chatMessage (
    chatMessage_id SERIAL PRIMARY KEY,
    dialogue_id int,
    intention_id int,
    information varchar(256),
    confidence int,
    date_issue date,
    CONSTRAINT fk_dialogue
        FOREIGN KEY(dialogue_id)
        REFERENCES dialogue(dialogue_id) ON DELETE CASCADE,
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id)
        REFERENCES intention(intention_id) ON DELETE CASCADE
);

CREATE TABLE request (
    request_id SERIAL PRIMARY KEY,
    intention_id int,
    information varchar(256),
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id)
        REFERENCES intention(intention_id) ON DELETE CASCADE
);

CREATE TABLE client_topic(
    client_topic_id SERIAL PRIMARY KEY,
    client_id int NOT NULL,
    topic_id int NOT NULL,
    CONSTRAINT fk_client
        FOREIGN KEY(client_id)
        REFERENCES client(client_id) ON DELETE CASCADE,
    CONSTRAINT fk_topic
        FOREIGN KEY(topic_id)
        REFERENCES topic(topic_id) ON DELETE CASCADE 
);

CREATE TABLE userQuestion (
    userQuestion_id SERIAL PRIMARY KEY,
    client_id int,
    dialogue_id int,
    intention_id int,
    information varchar(256),
    CONSTRAINT fk_client
        FOREIGN KEY(client_id)
        REFERENCES client(client_id) ON DELETE CASCADE,    
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id)
        REFERENCES intention(intention_id) ON DELETE CASCADE,
    CONSTRAINT fk_dialogue
        FOREIGN KEY(dialogue_id)
        REFERENCES dialogue(dialogue_id) ON DELETE CASCADE
);

INSERT INTO topic VALUES (1, 'General', 'Codigo 1', 1);
INSERT INTO topic VALUES (2, 'Calculo 1', 'Codigo 3', 2);

INSERT INTO duty VALUES (1, 'Alumno');
INSERT INTO duty VALUES (2, 'Mentor');
INSERT INTO duty VALUES (3, 'Cientista');

INSERT INTO permission VALUES (1, 'Interactuar con el chatbot');
INSERT INTO permission VALUES (2, 'Responder alumnos');
INSERT INTO permission VALUES (3, 'Agregar profesores');

INSERT INTO intention VALUES (0, 'Indeterminado');
INSERT INTO intention VALUES (1, 'place_library');
INSERT INTO intention VALUES (2, 'process_pagare_info');
INSERT INTO intention VALUES (3, 'content_pep1_calculo1');

INSERT INTO answer VALUES (1,1,'Se encuentra alfrente de finanzas','URL imagen','URL video');
INSERT INTO answer VALUES (2,2,'El pagare consiste en un documento que pacta el compromiso de un pago.','URL imagen','URL video');
INSERT INTO answer VALUES (3,3,'En la PEP1 de calculo 1 entra derivadas, suma y resta.','URL imagen','URL video');

INSERT INTO chatbot VALUES (1,1,'2002-02-16 20:38:40',60,'1.0.1b');
INSERT INTO chatbot VALUES (2,2,'2002-02-16 20:40:40',50,'1.0.1c');

INSERT INTO client VALUES (1,1,'Carlos','Perez','URL Avatar','asdfxd123','email@email.com');
INSERT INTO client VALUES (2,2,'Matias','Coronado','URL Avatar','canito123','email@email.com');
INSERT INTO client VALUES (3,3,'Bryan','Santelices','URL Avatar','macaco123','email@email.com');

INSERT INTO permission_duty VALUES (1,1,1);
INSERT INTO permission_duty VALUES (2,2,2);
INSERT INTO permission_duty VALUES (3,3,3);

INSERT INTO dialogue VALUES (1,1,1,'2002-02-16 20:38:40','2002-02-16 20:50:40',3);
INSERT INTO chatMessage VALUES (1,1,1,'¿Como puedo llegar a la libreria?',70,'2002-02-16 20:50:40');
INSERT INTO request VALUES (1,1,'¿Donde esta la libreria?');
INSERT INTO client_topic VALUES (1,1,1);

INSERT INTO userQuestion VALUES (1,1,1,0,'¿como puedo integrar?');
INSERT INTO userQuestion VALUES (2,1,1,3,'dime como puedo integrar');
INSERT INTO userQuestion VALUES (3,1,1,1,'¿como podia llegar al biblio?');
