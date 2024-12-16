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

CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(250) NOT NULL
) ENGINE = InnoDB;

create TABLE product(
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255),
    categoryId INT NOT NULL,
    `description` varchar(255),
    price integer,
    `status` varchar(20),
    FOREIGN KEY (categoryId) REFERENCES category(id)
)ENGINE = InnoDB;

create TABLE bill(
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid varchar(255) NOT NULL,
    `name` varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(255) NOT,
    paymentMethod varchar(255) NOT NULL,
    `total` INT NOT NULL,
    productDetails JSON NOT NULL,
    createdBy varchar(255) NOT NULL
)ENGINE = InnoDB;

INSERT INTO category (`name`) 
VALUES 
    ('Categoría 1'),
    ('Categoría 2'),
    ('Categoría 3'),
    ('Categoría 4'),
    ('Categoría 5');

INSERT INTO product 
    (`name`, categoryId, `description`, price, `status`) 
VALUES 
    ('Producto 1', 1, 'Descripción del producto 1', 100, 'activo'),
    ('Producto 2', 2, 'Descripción del producto 2', 150, 'activo'),
    ('Producto 3', 1, 'Descripción del producto 3', 200, 'inactivo');


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
    ('Elena Pérez', '555-6666', 'elena.perez@email.com', 'passwordABC', 'active', 'user');