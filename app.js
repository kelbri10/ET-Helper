const mysql = require('mysql'); 
const inquirer = require('inquirer'); 

const connection = mysql.createConnection({
    host: 'localhost', 

    port: 3306, 

    user: 'root', 

    password: '', 

    database: 'employee_tracker'
}); 

connection.connect(err => { 
    if (err) throw err; 

    console.log('Connection to database started!'); 
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
                console.log('Thank you for using the app.')
                connection.end(); 
                break; 
        }
    })
}


const addEmployee = () => {
    let quesitons = [
        ''
    ]

    inquirer.prompt(questions).then(answers => { 
        connection.query()
    })
}

const updateEmployee = () => {

}

const removeEmployee = () => {

}

const viewEmployees = () => { 

}

const viewDepartments = () => { 

}

