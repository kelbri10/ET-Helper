USE employee_tracker; 

DROP TABLE IF EXISTS employee; 
CREATE TABLE employee(
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL, 
    role_id INTEGER, 
    manager_id INTEGER
); 

DROP TABLE IF EXISTS role; 
CREATE TABLE role(
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    title VARCHAR(30), 
    salary DECIMAL(10, 2), 
	department_id INTEGER
); 

DROP TABLE IF EXISTS department; 
CREATE TABLE department(
	id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, 
    name VARCHAR(30) NOT NULL
); 
