CREATE TABLE user (
    user_id int NOT NULL IDENTITY(1, 1),
    duty_id int NOT NULL,
    first_name NOT NULL varchar(200),
    last_name NOT NULL varchar(200),
    avatar_url NOT NULL varchar(100),
    auth_key NOT NULL varchar(32),
    email NOT NULL varchar(100),
    PRIMARY KEY(user_id),
    CONSTRAINT fk_duty 
    FOREIGN KEY(duty_id) 
    REFERENCES duty(duty_id)
);

CREATE TABLE duty (
    duty_id int NOT NULL IDENTITY(1, 1),
    duty_name NOT NULL varchar(200),
    PRIMARY KEY(duty_id)
);

CREATE TABLE permission (
    permission_id int NOT NULL IDENTITY(1, 1),
    permission_name NOT NULL varchar(200),
    PRIMARY KEY(permission_id)
);

CREATE TABLE permission_duty (
    permission_duty int NOT NULL IDENTITY(1, 1),
    duty_id int NOT NULL,
    permission_id int NOT NULL,
    PRIMARY KEY(permission_duty),
    FOREIGN KEY(duty_id),
    FOREIGN KEY(permission_id),
    REFERENCES duty(duty_id)       
    REFERENCES permission(permission_id)    
);

CREATE TABLE query (
    query_id int NOT NULL IDENTITY(1, 1),
    user_id int
    content varchar(256)
    PRIMARY KEY(query_id)
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES user(user_id)
)

CREATE TABLE message (
    message_id int NOT NULL IDENTITY(1, 1),
    conversation_id int 
    intention_id int
    content varchar(256)
    confidence int
    date_issue date
    PRIMARY KEY(message_id)
    CONSTRAINT fk_conversation
        FOREIGN KEY(conversation_id)
        REFERENCES conversation(conversation_id),
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id)
        REFERENCES conversation(intention_id)
)

CREATE TABLE intention (
    intention_id int NOT NULL IDENTITY(1, 1),
    name varchar(32)
    PRIMARY KEY(intention_id)
)

CREATE TABLE question (
    question_id int NOT NULL IDENTITY(1, 1),
    intention_id int 
    content varchar(256)
    PRIMARY KEY(question_id)
    CONSTRAINT fk_intention
        FOREIGN KEY(intention_id)
        REFERENCES intention(intention_id)
)

CREATE TABLE answer (
    answer_id int NOT NULL IDENTITY(1, 1),
    content varchar(256)
    image_url varchar(64)
    video_url varchar(64)
    PRIMARY KEY(answer_id)
)
