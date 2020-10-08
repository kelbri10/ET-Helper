USE employee_tracker; 

INSERT INTO department (id, name)
VALUES (1, 'Case Management'), (2, 'IT Support'); 

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Kelsey', 'Hughes', 1, 1), (2, 'Sarah', 'Lawrence', 1, 1), (3,'Lake', 'Darwin', 2, 2); 

INSERT INTO role (id, title, salary, department_id)
VALUES (1,'Case Manager', 30000, 1), (2, 'Rehab Counselor', 25000, 1), (3, 'Help Desk', 55000, 2); 