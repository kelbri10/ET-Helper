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
      
        console.log(departments); 
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

            console.log(answers);
            
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
            message: 'Select the employee\'s role:',
            choices: [
               
            ]
        }, 
        {
            type: 'list', 
            name: 'manager', 
            message: 'Select the manager\'s ID:', 
            choices: [
              
            ]
        }
    ];

    inquirer.prompt(questions).then(answers => { 

        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                    VALUES (${answers.firstName}, ${answers.lastName}, ${answers.role}, ${answers.manager});`

        connection.query(query, (err, result, fields) =>{
            if (err) throw err; 
            //once query is completed, user receives confirmation that new employee
            log(chalk.bgBlue(`${answers.firstName} ${answers.lastName} has been added!`)); 
        });
    });
}

const updateEmployeeRole = () => {
    let employees = []; 
    let roles = []; 

    let employeeQuery = `SELECT CONCAT(first_name, ' ' , last_name) 
                        AS employeeName, role_id FROM employee`; 
    
    let roleQuery = `SELECT role.id, role.title FROM role`; 

    connection.query(employeeQuery, (err, result) => { 

        for(let e of result){ 
            employees.push(e.employeeName); 
        }
        

        connection.query(roleQuery, (err, result) => {

            for(let r of result){ 
                roles.push({id: r.id, title: r.title}); 
            };
        

            let questions = [
                {
                    type: 'list', 
                    name: 'employee', 
                    message: 'Select which employee you would like to update:', 
                    choices: employees
                }, 
                {
                    type: 'list', 
                    name: 'newRole', 
                    message: 'Select their new role: ', 
                    choices: () => {
                        let roleNames = [];
                        for (let r of result){  
                            roleNames.push(r.title); 
                        }
                        return roleNames; 
                    }
                }
            ]

            inquirer.prompt(questions).then(answers =>{
                
                roles.forEach(role => { 
                    if (answers.newRole === role.title){ 
                        return answers.newID = role.id; 

                    }
                }); 

                employees.forEach(employee{ 
                    if (answers.employee === employee.employeeName){ 
                        return answers.employeeID = employee.
                    }
                })

                console.log(answers); 
                
                let newRoleQuery = `UPDATE employee
                                    SET employee.role_id = ${answers.newID}
                                    WHERE CONCAT(employee.first_name,' ', employee.last_name) = ${answers.employee}`; 

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

    let query = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, role.department_id
        FROM employee 
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department. id`; 

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
