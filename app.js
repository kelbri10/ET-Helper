const mysql = require('mysql'); 
const inquirer = require('inquirer'); 
const chalk = require('chalk'); 
const consoleTable = require('console.table'); 
const log = console.log; 

//creates connection 
const connection = mysql.createConnection({
    host: 'localhost', 

    port: 3306, 

    user: 'root', 

    password: '', 

    database: 'employee_tracker',

    insecureAuth: true
}); 

connection.connect(err => { 
    if (err) throw err; 

    log(chalk.bgBlueBright('Welcome to ET Helper!') + '\nWhere we meet all your tracking needs!'); 
    trackerStart(); 
})

//prompts user to choose what function of the app they would like to use
const trackerStart = () => { 
    let question = [
        {
            type: 'list', 
            name: 'action', 
            message: 'What would you like to do?',
            choices: [
                'Add Department', 
                'Add Role', 
                'Add Employee', 
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Update Employee Role', 
                'Exit'
            ]
        }
    ];

    inquirer.prompt(question).then(answer => {
    //according to user's response
        switch(answer.action){ 
            case 'Add Department': 
                addDepartment(); 
                break; 
            case 'Add Role': 
                addRole(); 
                break; 
            case 'Add Employee': 
                addEmployee(); 
                break; 
            case 'View All Departments': 
                viewDepartments(); 
                break; 
            case 'View All Roles': 
                viewRoles(); 
                break;  
            case 'View All Employees': 
                viewEmployees(); 
                break; 
            case 'Update Employee Role': 
                updateEmployeeRole(); 
                break; 
            case 'Exit': 
                log('Thank you for using the app.\n')
                connection.end(); 
                break; 
        }
    })
}

//prompts user to input new department name, makes query to db and adds it to the db with auto_increment id
const addDepartment = () => {
    let question = [
        {
            type: 'input', 
            name: 'name', 
            message: 'What department would you like to add?'
        }
    ];

    inquirer.prompt(question).then(answer => {

        let query = `INSERT INTO department(name) 
                    VALUES ('${answer.name}')`; 

        connection.query(query, (err, result) =>{

            if(err) throw err; 

            log(chalk.bgBlueBright('Department has been added!')); 

            log(`The new department\'s id is: ${result.insertId}`); 

            trackerStart(); 
        });

    }); 

  
} 

//prompts user to input new role, salary, and department that the role belongs too 
const addRole = () => {
    let departments = []; 
    let departmentQuery = `SELECT * FROM department`; 

    connection.query(departmentQuery, (err, result) =>{ 

        for (let i of result){ 
            departments.push(i);
        }
      
        let questions = [
            {
                type: 'input', 
                name: 'role', 
                message: 'What is the name of the Role you would like to add?'
            }, 
            {
                type: 'input', 
                name: 'salary', 
                message: 'What is the salary?'
            }, 
            {
                type: 'list',
                name: 'department', 
                message: 'Select the Department:',
                choices: departments
            }
        ];
    
        inquirer.prompt(questions).then(answers => {

            departments.forEach(department => {
                if (answers.department === department.name){
                    return answers.id = department.id; 
                }
            }); 
            
            let query = `INSERT INTO role (title, salary, department_id) 
            VALUES ('${answers.role}', '${answers.salary}', '${answers.id}')`

            connection.query(query, (err, result) => {
            //once user query is completed, user receives message that new role has been added to the db
            log(chalk.bgBlueBright('Role has been added!')); 

            trackerStart(); 
            }); 
        });
    }); 

}

//prompts user to answer questions regarding new employee information 
const addEmployee = () => {
    let roleNames = []; 
    let roles = []; 
    let managerNames = []; 
    let managers = []; 

    let roleQuery = `SELECT role.id, role.title, role.department_id FROM role`; 
    let managerQuery = `SELECT CONCAT(first_name, ' ', last_name) 
                        AS managerName, role_id FROM employee 
                        WHERE manager_id IS NULL`; 
    
  
    connection.query(roleQuery, (err, result) =>{
        for (let r of result){ 
            roleNames.push(r.title); 
            roles.push(r); 
        }

        connection.query(managerQuery, (err, result) => { 

            for (let m of result){ 
                managerNames.push(m.managerName); 
                managers.push({name: m.managerName, id: m.role_id}); 
            }

            let questions = [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the employee\'s first name?' 
                }, 
                {
                    type: 'input', 
                    name: 'lastName', 
                    message: 'What is the employee \'s last name?'
                }, 
                {
                    type: 'list', 
                    name: 'role', 
                    message: 'Select their role: ', 
                    choices: roleNames
                }, 
                {
                    type: 'confirm', 
                    name: 'isManager', 
                    message: 'Is this employee a manager?', 
                }
            ]

            inquirer.prompt(questions).then(answers => { 

                roles.forEach(role =>{ 
                   if (answers.role === role.title){
                       return answers.roleID = role.id; 
                   }; 
                }); 

                let newEmployee = answers; 

                if(newEmployee.isManager){ 
                    let addQuery = `INSERT INTO employee (first_name, last_name, role_id)
                    VALUES('${newEmployee.firstName}', '${newEmployee.lastName}', '${newEmployee.roleID}')`; 

                    connection.query(addQuery, (err, result)=>{
                        log(chalk.bgBlueBright(`${newEmployee.firstName} ${newEmployee.lastName} has been added!`)); 
                        trackerStart(); 
                    });

                }else{
                    
                   inquirer.prompt({
                    type:'list', 
                    name: 'manager', 
                    message: 'Select their manager:',
                    choices: managerNames
                    }).then(answer =>{ 
                    
                        managers.forEach(manager=>{ 
                            if (answer.manager === manager.name){ 
                                return newEmployee.managerID = manager.id; 
                            }
                        }); 

                        let addQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES('${newEmployee.firstName}', '${newEmployee.lastName}', '${newEmployee.roleID}', '${newEmployee.managerID}')`;
                        
                        connection.query(addQuery, (err, result)=>{
                            log(chalk.bgBlueBright(`${newEmployee.firstName} ${newEmployee.lastName} has been added!`));
                            trackerStart(); 
                        }); 

                    }); 
                }

                
               
            });
        });
    
    }); 

} 

const updateEmployeeRole = () => {
    let employees = []; 
    let employeesNames = []; 
    let roleNames = []; 
    let roles = []; 

    let employeeQuery = `SELECT CONCAT(first_name, ' ' , last_name) 
                        AS employeeName, role_id, employee.id FROM employee`; 
    
    let roleQuery = `SELECT role.id, role.title FROM role`; 

    connection.query(employeeQuery, (err, result) => { 

        for(let e of result){  
            employeesNames.push(e.employeeName); 
            employees.push(e)
        }

        connection.query(roleQuery, (err, result) => {

            for(let r of result){ 
                roleNames.push(r.title);
                roles.push(r);  
            };
        

            let questions = [
                {
                    type: 'list', 
                    name: 'employee', 
                    message: 'Select which employee you would like to update:', 
                    choices: employeesNames
                }, 
                {
                    type: 'list', 
                    name: 'newRole', 
                    message: 'Select their new role: ', 
                    choices: roleNames
                }
            ]

            inquirer.prompt(questions).then(answers =>{
                
                roles.forEach(role => { 
                    if (answers.newRole === role.title){ 
                        return answers.newID = role.id; 
                    }
                }); 

                employees.forEach(employee => { 
                    if (answers.employee === employee.employeeName){ 
                        return answers.empID = employee.id; 
                    }
                })
                
                let newRoleQuery = `UPDATE employee
                                    SET employee.role_id = ${answers.newID}
                                    WHERE employee.id = ${answers.empID}`; 

                connection.query(newRoleQuery, (err, result) => {
                    if (err) throw err; 

                    log(chalk.bgBlueBright(`${answers.employee} has been updated!`)); 
                    trackerStart();                     
                }); 
            }); 
        }); 
        
    });

}


const viewEmployees = () => { 

    let query = `SELECT CONCAT(first_name, ' ', last_name) AS Name, role.title as Position, role.salary as Salary, 
                role.department_id, department.name AS Department
                FROM employee 
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id`; 

    connection.query(query, (err, result, fields) =>{
        if(err) throw err; 
        console.table(result); 

        trackerStart(); 
    })
}

const viewRoles = () => {
    let query = `SELECT * FROM role`; 

    connection.query(query, (err, result) => {
        if (err) throw err; 
        console.table(result); 

        trackerStart(); 
    })
}

const viewDepartments = () => { 

    let query = `SELECT * FROM department`; 

    connection.query(query, (err, result, fields) => {
        if(err) throw err; 
        console.table(result); 

        trackerStart(); 
    }); 
}
