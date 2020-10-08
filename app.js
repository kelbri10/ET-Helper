const inquirer = require('inquirer'); 

//What would you like to do? -list 
    //add, update, remove employee 
//for addEmployee ask for employees for first name, last name, id number, 
//department 
const question = [
    {
        type: 'list', 
        name: 'action', 
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employee', 'Remove Employee']
    }
]

inquirer.prompt(question).then(answer =>{ 
    switch(answer){
        case 'Add Employee': 
            addEmployee(); 
            break; 
        case 'Update Employee': 
            updateEmployee(); 
            break; 
        case 'Remove Employee': 
            removeEmployee(); 
            break; 
    }
})

const addEmployee = () => {
    let questions = [
        {
            type: 'input', 
            name: 'first_name', 
            message: 'What is the employee\'s first name?' 
        }, 
        {
            type: 'input', 
            name: 'last_name', 
            message: 'What is the employee\'s last name?'
        }, 
        {
            type: 'list', 
            name: 'role', 
            choices: ['Sales Lead', 'Salesperson', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
        }
    ]

    inquirer.prompt(questions).then(answers => {
        console.log(answers); 
    })
}