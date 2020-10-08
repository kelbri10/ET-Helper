USE employee_tracker; 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Johnny', 'Depp', 1, 1), ('Millie Bobby', 'Brown', 2, 2), ('Sherlock', 'Holmes', 6, 6), ('Harry','Potter', 7,7); 

INSERT INTO role (title, salary, department_id)
VALUES ('Retail Associate', 25000, 1), ('Representative', 28000, 1), ('Executive Assistant', 38000, 2), ('Administrative Intern', 15000, 2), ('UX Designer', 40000, 3), ('Lawyer', 60000, 4), ('Analyst', 40000, 5), ('Technician', 40000, 5); 

INSERT INTO department (name)
VALUES ('Customer Service'), ('Adminstrative'), ('Design'), ('Legal'), ('Operations & IT'); 