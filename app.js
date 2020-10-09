const mysql = require('mysql'); 
const inquirer = require('inquirer'); 
const chalk = require('chalk'); 
const consoleTable = require('console.table'); 
const log = console.log; 

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
                'Update Role', 
                'Exit'
            ]
        }
    ]

    inquirer.prompt(question).then(answer => {
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
            case 'Update Role': 
                updateRole(); 
                break; 
            case 'Exit': 
                log('Thank you for using the app.\n')
                connection.end(); 
                break; 
        }
    })
}

const addDepartment = () => {
    let question = [
        {
            type: 'input', 
            name: 'name', 
            message: 'What department would you like to add?'
        }
    ]

    inquirer.prompt(question).then(answer => {


        let query = `INSERT INTO department(name) 
                    VALUES (' + ${answer.name} + ')`; 

        connection.query(query, (err, result) =>{

            if(err) throw err; 

            log(chalk.bgBlueBright('Department has been added!')); 

            log(`The new department\'s id is: ${result.insertId}`); 
        });

    }); 

  
} 

const addRole = () => {
    //ask what role the user wants added, the salary, and the department name
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
            type: 'input',
            name: 'department', 
            message: 'Select the Department:',
            //needs for/of statement that iterates over the choices in the department table object after it has been converted to an array 
            //push each of the chocies to an array
            choices: [
                'test', 
                'test1', 
                'test2'
            ]
        }
    ]

    inquirer.prompt(questions).then(answers => {
    
        let query = `INSERT INTO table (role, salary, department_id) 
                     VALUES ('${answers.role}', '${answers.salary}', '${answers.department_id}')`

        connection.query(query, (err, result) => {

            log(chalk.bgBlueBright('Role has been added!')); 

        }) 

    })
}


/*const addEmployee = () => {
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
            message: 'Select the employee\'s ID:',
            choices: [
                '1', 
                '2', 
                '3', 
                '4', 
                '5',
                '6', 
                '7',
                '8'
            ]
        }, 
        {
            type: 'list', 
            name: 'manager', 
            message: 'Select the manager\'s ID:', 
            choices: [
                '1', 
                '2', 
                '3', 
                '4', 
                '5', 
                '6'
            ]
        }
    ]

    inquirer.prompt(questions).then(answers => { 
        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                    VALUES (${answers.firstName}, ${answers.lastName}, ${answers.role}, ${answers.manager});`
        connection.query(query, (err, result, fields) =>{
            if (err) throw err; 
            log(chalk.bgBlue(`${answers.firstName} ${answers.lastName} has been added!`)); 
        })
    })
}

const updateEmployee = () => {

}

const removeEmployee = () => {

} */

const viewEmployees = () => { 

    let query = `SELECT * FROM employee`; 

    connection.query(query, (err, result, fields) =>{
        if(err) throw err; 
        console.table(result); 
    })

    trackerStart(); 
}

const viewRoles = () => {
    let query = `SELECT * FROM role`; 

    connection.query(query, (err, result) => {
        if (err) throw err; 

        console.table(result); 
    })

    trackerStart(); 
}

const viewDepartments = () => { 

    let query = `SELECT * FROM department`; 

    connection.query(query, (err, result, fields) => {
        if(err) throw err; 
        console.table(result); 
    }); 

    trackerStart(); 
}
