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

    log('Connection to database started!'); 
    trackerStart(); 
})

const trackerStart = () => { 
    let question = [
        {
            type: 'list', 
            name: 'action', 
            message: 'What would you like to do?',
            choices: [
                'Add Employee', 
                'Update Employee',
                'Remove Employee', 
                'View all employees', 
                'View all departments', 
                'Exit'
            ]
        }
    ]

    inquirer.prompt(question).then(answer => {
        switch(answer.action){ 
            case 'Add Employee': 
                addEmployee(); 
                break; 
            case 'Update Employee': 
                updateEmployee(); 
                break; 
            case 'Remove Employee': 
                removeEmployee(); 
                break; 
            case 'View all employees': 
                viewEmployees(); 
                break; 
            case 'View all departments': 
                viewDepartments(); 
                break; 
            case 'Exit': 
                log('Thank you for using the app.\n')
                connection.end(); 
                break; 
        }
    })
}


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

}

const viewEmployees = () => { 
    let query = `SELECT * FROM employee`; 
    connection.query(query, (err, result, fields) =>{
        if(err) throw err; 
        console.table(result); 
    })

    trackerStart(); 
}

const viewDepartments = () => { 
    let query = `SELECT * FROM department`
    connection.query(query, (err, result, fields) => {
        if(err) throw err; 
        console.table(result); 
    }); 

    trackerStart(); 
}

