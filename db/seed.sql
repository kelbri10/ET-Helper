USE employee_tracker; 

INSERT INTO employee(first_name, last_name, role_id)
VALUES('Severus', 'Snape', 1), ('Minerva', 'McGonagall', 1), ('Sherlock', 'Holmes', 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Draco', 'Malfoy', 3 ,1), ('Vincent', 'Crabbe', 3 ,1), ('John', 'Watson', 4 , 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Head of House', 25000, 1), ('Head Detective', 28000, 2), ('Potions Aide', 20000, 1), ('Detective Assistant', 25000, 2);

INSERT INTO department (name)
VALUES ('Hogwarts'), ('Detective Agency'); 