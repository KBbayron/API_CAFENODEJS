CREATE DATABASE cafenodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use cafenodejs;

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(250),
    contactNumber VARCHAR(20),
    email VARCHAR(50),
    `password` varchar(250),
    `status` varchar(20),
    `role` varchar(20),
    unique (email)
) ENGINE = InnoDB;

INSERT INTO user 
    (`name`, contactNumber, email, `password`, `status`, `role`)
VALUES 
    ('Juan Pérez', '555-1234', 'juan.perez@email.com', 'password123', 'active', 'admin'),
    ('Ana Gómez', '555-5678', 'ana.gomez@email.com', 'password456', 'active', 'user'),
    ('Carlos López', '555-8765', 'carlos.lopez@email.com', 'password789', 'active', 'user'),
    ('María Sánchez', '555-4321', 'maria.sanchez@email.com', 'password123', 'active', 'user'),
    ('Luis Rodríguez', '555-1111', 'luis.rodriguez@email.com', 'password456', 'active', 'user'),
    ('Sofía Martínez', '555-2222', 'sofia.martinez@email.com', 'password789', 'active', 'admin'),
    ('Pedro Díaz', '555-3333', 'pedro.diaz@email.com', 'password123', 'active', 'user'),
    ('Laura Fernández', '555-4444', 'laura.fernandez@email.com', 'password456', 'active', 'user'),
    ('José García', '555-5555', 'jose.garcia@email.com', 'password789', 'active', 'admin'),
    ('Elena Pérez', '555-6666', 'elena.perez@email.com', 'password123', 'active', 'user');