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

