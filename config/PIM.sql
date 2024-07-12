DROP DATABASE PIM IF EXISTS;
CREATE DATABASE PIM;
USE DATABASE PIM;
CREATE TABLE customer (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	email VARCHAR(50),
	password VARCHAR(50)
);
CREATE TABLE product (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    description TEXT, 
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	customer_id int,
	FOREIGN KEY (customer_id) REFERENCES customer(id)
);
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name varchar(50),
);
CREATE TABLE product_category (
    product_id PRIMARY KEY,
    category_id PRIMARY KEY,
    FOREIGN KEY(product_id) REFERENCES product(id);
    FOREIGN KEY (category_id) REFERENCES category(id);
);
INSERT INTO category(name) VALUES
("kitchen"),
("appliances"),
("cleaning"),
("laundry"),
("cooling"),
("home");
INSERT INTO customer(name, email, password)
VALUES('Emmanuel', 'enmanuelcastillo1999@gmail.com', 'mordex123');