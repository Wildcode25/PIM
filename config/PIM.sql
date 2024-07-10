-- DOUBT: I have doubts about if this was done with chatgpt, table should be named user instead of customer
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
alter table product add column categories varchar(10);
-- TODO: categories should be a separate table

INSERT INTO customer(name, email, password)
VALUES('Emmanuel', 'enmanuelcastillo1999@gmail.com', 'mordex123');