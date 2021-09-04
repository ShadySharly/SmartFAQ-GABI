
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


CREATE TABLE routine (
    routine_id SERIAL PRIMARY KEY,
    title varchar(256),
    type varchar(32)
);



CREATE TABLE routine_intention (
    routine_intention_id SERIAL PRIMARY KEY,
    routine_id int NOT NULL,
    intention_id int NOT NULL,
    step_order int,
    step_labbel varchar(256),
    CONSTRAINT fk_routine
        FOREIGN KEY(routine_id)
        REFERENCES routine(routine_id) ON DELETE CASCADE,    
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id)
        REFERENCES intention(intention_id) ON DELETE CASCADE
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

CREATE TABLE button (
    button_id SERIAL PRIMARY KEY,
    payload varchar(64),
    title varchar(64),
    answer_id int,
    CONSTRAINT fk_answer
        FOREIGN KEY(answer_id) 
        REFERENCES answer(answer_id) ON DELETE CASCADE         
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

CREATE TABLE slot(
    slot_id SERIAL PRIMARY KEY,
    content varchar(64),
    slot_type varchar(64),
    chatbot_id int,
    CONSTRAINT fk_chatbot
        FOREIGN KEY(chatbot_id) 
        REFERENCES chatbot(chatbot_id) ON DELETE CASCADE        
);

CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,
    duty_id int NOT NULL,
    first_name varchar(64) NOT NULL,
    last_name varchar(64) NOT NULL,
    avatar_url varchar(128) NOT NULL,
    auth_key varchar(128) NOT NULL,
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
    response varchar(256),
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

INSERT INTO intention VALUES (0, 'Invalido'); 
INSERT INTO intention VALUES (1, 'login'); 
INSERT INTO intention VALUES (51, 'save');
INSERT INTO intention VALUES (2, 'greet');
INSERT INTO intention VALUES (3, 'goodbye');
INSERT INTO intention VALUES (4, 'affirm');
INSERT INTO intention VALUES (5, 'deny');
INSERT INTO intention VALUES (6, 'mood_great');
INSERT INTO intention VALUES (7, 'mood_unhappy');
INSERT INTO intention VALUES (8, 'bot_challenge');
INSERT INTO intention VALUES (9, 'ask_place');
INSERT INTO intention VALUES (10, 'ask_process');
INSERT INTO intention VALUES (11, 'ask_courses');
INSERT INTO intention VALUES (12, 'ask_place_EAO');
INSERT INTO intention VALUES (13, 'ask_place_library');
INSERT INTO intention VALUES (14, 'ask_process_pagare');
INSERT INTO intention VALUES (15, 'ask_process_date_pagare');
INSERT INTO intention VALUES (16, 'ask_process_req_pagare');
INSERT INTO intention VALUES (17, 'ask_process_info_pagare');
INSERT INTO intention VALUES (18, 'ask_courses_calculo1');
INSERT INTO intention VALUES (19, 'ask_date_pep1_calculo1');
INSERT INTO intention VALUES (20, 'ask_about_calculo1_derivative');
INSERT INTO intention VALUES (21, 'ask_content_pep1_calculo1');
INSERT INTO intention VALUES (43, 'bad_evaluate');
INSERT INTO intention VALUES (44, 'regular_evaluate');
INSERT INTO intention VALUES (45, 'good_evaluate');


INSERT INTO intention VALUES (22, 'utter_question');
INSERT INTO intention VALUES (23, 'utter_place');
INSERT INTO intention VALUES (24, 'utter_place_EAO');
INSERT INTO intention VALUES (25, 'utter_place_library');
INSERT INTO intention VALUES (26, 'utter_process');
INSERT INTO intention VALUES (27, 'utter_process_pagare');
INSERT INTO intention VALUES (28, 'utter_date_pagare');
INSERT INTO intention VALUES (29, 'utter_req_pagare');
INSERT INTO intention VALUES (30, 'utter_info_pagare');
INSERT INTO intention VALUES (31, 'utter_courses');
INSERT INTO intention VALUES (32, 'utter_courses_calculo1');
INSERT INTO intention VALUES (33, 'utter_date_pep1_calculo1');
INSERT INTO intention VALUES (34, 'utter_content_pep1_calculo1');
INSERT INTO intention VALUES (35, 'utter_about_calculo1_derivative');
INSERT INTO intention VALUES (36, 'utter_cheer_up');
INSERT INTO intention VALUES (37, 'utter_did_that_help');
INSERT INTO intention VALUES (38, 'utter_happy');
INSERT INTO intention VALUES (39, 'utter_goodbye');
INSERT INTO intention VALUES (40, 'utter_iamabot');
INSERT INTO intention VALUES (41, 'utter_ending_question');
INSERT INTO intention VALUES (42, 'utter_evaluate');
INSERT INTO intention VALUES (46, 'utter_bad_evaluate');
INSERT INTO intention VALUES (47, 'utter_moderate_evaluate');
INSERT INTO intention VALUES (48, 'utter_good_evaluate');
INSERT INTO intention VALUES (52, 'nlu_fallback');
INSERT INTO intention VALUES (53, 'utter_default');

INSERT INTO intention VALUES (49, 'action_init_conversation');
INSERT INTO intention VALUES (50, 'action_save_conversation');
INSERT INTO intention VALUES (54, 'action_fallback');

INSERT INTO answer VALUES (1,22,'¡Hola! ¿En que puedo ayudarte?','URL imagen','URL video');
INSERT INTO answer VALUES (2,23,'¿Que lugar buscas?','URL imagen','URL video');
INSERT INTO answer VALUES (3,24,'La EAO se encuentra en la av ecuador 500.','URL imagen','URL video');
INSERT INTO answer VALUES (4,25,'La biblioteca se encuentra al frente de finanzas','URL imagen','URL video');
INSERT INTO answer VALUES (5,26,'¿Que proceso buscas?','URL imagen','URL video');
INSERT INTO answer VALUES (6,27,'¿Que informacion buscas?','URL imagen','URL video');
INSERT INTO answer VALUES (7,28,'La fecha limite para pagar el pagare es el 20/10','URL imagen','URL video');
INSERT INTO answer VALUES (8,29,'Los requisitos para el pagar el pagare son los siguientes.','URL imagen','URL video');
INSERT INTO answer VALUES (9,30,'El pagare consiste en un documento que pacta el compromiso de un pago.','URL imagen','URL video');
INSERT INTO answer VALUES (10,31,'¿Sobre que curso?','URL imagen','URL video');
INSERT INTO answer VALUES (11,32,'¿Que quieres saber sobre Calculo 1?','URL imagen','URL video');
INSERT INTO answer VALUES (12,33,'Es el 5 de Marzo del 2020','URL imagen','URL video');
INSERT INTO answer VALUES (13,34,'En la PEP1 de calculo 1 entra derivadas, suma y resta.','URL imagen','URL video');
INSERT INTO answer VALUES (14,35,'Para derivar tienes que seguir las siguientes instrucciones ...','URL imagen','URL video');
INSERT INTO answer VALUES (15,36,'Aquí tienes algo para animarte','URL imagen','URL video');
INSERT INTO answer VALUES (16,37,'¿Ha sido de ayuda?','URL imagen','URL video');
INSERT INTO answer VALUES (17,38,'¡Genial! ¡Sigue adelante!','URL imagen','URL video');
INSERT INTO answer VALUES (18,39,'Adiós','URL imagen','URL video');
INSERT INTO answer VALUES (19,40,'Soy un bot, Rasa es mi motor.','URL imagen','URL video');


INSERT INTO answer VALUES (20,41,'¿Hay algo mas en lo que pueda ayudarte?','URL imagen','URL video');
INSERT INTO answer VALUES (21,42,'¿Que tan bien respondi?','URL imagen','URL video');
INSERT INTO answer VALUES (22,46,'¡Que mal!, seguire mejorando','URL imagen','URL video');
INSERT INTO answer VALUES (23,47,'Me alegra ser de ayuda!.','URL imagen','URL video');
INSERT INTO answer VALUES (24,48,'¡Exelente!, me alegra mucho','URL imagen','URL video');
INSERT INTO answer VALUES (25,53,'Aun no puedo responder esta pregunta. Se la mandare a un mentor!','URL imagen','URL video');

INSERT INTO request VALUES (1,1,'login');
INSERT INTO request VALUES (2,1,'register');

INSERT INTO request VALUES (3,2,'hola');
INSERT INTO request VALUES (4,2,'Hola hola');
INSERT INTO request VALUES (5,2,'Buenas tardes');
INSERT INTO request VALUES (6,2,'Buenos Dias!');
INSERT INTO request VALUES (7,2,'Que tal');
INSERT INTO request VALUES (8,2,'que hay');
INSERT INTO request VALUES (9,2,'vamos');
INSERT INTO request VALUES (10,2,'hola amigo');
INSERT INTO request VALUES (11,2,'hey');
INSERT INTO request VALUES (12,2,'qué onda');
INSERT INTO request VALUES (13,2,'buendia');
INSERT INTO request VALUES (14,2,'buenastardes');
INSERT INTO request VALUES (15,2,'Hola');
INSERT INTO request VALUES (16,2,'saludos');

INSERT INTO request VALUES (17,3,'hasta luego');
INSERT INTO request VALUES (18,3,'Adios');
INSERT INTO request VALUES (19,3,'bye');
INSERT INTO request VALUES (20,3,'despedida');
INSERT INTO request VALUES (21,3,'nos vemos');
INSERT INTO request VALUES (22,3,'que tenga un buen dia');
INSERT INTO request VALUES (23,3,'adios adios');
INSERT INTO request VALUES (24,3,'nos vemos despues');
INSERT INTO request VALUES (25,3,'salu2');
INSERT INTO request VALUES (26,3,'bye bye');
INSERT INTO request VALUES (27,3,'hasta pronto');

INSERT INTO request VALUES (28,4,'si');
INSERT INTO request VALUES (29,4,'si claro');
INSERT INTO request VALUES (30,4,'por supuesto');
INSERT INTO request VALUES (31,4,'ok');
INSERT INTO request VALUES (32,4,'afirmativo');
INSERT INTO request VALUES (33,4,'asi es');
INSERT INTO request VALUES (34,4,'sin duda');

INSERT INTO request VALUES (35,5,'no');
INSERT INTO request VALUES (36,5,'para nada');
INSERT INTO request VALUES (37,5,'no me gusta');
INSERT INTO request VALUES (38,5,'Nunca');
INSERT INTO request VALUES (39,5,'Claro que no');
INSERT INTO request VALUES (40,5,'jamas');
INSERT INTO request VALUES (41,5,'no no no');

INSERT INTO request VALUES (42,6,'perfecto');
INSERT INTO request VALUES (43,6,'grandioso');
INSERT INTO request VALUES (44,6,'Increible');
INSERT INTO request VALUES (45,6,'me siento como un rey');
INSERT INTO request VALUES (46,6,'maravilloso');
INSERT INTO request VALUES (47,6,'Me siento bien');
INSERT INTO request VALUES (48,6,'Estoy super bien');
INSERT INTO request VALUES (49,6,'me encuentro increible');
INSERT INTO request VALUES (50,6,'Voy a salvar al mundo');
INSERT INTO request VALUES (51,6,'emocionado');
INSERT INTO request VALUES (52,6,'extremadamente bien');
INSERT INTO request VALUES (53,6,'tan tan bien');
INSERT INTO request VALUES (54,6,'muy bien');
INSERT INTO request VALUES (55,6,'good');
INSERT INTO request VALUES (56,6,'bien');

INSERT INTO request VALUES (57,7,'mi dia estuvo horrible');
INSERT INTO request VALUES (58,7,'estoy triste');
INSERT INTO request VALUES (59,7,'No me siento mu bien');
INSERT INTO request VALUES (60,7,'Estoy decepcionado');
INSERT INTO request VALUES (61,7,'super triste');
INSERT INTO request VALUES (62,7,'Estoy muy triste');
INSERT INTO request VALUES (63,7,'triste');
INSERT INTO request VALUES (64,7,'tan triste');
INSERT INTO request VALUES (65,7,'infeliz');
INSERT INTO request VALUES (66,7,'nada bien');
INSERT INTO request VALUES (67,7,'no muy bien');
INSERT INTO request VALUES (68,7,'extremadamente triste');
INSERT INTO request VALUES (69,7,'muuuy tristeee');
INSERT INTO request VALUES (70,7,'Muy triste');
INSERT INTO request VALUES (71,7,'mal');

INSERT INTO request VALUES (72,8,'Eres un robot?');
INSERT INTO request VALUES (73,8,'¿eres un bot?');
INSERT INTO request VALUES (74,8,'Eres humano?');
INSERT INTO request VALUES (75,8,'¿estoy hablando con un bot?');
INSERT INTO request VALUES (76,8,'estoy hablando con una persona?');
INSERT INTO request VALUES (77,8,'Que eres?');
INSERT INTO request VALUES (78,8,'bot');

INSERT INTO request VALUES (79,9,'Que lugares puedo buscar');
INSERT INTO request VALUES (80,9,'Lugares que puedo buscar');
INSERT INTO request VALUES (81,9,'Que lugares puedo encontrar');
INSERT INTO request VALUES (82,9,'Lugares que puedo encontrar');
INSERT INTO request VALUES (83,9,'Que lugares encuentro');
INSERT INTO request VALUES (84,9,'Cuentame los lugares');
INSERT INTO request VALUES (85,9,'Dime los lugares');
INSERT INTO request VALUES (86,9,'Que lugares hay');
INSERT INTO request VALUES (87,9,'Que lugares');
INSERT INTO request VALUES (88,9,'Lugares ai');
INSERT INTO request VALUES (89,9,'Lugares');

INSERT INTO request VALUES (90,10,'Que procesos puedo ver');
INSERT INTO request VALUES (91,10,'Dime sobre los procesos');
INSERT INTO request VALUES (92,10,'Hablame sobre los procesos');
INSERT INTO request VALUES (93,10,'Cuentame sobre los procesos');
INSERT INTO request VALUES (94,10,'Que procesos hay actualmente');
INSERT INTO request VALUES (95,10,'Que procesos hay');
INSERT INTO request VALUES (96,10,'Q procesos hay');
INSERT INTO request VALUES (97,10,'Q prosesos hai');
INSERT INTO request VALUES (98,10,'Q procesos');
INSERT INTO request VALUES (99,10,'Q prosesos');
INSERT INTO request VALUES (100,10,'Dime que procesos');
INSERT INTO request VALUES (101,10,'Dime q proceso');
INSERT INTO request VALUES (102,10,'Dime q proseso');
INSERT INTO request VALUES (103,10,'Que procesos');
INSERT INTO request VALUES (104,10,'Procesos');

INSERT INTO request VALUES (105,11,'Que cursos tienes');
INSERT INTO request VALUES (106,11,'Hablame de los cursos');
INSERT INTO request VALUES (107,11,'Cuentame sobre los ramos');
INSERT INTO request VALUES (108,11,'Que ramos tienes');
INSERT INTO request VALUES (109,11,'Que ramos hay');
INSERT INTO request VALUES (110,11,'Que cursos hay');
INSERT INTO request VALUES (111,11,'Dime que ramos puedo encontrar');
INSERT INTO request VALUES (112,11,'Dime que ramos puedo cursar');
INSERT INTO request VALUES (113,11,'Informame sobre los ramos');
INSERT INTO request VALUES (114,11,'Q cursos hay');
INSERT INTO request VALUES (115,11,'Q cursos hai');
INSERT INTO request VALUES (116,11,'Q cursos ai');
INSERT INTO request VALUES (117,11,'Q ramos hay');
INSERT INTO request VALUES (118,11,'Q ramos hai');
INSERT INTO request VALUES (119,11,'Q ramos ai');

INSERT INTO request VALUES (120,12,'Como llego a la EAO');
INSERT INTO request VALUES (121,12,'como llego a la Eao');
INSERT INTO request VALUES (122,12,'como llego a la eao');
INSERT INTO request VALUES (123,12,'Donde esta la EAO');
INSERT INTO request VALUES (124,12,'donde esta la eao');
INSERT INTO request VALUES (125,12,'donde esta la Eao');
INSERT INTO request VALUES (126,12,'EAO');
INSERT INTO request VALUES (127,12,'Eao');
INSERT INTO request VALUES (128,12,'eao');
INSERT INTO request VALUES (129,12,'Escuela de artes y oficios');
INSERT INTO request VALUES (130,12,'Donde estan los sapitos');
INSERT INTO request VALUES (131,12,'donde esta la EAO');
INSERT INTO request VALUES (132,12,'Donde esta el casino');
INSERT INTO request VALUES (133,12,'Donde encuentro el casino');
INSERT INTO request VALUES (134,12,'Como puedo llegar a la EAO');
INSERT INTO request VALUES (135,12,'Como puedo llegar a los sapos');
INSERT INTO request VALUES (136,12,'Como puedo llegar al casino');

INSERT INTO request VALUES (137,13,'Como llego a la biblioteca');
INSERT INTO request VALUES (138,13,'como llego a la biblioteca');
INSERT INTO request VALUES (139,13,'Como llego a la biblio');
INSERT INTO request VALUES (140,13,'como llego a la biblio');
INSERT INTO request VALUES (141,13,'Donde esta la biblio');
INSERT INTO request VALUES (142,13,'Donde se encuentra la biblioteca');
INSERT INTO request VALUES (143,13,'Donde se encuentra la biblio');
INSERT INTO request VALUES (144,13,'Como encuentro la biblioteca');
INSERT INTO request VALUES (145,13,'como encuentro la biblioteca');
INSERT INTO request VALUES (146,13,'Como encuentro la biblio');
INSERT INTO request VALUES (147,13,'como encuentro la biblio');
INSERT INTO request VALUES (148,13,'Biblioteca');
INSERT INTO request VALUES (149,13,'biblioteca');
INSERT INTO request VALUES (150,13,'viblioteca');
INSERT INTO request VALUES (151,13,'Biblio');
INSERT INTO request VALUES (152,13,'biblio');
INSERT INTO request VALUES (153,13,'vivlio');
INSERT INTO request VALUES (154,13,'viblio');

INSERT INTO request VALUES (155,14,'Hablame del pagare');
INSERT INTO request VALUES (156,14,'hablame del pagare');
INSERT INTO request VALUES (157,14,'Dime sobre el pagare');
INSERT INTO request VALUES (158,14,'dime sobre el pagare');
INSERT INTO request VALUES (159,14,'Hablame sobre el pagare');
INSERT INTO request VALUES (160,14,'hablame sobre el pagare');
INSERT INTO request VALUES (161,14,'Cuentame sobre el pagare');
INSERT INTO request VALUES (162,14,'cuentame sobre el pagare');
INSERT INTO request VALUES (163,14,'Que sabes del pagare');
INSERT INTO request VALUES (164,14,'que sabes del pagare');
INSERT INTO request VALUES (165,14,'Cuentame del pagare');
INSERT INTO request VALUES (166,14,'cuentame del pagare');
INSERT INTO request VALUES (167,14,'Q sabes del pagare');
INSERT INTO request VALUES (168,14,'q sabes del pagare');
INSERT INTO request VALUES (169,14,'Pagare');
INSERT INTO request VALUES (170,14,'pagare');

INSERT INTO request VALUES (171,15,'Cuando se firma el pagare');
INSERT INTO request VALUES (172,15,'cuando se firma el pagare');
INSERT INTO request VALUES (173,15,'Hasta cuando puedo firmar el pagare');
INSERT INTO request VALUES (174,15,'hasta cuando puedo firmar el pagare');
INSERT INTO request VALUES (175,15,'Hasta cuando peudo firmar el pagare');
INSERT INTO request VALUES (176,15,'hasta cuando peudo firmar el pagare');
INSERT INTO request VALUES (177,15,'Asta cuando puedo firmar el pagare');
INSERT INTO request VALUES (178,15,'asta cuando puedo firmar el pagare');
INSERT INTO request VALUES (179,15,'Asta cuando peudo firmar el pagare');
INSERT INTO request VALUES (180,15,'asta cuando peudo firmar el pagare');
INSERT INTO request VALUES (181,15,'Fecha limite del pagare');
INSERT INTO request VALUES (182,15,'fecha limite del pagare');
INSERT INTO request VALUES (183,15,'Liimite del pagare');
INSERT INTO request VALUES (184,15,'liimite del pagare');
INSERT INTO request VALUES (185,15,'Limite del pagaree');
INSERT INTO request VALUES (186,15,'limite del pagaree');
INSERT INTO request VALUES (187,15,'Fecha del pagare');
INSERT INTO request VALUES (188,15,'fecha del pagare');
INSERT INTO request VALUES (189,15,'Firmar el pagare');
INSERT INTO request VALUES (190,15,'firmar el pagare');
INSERT INTO request VALUES (191,15,'Cuando me echan de la u');
INSERT INTO request VALUES (192,15,'cuando me echan de la u');

INSERT INTO request VALUES (193,16,'Que necesito para firmar el pagare');
INSERT INTO request VALUES (194,16,'que necesito para firmar el pagare');
INSERT INTO request VALUES (195,16,'Que requisitos tiene el pagare');
INSERT INTO request VALUES (196,16,'que requisitos tiene el pagare');
INSERT INTO request VALUES (197,16,'Que requisitos posee el pagare');
INSERT INTO request VALUES (198,16,'que requisitos posee el pagare');
INSERT INTO request VALUES (199,16,'Requisitos para el pagare');
INSERT INTO request VALUES (200,16,'requisitos para el pagare');
INSERT INTO request VALUES (201,16,'Req para el pagare');
INSERT INTO request VALUES (202,16,'req para el pagare');
INSERT INTO request VALUES (203,16,'Requisitos pagare');
INSERT INTO request VALUES (204,16,'requisitos pagare');
INSERT INTO request VALUES (205,16,'Req pagare');
INSERT INTO request VALUES (206,16,'req pagare');
INSERT INTO request VALUES (207,16,'Que necesito para el pagare');
INSERT INTO request VALUES (208,16,'que necesito para el pagare');
INSERT INTO request VALUES (209,16,'Que nesesito para el pagare');
INSERT INTO request VALUES (210,16,'que nesesito para el pagare');
INSERT INTO request VALUES (211,16,'Que nesecito para el pagare');
INSERT INTO request VALUES (212,16,'que nesecito para el pagare');
INSERT INTO request VALUES (213,16,'Que nececito para el pagare');
INSERT INTO request VALUES (214,16,'que nececito para el pagare');

INSERT INTO request VALUES (215,17,'En que consiste el proceso del pagare');
INSERT INTO request VALUES (216,17,'en que consiste el proceso del pagare');
INSERT INTO request VALUES (217,17,'En que conciste el proceso del pagare');
INSERT INTO request VALUES (218,17,'en que conciste el proceso del pagare');
INSERT INTO request VALUES (219,17,'En que consiste el proseso del pagare');
INSERT INTO request VALUES (220,17,'en que consiste el proseso del pagare');
INSERT INTO request VALUES (221,17,'En que conciste el proseso del pagare');
INSERT INTO request VALUES (222,17,'en que conciste el proseso del pagare');
INSERT INTO request VALUES (223,17,'En que consiste el pagare');
INSERT INTO request VALUES (224,17,'en que consiste el pagare');
INSERT INTO request VALUES (225,17,'En que conciste el pagare');
INSERT INTO request VALUES (226,17,'en que conciste el pagare');
INSERT INTO request VALUES (227,17,'Consiste pagare');
INSERT INTO request VALUES (228,17,'consiste pagare');
INSERT INTO request VALUES (229,17,'Conciste pagare');
INSERT INTO request VALUES (230,17,'conciste pagare');
INSERT INTO request VALUES (231,17,'Info del proceso del pagare');
INSERT INTO request VALUES (232,17,'info del proceso del pagare');
INSERT INTO request VALUES (233,17,'Info del proseso del pagare');
INSERT INTO request VALUES (234,17,'info del proseso del pagare');
INSERT INTO request VALUES (235,17,'Proceso del pagare');
INSERT INTO request VALUES (236,17,'proceso del pagare');
INSERT INTO request VALUES (237,17,'Proseso del pagare');
INSERT INTO request VALUES (238,17,'proseso del pagare');

INSERT INTO request VALUES (239,18,'Dame informacion sobre Calculo 1');
INSERT INTO request VALUES (240,18,'dame informacion sobre Calculo 1');
INSERT INTO request VALUES (241,18,'Dame informacion sobre calculo 1');
INSERT INTO request VALUES (242,18,'dame informacion sobre calculo 1');
INSERT INTO request VALUES (243,18,'Que sabes sobre calculo 1');
INSERT INTO request VALUES (244,18,'que sabes sobre calculo 1');
INSERT INTO request VALUES (245,18,'Dame informacion de Calculo 1');
INSERT INTO request VALUES (246,18,'dame informacion de Calculo 1');
INSERT INTO request VALUES (247,18,'Dame informacion de calculo 1');
INSERT INTO request VALUES (248,18,'dame informacion de calculo 1');
INSERT INTO request VALUES (249,18,'Puedes darme informacion de Calculo 1');
INSERT INTO request VALUES (250,18,'puedes darme informacion de Calculo 1');
INSERT INTO request VALUES (251,18,'Puedes darme informacion de calculo 1');
INSERT INTO request VALUES (252,18,'puedes darme informacion de calculo 1');
INSERT INTO request VALUES (253,18,'Dame info de Calculo 1');
INSERT INTO request VALUES (254,18,'dame info de Calculo 1');
INSERT INTO request VALUES (255,18,'Dame info de calculo 1');
INSERT INTO request VALUES (256,18,'dame info de calculo 1');
INSERT INTO request VALUES (257,18,'Info de Calculo 1');
INSERT INTO request VALUES (258,18,'info de Calculo 1');
INSERT INTO request VALUES (259,18,'Info de calculo 1');
INSERT INTO request VALUES (260,18,'info de calculo 1');
INSERT INTO request VALUES (261,18,'Calculo 1');
INSERT INTO request VALUES (262,18,'calculo 1');

INSERT INTO request VALUES (263,19,'Cuando es la pep 1 de Calculo 1');
INSERT INTO request VALUES (264,19,'cuando es la pep 1 de Calculo 1');
INSERT INTO request VALUES (265,19,'Cuando es la pep 1 de calculo 1');
INSERT INTO request VALUES (266,19,'cuando es la pep 1 de calculo 1');
INSERT INTO request VALUES (267,19,'Cuando es la pep1 de Calculo 1');
INSERT INTO request VALUES (268,19,'cuando es la pep1 de Calculo 1');
INSERT INTO request VALUES (269,19,'Cuando es la pep1 de calculo 1');
INSERT INTO request VALUES (270,19,'cuando es la pep1 de calculo 1');
INSERT INTO request VALUES (271,19,'Cuando es pep 1 de Calculo 1');
INSERT INTO request VALUES (272,19,'cuando es pep 1 de Calculo 1');
INSERT INTO request VALUES (273,19,'Cuando es pep 1 de calculo 1');
INSERT INTO request VALUES (274,19,'cuando es pep 1 de calculo 1');
INSERT INTO request VALUES (275,19,'Cuando es pep1 de Calculo 1');
INSERT INTO request VALUES (276,19,'cuando es pep1 de Calculo 1');
INSERT INTO request VALUES (277,19,'Cuando es pep1 de calculo 1');
INSERT INTO request VALUES (278,19,'cuando es pep1 de calculo 1');
INSERT INTO request VALUES (279,19,'Que dia es la pep 1 de Calculo 1');
INSERT INTO request VALUES (280,19,'que dia es la pep 1 de Calculo 1');
INSERT INTO request VALUES (281,19,'Que dia es la pep 1 de calculo 1');
INSERT INTO request VALUES (282,19,'que dia es la pep 1 de calculo 1');
INSERT INTO request VALUES (283,19,'Que dia es la pep1 de Calculo 1');
INSERT INTO request VALUES (284,19,'que dia es la pep1 de Calculo 1');
INSERT INTO request VALUES (285,19,'Que dia es la pep1 de calculo 1');
INSERT INTO request VALUES (286,19,'que dia es la pep1 de calculo 1');
INSERT INTO request VALUES (287,19,'Que dia es pep 1 de Calculo 1');
INSERT INTO request VALUES (288,19,'Que dia es pep 1 de calculo 1');
INSERT INTO request VALUES (289,19,'que dia es pep 1 de Calculo 1');
INSERT INTO request VALUES (290,19,'que dia es pep 1 de calculo 1');
INSERT INTO request VALUES (291,19,'Que dia es pep1 de Calculo 1');
INSERT INTO request VALUES (292,19,'Que dia es pep1 de calculo 1');
INSERT INTO request VALUES (293,19,'que dia es pep1 de Calculo 1');
INSERT INTO request VALUES (294,19,'que dia es pep1 de calculo 1');
INSERT INTO request VALUES (295,19,'Fecha de la pep 1 de Calculo 1');
INSERT INTO request VALUES (296,19,'fecha de la pep 1 de Calculo 1');
INSERT INTO request VALUES (297,19,'Fecha de la pep 1 de calculo 1');
INSERT INTO request VALUES (298,19,'fecha de la pep 1 de calculo 1');
INSERT INTO request VALUES (299,19,'Fecha de la pep1 de Calculo 1');
INSERT INTO request VALUES (300,19,'fecha de la pep1 de Calculo 1');
INSERT INTO request VALUES (301,19,'Fecha de la pep1 de calculo 1');
INSERT INTO request VALUES (302,19,'fecha de la pep1 de calculo 1');
INSERT INTO request VALUES (303,19,'Cuando es la fecha de la pep 1 de Calculo 1');
INSERT INTO request VALUES (304,19,'cuando es la fecha de la pep 1 de Calculo 1');
INSERT INTO request VALUES (305,19,'Cuando es la fecha de la pep 1 de calculo 1');
INSERT INTO request VALUES (306,19,'Cuando es la fecha de la pep 1 de calculo 1');
INSERT INTO request VALUES (307,19,'Cuando es la fecha de la pep1 de Calculo 1');
INSERT INTO request VALUES (308,19,'cuando es la fecha de la pep1 de Calculo 1');
INSERT INTO request VALUES (309,19,'Cuando es la fecha de la pep1 de calculo 1');
INSERT INTO request VALUES (310,19,'Cuando es la fecha de la pep1 de calculo 1');
INSERT INTO request VALUES (311,19,'Fecha pep 1 Calculo 1');
INSERT INTO request VALUES (312,19,'fecha pep 1 Calculo 1');
INSERT INTO request VALUES (313,19,'Fecha pep 1 calculo 1');
INSERT INTO request VALUES (314,19,'fecha pep 1 calculo 1');
INSERT INTO request VALUES (315,19,'Fecha pep1 Calculo 1');
INSERT INTO request VALUES (316,19,'fecha pep1 Calculo 1');
INSERT INTO request VALUES (317,19,'Fecha pep1 calculo 1');
INSERT INTO request VALUES (318,19,'fecha pep1 calculo 1');

INSERT INTO request VALUES (319,20,'Cuales son los pasos para derivar');
INSERT INTO request VALUES (320,20,'cuales son los pasos para derivar');
INSERT INTO request VALUES (321,20,'Como se deriva');
INSERT INTO request VALUES (322,20,'como se deriva');
INSERT INTO request VALUES (323,20,'Pasos para derivar');
INSERT INTO request VALUES (324,20,'pasos para derivar');
INSERT INTO request VALUES (325,20,'Como puedo derivar');
INSERT INTO request VALUES (326,20,'como puedo derivar');
INSERT INTO request VALUES (327,20,'Como derivo');
INSERT INTO request VALUES (328,20,'como derivo');
INSERT INTO request VALUES (329,20,'Derivada');
INSERT INTO request VALUES (330,20,'derivada');
INSERT INTO request VALUES (331,20,'Derivar');
INSERT INTO request VALUES (332,20,'derivar');

INSERT INTO request VALUES (333,21,'Cual es el contenido de la pep 1 de Calculo 1');
INSERT INTO request VALUES (334,21,'cual es el contenido de la pep 1 de Calculo 1');
INSERT INTO request VALUES (335,21,'Cual es el contenido de la pep 1 de calculo 1');
INSERT INTO request VALUES (336,21,'cual es el contenido de la pep 1 de calculo 1');
INSERT INTO request VALUES (337,21,'Cual es el contenido de la pep1 de Calculo 1');
INSERT INTO request VALUES (338,21,'cual es el contenido de la pep1 de Calculo 1');
INSERT INTO request VALUES (339,21,'Cual es el contenido de la pep1 de calculo 1');
INSERT INTO request VALUES (340,21,'cual es el contenido de la pep1 de calculo 1');
INSERT INTO request VALUES (341,21,'Cual es el contenido pep 1 de Calculo 1');
INSERT INTO request VALUES (342,21,'cual es el contenido pep 1 de Calculo 1');
INSERT INTO request VALUES (343,21,'Cual es el contenido pep 1 de calculo 1');
INSERT INTO request VALUES (344,21,'cual es el contenido pep 1 de calculo 1');
INSERT INTO request VALUES (345,21,'Cual es el contenido pep1 de Calculo 1');
INSERT INTO request VALUES (346,21,'cual es el contenido pep1 de Calculo 1');
INSERT INTO request VALUES (347,21,'Cual es el contenido pep1 de calculo 1');
INSERT INTO request VALUES (348,21,'cual es el contenido pep1 de calculo 1');
INSERT INTO request VALUES (349,21,'Que entra en la pep 1 de Calculo 1');
INSERT INTO request VALUES (350,21,'que entra en la pep 1 de Calculo 1');
INSERT INTO request VALUES (351,21,'Que entra en la pep 1 de calculo 1');
INSERT INTO request VALUES (352,21,'que entra en la pep 1 de calculo 1');
INSERT INTO request VALUES (353,21,'Que entra en la pep1 de Calculo 1');
INSERT INTO request VALUES (354,21,'que entra en la pep1 de Calculo 1');
INSERT INTO request VALUES (355,21,'Que entra en la pep1 de calculo 1');
INSERT INTO request VALUES (356,21,'que entra en la pep1 de calculo 1');
INSERT INTO request VALUES (357,21,'Que materia entra en la pep 1 de Calculo 1');
INSERT INTO request VALUES (358,21,'que materia entra en la pep 1 de Calculo 1');
INSERT INTO request VALUES (359,21,'Que materia entra en la pep 1 de calculo 1');
INSERT INTO request VALUES (360,21,'que materia entra en la pep 1 de calculo 1');
INSERT INTO request VALUES (361,21,'Que materia entra en la pep1 de Calculo 1');
INSERT INTO request VALUES (362,21,'que materia entra en la pep1 de Calculo 1');
INSERT INTO request VALUES (363,21,'Que materia entra en la pep1 de calculo 1');
INSERT INTO request VALUES (364,21,'que materia entra en la pep1 de calculo 1');
INSERT INTO request VALUES (365,21,'Que materia entra en pep 1 de Calculo 1');
INSERT INTO request VALUES (366,21,'que materia entra en pep 1 de Calculo 1');
INSERT INTO request VALUES (367,21,'Que materia entra en pep 1 de calculo 1');
INSERT INTO request VALUES (368,21,'que materia entra en pep 1 de calculo 1');
INSERT INTO request VALUES (369,21,'Que materia entra en pep1 de Calculo 1');
INSERT INTO request VALUES (370,21,'que materia entra en pep1 de Calculo 1');
INSERT INTO request VALUES (371,21,'Que materia entra en pep1 de calculo 1');
INSERT INTO request VALUES (372,21,'que materia entra en pep1 de calculo 1');
INSERT INTO request VALUES (373,21,'Materia pep 1 de Calculo 1');
INSERT INTO request VALUES (374,21,'materia pep 1 de Calculo 1');
INSERT INTO request VALUES (375,21,'Materia pep 1 de calculo 1');
INSERT INTO request VALUES (376,21,'materia pep 1 de calculo 1');
INSERT INTO request VALUES (377,21,'Materia pep1 de Calculo 1');
INSERT INTO request VALUES (378,21,'materia pep1 de Calculo 1');
INSERT INTO request VALUES (379,21,'Materia pep1 de calculo 1');
INSERT INTO request VALUES (380,21,'materia pep1 de calculo 1');
INSERT INTO request VALUES (381,21,'Materia de pep 1 de Calculo 1');
INSERT INTO request VALUES (382,21,'materia de pep 1 de Calculo 1');
INSERT INTO request VALUES (383,21,'Materia de pep 1 de calculo 1');
INSERT INTO request VALUES (384,21,'materia de pep 1 de calculo 1');
INSERT INTO request VALUES (385,21,'Materia de pep1 de Calculo 1');
INSERT INTO request VALUES (386,21,'materia de pep1 de Calculo 1');
INSERT INTO request VALUES (387,21,'Materia de pep1 de calculo 1');
INSERT INTO request VALUES (388,21,'materia de pep1 de calculo 1');
INSERT INTO request VALUES (389,21,'Contenido pep 1 de Calculo 1');
INSERT INTO request VALUES (390,21,'contenido pep 1 de Calculo 1');
INSERT INTO request VALUES (391,21,'Contenido pep 1 de calculo 1');
INSERT INTO request VALUES (392,21,'contenido pep 1 de calculo 1');
INSERT INTO request VALUES (393,21,'Contenido pep1 de Calculo 1');
INSERT INTO request VALUES (394,21,'contenido pep1 de Calculo 1');
INSERT INTO request VALUES (395,21,'Contenido pep1 de calculo 1');
INSERT INTO request VALUES (396,21,'contenido pep1 de calculo 1');
INSERT INTO request VALUES (397,21,'Contenido de pep 1 de Calculo 1');
INSERT INTO request VALUES (398,21,'contenido de pep 1 de Calculo 1');
INSERT INTO request VALUES (399,21,'Contenido de pep 1 de calculo 1');
INSERT INTO request VALUES (400,21,'contenido de pep 1 de calculo 1');
INSERT INTO request VALUES (401,21,'Contenido de pep1 de Calculo 1');
INSERT INTO request VALUES (402,21,'contenido de pep1 de Calculo 1');
INSERT INTO request VALUES (403,21,'Contenido de pep1 de calculo 1');
INSERT INTO request VALUES (404,21,'contenido de pep1 de calculo 1');
INSERT INTO request VALUES (405,43,'pesimo');
INSERT INTO request VALUES (406,43,'malo');
INSERT INTO request VALUES (407,43,'muy mal');
INSERT INTO request VALUES (408,43,'no me gusto');
INSERT INTO request VALUES (409,43,'respondiste muy mal');
INSERT INTO request VALUES (410,43,'horrible');
INSERT INTO request VALUES (411,44,'regular');
INSERT INTO request VALUES (412,44,'mas o menos');
INSERT INTO request VALUES (413,44,'no tan bueno');
INSERT INTO request VALUES (414,44,'respondiste regular');
INSERT INTO request VALUES (415,45,'bien');
INSERT INTO request VALUES (416,45,'buenisimo');
INSERT INTO request VALUES (417,45,'correcto');
INSERT INTO request VALUES (418,45,'muy bien');


INSERT INTO chatbot VALUES (1,1,'2002-02-16 20:38:40',60,'1.0.1b');
INSERT INTO chatbot VALUES (2,2,'2002-02-16 20:40:40',50,'1.0.1c');

INSERT INTO client VALUES (1,1,'alumno','uno','URL Avatar','$2b$12$iIG6fGPtRpo7WKrA7MaMgObE9ytNbTliZgNS5ShP3JyozDQ.bE2ZG','email@email.com');
INSERT INTO client VALUES (2,2,'mentor','uno','URL Avatar','$2b$12$InWkTikILioGKltoDB5eEuqEuOoa9IiNmeRng872PomyXPLNQgwDK','email@email.com');
INSERT INTO client VALUES (3,3,'cientista','uno','URL Avatar','$2b$12$jbJchNrJ16u7Ih/I8.Hb.ORDAJJ2LBOcuBu4lVC.FmEX2w29BW2mC','email@email.com');

INSERT INTO permission_duty VALUES (1,1,1);
INSERT INTO permission_duty VALUES (2,2,2);
INSERT INTO permission_duty VALUES (3,3,3);

INSERT INTO dialogue VALUES (1,1,1,'2002-02-16 20:38:40','2002-02-16 20:50:40',3);
INSERT INTO chatMessage VALUES (1,1,1,'¿Como puedo llegar a la libreria?',70,'2002-02-16 20:50:40');
INSERT INTO client_topic VALUES (1,1,1);

INSERT INTO userQuestion VALUES (1,1,1,0,'¿como puedo integrar?','');
INSERT INTO userQuestion VALUES (2,1,1,0,'dime como puedo integrar','');
INSERT INTO userQuestion VALUES (3,1,1,0,'¿como podia llegar al biblio?','');

INSERT INTO slot VALUES (1,'userID','unfeaturized',1);
INSERT INTO slot VALUES (2,'conversationID','unfeaturized',1);
INSERT INTO slot VALUES (3,'chatbotID','unfeaturized',1);

INSERT INTO button VALUES (1,'ask_place','Consulta de lugares',1);
INSERT INTO button VALUES (2,'ask_process','Consulta de procesos',1);
INSERT INTO button VALUES (3,'ask_courses','Consulta de cursos',1);
INSERT INTO button VALUES (4,'ask_place_EAO','EAO',2);
INSERT INTO button VALUES (5,'ask_place_library','Biblioteca',2);
INSERT INTO button VALUES (6,'ask_process_pagare','Pagare',5);
INSERT INTO button VALUES (7,'ask_process_date_pagare','Fecha',6);
INSERT INTO button VALUES (8,'ask_process_req_pagare','Pagare',6);
INSERT INTO button VALUES (9,'ask_process_info_pagare','Informacion',6);
INSERT INTO button VALUES (10,'ask_courses_calculo1','Calculo 1',10);
INSERT INTO button VALUES (11,'ask_date_pep1_calculo1','Fecha de PEP1',11);
INSERT INTO button VALUES (12,'ask_content_pep1_calculo1','Contenido PEP1',11);
INSERT INTO button VALUES (13,'ask_about_calculo1_derivative','Como derivar',11);
INSERT INTO button VALUES (14,'affirm','Si',20);
INSERT INTO button VALUES (15,'deny','No',20);
INSERT INTO button VALUES (16,'bad_evaluate','⭐',21);
INSERT INTO button VALUES (17,'regular_evaluate','⭐⭐',21);
INSERT INTO button VALUES (18,'good_evaluate','⭐⭐⭐',21);



INSERT INTO routine VALUES (1,'Initiate login','rule');
INSERT INTO routine VALUES (2,'Save conversation','rule');
INSERT INTO routine VALUES (3,'Indicate where the EAO is located anytime the user ask','rule');
INSERT INTO routine VALUES (4,'Indicate where the Library is located anytime the user ask','rule');
INSERT INTO routine VALUES (5,'Ask the student how they can help about process pagare','rule');
INSERT INTO routine VALUES (6,'Indicates when you have to pay the Pagare anytime the user ask','rule');
INSERT INTO routine VALUES (7,'Indicate what requirements you need to pay the Pagare anytime the user ask','rule');
INSERT INTO routine VALUES (8,'Indicates general information about the Pagare anytime the user ask','rule');
INSERT INTO routine VALUES (9,'Ask the student how they can help about course Calculo 1','rule');
INSERT INTO routine VALUES (10,'Indicates the date of the test PEP1 of Calculo1 anytime the user ask','rule');
INSERT INTO routine VALUES (11,'Indicates the content of the test PEP1 of Calculo1 anytime the user ask','rule');
INSERT INTO routine VALUES (12,'Indicates information about Derivadas of Calculo1 anytime the user ask','rule');
INSERT INTO routine VALUES (13,'Gabi react to bad calification','rule');
INSERT INTO routine VALUES (14,'Gabi react to moderate calification','rule');
INSERT INTO routine VALUES (15,'Gabi react to good calification','rule');
INSERT INTO routine VALUES (16,'Say I am a bot anytime the user challenges','rule');

INSERT INTO routine VALUES (17,'ask the student how they can help about location','story');
INSERT INTO routine VALUES (18,'ask the student how they can help about process','story');
INSERT INTO routine VALUES (19,'ask the student how they can help about course','story');
INSERT INTO routine VALUES (20,'asks the student if they want to end the conversation (affirm)','story');
INSERT INTO routine VALUES (21,'asks the student if they want to end the conversation (deny)','story');

INSERT INTO routine VALUES (22,'Respond question without intention','rule');




INSERT INTO routine_intention VALUES (1,1,1,1,'intent');
INSERT INTO routine_intention VALUES (2,1,49,2,'action');
INSERT INTO routine_intention VALUES (3,1,22,3,'action');

INSERT INTO routine_intention VALUES (4,2,51,1,'intent');
INSERT INTO routine_intention VALUES (5,2,50,2,'action');

INSERT INTO routine_intention VALUES (6,3,12,1,'intent');
INSERT INTO routine_intention VALUES (7,3,24,2,'action');
INSERT INTO routine_intention VALUES (8,3,41,3,'action');

INSERT INTO routine_intention VALUES (9,4,13,1,'intent');
INSERT INTO routine_intention VALUES (10,4,25,2,'action');
INSERT INTO routine_intention VALUES (11,4,41,3,'action');

INSERT INTO routine_intention VALUES (12,5,14,1,'intent');
INSERT INTO routine_intention VALUES (13,5,27,2,'action');

INSERT INTO routine_intention VALUES (14,6,15,1,'intent');
INSERT INTO routine_intention VALUES (15,6,28,2,'action');
INSERT INTO routine_intention VALUES (16,6,41,3,'action');

INSERT INTO routine_intention VALUES (17,7,16,1,'intent');
INSERT INTO routine_intention VALUES (18,7,29,2,'action');
INSERT INTO routine_intention VALUES (19,7,41,3,'action');

INSERT INTO routine_intention VALUES (20,8,17,1,'intent');
INSERT INTO routine_intention VALUES (21,8,30,2,'action');
INSERT INTO routine_intention VALUES (22,8,41,3,'action');

INSERT INTO routine_intention VALUES (23,9,18,1,'intent');
INSERT INTO routine_intention VALUES (24,9,32,2,'action');

INSERT INTO routine_intention VALUES (25,10,19,1,'intent');
INSERT INTO routine_intention VALUES (26,10,33,2,'action');
INSERT INTO routine_intention VALUES (27,10,41,3,'action');

INSERT INTO routine_intention VALUES (28,11,21,1,'intent');
INSERT INTO routine_intention VALUES (29,11,34,2,'action');
INSERT INTO routine_intention VALUES (30,11,41,3,'action');

INSERT INTO routine_intention VALUES (31,12,20,1,'intent');
INSERT INTO routine_intention VALUES (32,12,35,2,'action');
INSERT INTO routine_intention VALUES (33,12,41,3,'action');

INSERT INTO routine_intention VALUES (34,13,43,1,'intent');
INSERT INTO routine_intention VALUES (35,13,46,2,'action');
INSERT INTO routine_intention VALUES (36,13,50,3,'action');

INSERT INTO routine_intention VALUES (37,14,44,1,'intent');
INSERT INTO routine_intention VALUES (38,14,47,2,'action');
INSERT INTO routine_intention VALUES (39,14,50,3,'action');

INSERT INTO routine_intention VALUES (40,15,45,1,'intent');
INSERT INTO routine_intention VALUES (41,15,48,2,'action');
INSERT INTO routine_intention VALUES (42,15,50,3,'action');

INSERT INTO routine_intention VALUES (43,16,8,1,'action');
INSERT INTO routine_intention VALUES (44,16,40,2,'action');


INSERT INTO routine_intention VALUES (45,17,2,1,'intent');
INSERT INTO routine_intention VALUES (46,17,22,2,'action');
INSERT INTO routine_intention VALUES (47,17,9,3,'intent');
INSERT INTO routine_intention VALUES (48,17,23,4,'action');

INSERT INTO routine_intention VALUES (49,18,2,1,'intent');
INSERT INTO routine_intention VALUES (50,18,22,2,'action');
INSERT INTO routine_intention VALUES (51,18,10,3,'intent');
INSERT INTO routine_intention VALUES (52,18,26,4,'action');

INSERT INTO routine_intention VALUES (53,19,2,1,'intent');
INSERT INTO routine_intention VALUES (54,19,22,2,'action');
INSERT INTO routine_intention VALUES (55,19,11,3,'intent');
INSERT INTO routine_intention VALUES (56,19,31,4,'action');

INSERT INTO routine_intention VALUES (57,20,41,1,'action');
INSERT INTO routine_intention VALUES (58,20,4,2,'intent');
INSERT INTO routine_intention VALUES (59,20,22,3,'action');

INSERT INTO routine_intention VALUES (60,21,41,1,'action');
INSERT INTO routine_intention VALUES (61,21,5,2,'intent');
INSERT INTO routine_intention VALUES (62,21,42,3,'action');

INSERT INTO routine_intention VALUES (63,22,52,1,'intent');
INSERT INTO routine_intention VALUES (64,22,53,2,'action');
INSERT INTO routine_intention VALUES (65,22,54,3,'action');
INSERT INTO routine_intention VALUES (66,22,41,4,'action');

SELECT setval(pg_get_serial_sequence('topic', 'topic_id'), (SELECT MAX(topic_id) FROM topic)+1);
SELECT setval(pg_get_serial_sequence('duty', 'duty_id'), (SELECT MAX(duty_id) FROM duty)+1);
SELECT setval(pg_get_serial_sequence('permission', 'permission_id'), (SELECT MAX(permission_id) FROM permission)+1);
SELECT setval(pg_get_serial_sequence('intention', 'intention_id'), (SELECT MAX(intention_id) FROM intention)+1);
SELECT setval(pg_get_serial_sequence('routine', 'routine_id'), (SELECT MAX(routine_id) FROM routine)+1);
SELECT setval(pg_get_serial_sequence('routine_intention', 'routine_intention_id'), (SELECT MAX(routine_intention_id) FROM routine_intention)+1);
SELECT setval(pg_get_serial_sequence('answer', 'answer_id'), (SELECT MAX(answer_id) FROM answer)+1);
SELECT setval(pg_get_serial_sequence('button', 'button_id'), (SELECT MAX(button_id) FROM button)+1);
SELECT setval(pg_get_serial_sequence('chatbot', 'chatbot_id'), (SELECT MAX(chatbot_id) FROM chatbot)+1);
SELECT setval(pg_get_serial_sequence('slot', 'slot_id'), (SELECT MAX(slot_id) FROM slot)+1);
SELECT setval(pg_get_serial_sequence('client', 'client_id'), (SELECT MAX(client_id) FROM client)+1);
SELECT setval(pg_get_serial_sequence('permission_duty', 'permission_duty_id'), (SELECT MAX(permission_duty_id) FROM permission_duty)+1);
SELECT setval(pg_get_serial_sequence('dialogue', 'dialogue_id'), (SELECT MAX(dialogue_id) FROM dialogue)+1);
SELECT setval(pg_get_serial_sequence('chatmessage', 'chatmessage_id'), (SELECT MAX(chatmessage_id) FROM chatmessage)+1);
SELECT setval(pg_get_serial_sequence('request', 'request_id'), (SELECT MAX(request_id) FROM request)+1);
SELECT setval(pg_get_serial_sequence('client_topic', 'client_topic_id'), (SELECT MAX(client_topic_id) FROM client_topic)+1);
SELECT setval(pg_get_serial_sequence('userquestion', 'userquestion_id'), (SELECT MAX(userquestion_id) FROM userquestion)+1);
