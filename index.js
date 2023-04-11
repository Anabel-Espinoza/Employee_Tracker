const inquirer = require ('inquirer')
const mysql = require('mysql2')
const tables = require('console.table')
let arrayDepartments = []

const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database: 'management_db'
    },
    console.log('Connected to the management_db database')
)

const viewRoles= 'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON  role.department_id = department.id ORDER BY role.id'
const viewEmployees = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS deparment, concat (e.first_name, " ", e.last_name) as Manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON role.department_id = department.id LEFT JOIN employee e ON e.id = employee.manager_id'

const startQ = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
                'View all employees',
                'Add employee',
                'Update employee role',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department',
                'Quit'
                ]
    }
]

const addDepartmentQ = [
    {
        type: 'input',
        name: 'newDept',
        message: 'Please enter the name of the new department'
    }
]

const addRoleQ = [
    {
        type: 'input',
        name: 'title',
        message: 'Please enter title of the new role'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for this position'
    },
    {
        type: 'list',
        name: 'department',
        message: 'Select the department the new position belongs to',
        choices: arrayDepartments //check this
    }
]

const addEmployeeQ = [
    {
        type: 'input',
        name: 'firstName',
        message: "Enter employee's first name"
    },
    {
        type: 'input',
        name: 'lastName',
        message: "Enter employee's last name"
    },
    {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: 'arrayRoles' //check this
    },
    {
        type: 'list',
        name: 'manager',
        message: "Enter employee's manager",
        choices: 'arrayEmployees' //check this, need to add None to the options
    },
]


function init() {
    inquirer
        .prompt(startQ)
        .then((response) => {
            console.log(`\n Selected: ${response.action} \n`)
            
            switch (response.action) {
                case 'View all employees':
                    db.query(viewEmployees, (err, results) => 
                        console.table(results))
                    init()
                    break
                case 'Add employee':
                    console.log('Add employee')
                    break
                case 'Update employee role':
                    console.log('Update employee role')
                    break
                case 'View all roles':
                    db.query(viewRoles, (err, results) =>
                        console.table(results))
                    // db.promise().query({sql: 'SELECT * FROM role', rowsAsArray: true})
                    // .then(([rows, fields]) => {
                    //     console.log(rows)
                    // })
                    init()
                    break
                case 'Add role':
                    addRole()
                    break
                case 'View all departments':
                    db.query('SELECT * FROM department', (err, results) =>
                    console.table(results))
                    init() 
                    break                   
                case 'Add department':
                    addDepartment()
                    break
                default:           
                    console.log('Exit')
                    break
            }

        console.log(`\n`)
        })    
}

function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((response) => {
            db.query(`INSERT INTO department (name) VALUES('${response.newDept}')`)
            // db.promise().query(`INSERT INTO department (name) VALUES('${response.newDept}')`)
                // .then(([rows, fields]) => {
                    // console.table(rows)
                    console.log (`\n New Department has beed added to the database \n`)
                    init()
                })
                        
}

function addRole() {
    db.query({sql: 'SELECT name FROM department', rowsAsArray: true}, function(err, results, fields) {
        for (let i=0; i<results.length; i++) {
            arrayDepartments.push(results[i][0])
        }
        console.log(arrayDepartments)
    })
        
    inquirer
        .prompt(addRoleQ)
        .then((response) => {
            // db.query(`INSERT INTO role (title) VALUES('${response.title}')`)    
            
            console.log (`\n New Department has beed added to the database \n`)
            init()
        })
                        
}

init()