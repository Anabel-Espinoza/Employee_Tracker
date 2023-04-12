const inquirer = require ('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')
let arrayDepartments = []
let arrayRoles = []
let arrayEmployees = []

const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database: 'management_db'
    },
    console.log('Connected to the management_db database')
)

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
        choices: arrayDepartments
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
        choices: arrayRoles
    },
    {
        type: 'list',
        name: 'manager',
        message: "Enter employee's manager",
        choices: arrayEmployees
    },
]

const viewRoles= 'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON  role.department_id = department.id ORDER BY role.id'
const viewEmployee = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS deparment, concat (e.first_name, " ", e.last_name) as Manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON role.department_id = department.id LEFT JOIN employee e ON e.id = employee.manager_id'

function init() {
    inquirer
        .prompt(startQ)
        .then((response) => {
            
            switch (response.action) {
                case 'View all employees':
                    db.query(viewEmployee, (err, results) => {
                        if (err) throw err
                        console.table(results)
                        init()
                    })
                    break
                case 'Add employee':
                    addEmployee()
                    break
                case 'Update employee role':
                    console.log('Update employee role')
                    break
                case 'View all roles':
                    db.query(viewRoles, (err, results) => {
                        if (err) throw err
                        console.table(results)
                        init()
                    })
                    break
                case 'Add role':
                    addRole()
                    break
                case 'View all departments':
                    db.query('SELECT * FROM department', (err, results) => {
                        if (err) throw err
                        console.table(results)
                        init()
                    }) 
                    break                   
                case 'Add department':
                    addDepartment()
                    break
                default:           
                    console.log('Exit')
            }
        // console.log(`\n`)
    }) 
}

function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((response) => {
            db.query(`INSERT INTO department (name) VALUES('${response.newDept}')`, (err, response) => {
                if(err) throw err; 
                console.log (`\n New Department has been added to the database \n`)
                init() })
        })
                        
}

function addEmployee() {
    // Add all current roles in arrayRoles to insert in the inquirer list
    db.query({sql: 'SELECT title FROM role', rowsAsArray: true}, function(err, results, fields) {
        for (let i=0; i<results.length; i++) {
            arrayRoles.push(results[i][0])
        }
    })
    
    // Add all current employees in arrayEmployees to insert in the inquirer list
    db.query({sql: 'SELECT concat(first_name, " ", last_name) FROM employee', rowsAsArray: true}, function(err, results, fields) {
        for (let i=0; i<results.length; i++) {
            arrayEmployees.push(results[i][0])
        }
        arrayEmployees.push('Null')
    })
        
    inquirer
        .prompt(addEmployeeQ)
        .then((response) => {
            // db.query(`INSERT INTO role (title) VALUES('${response.title}')`)    
            
            console.log (`\n New employee has been added to the database \n`)
            init()
        })                   
}

function addRole() {
    // Add current department names in arrayDepartments to insert in the inquirer list
    db.query({sql: 'SELECT name FROM department', rowsAsArray: true}, function(err, results, fields) {
        for (let i=0; i<results.length; i++) {
            arrayDepartments.push(results[i][0])
        }
        // console.log(arrayDepartments)
    })

    inquirer
        .prompt(addRoleQ)
        .then((response) => {
            let roleDept = ''
                db.promise().query({sql: `SELECT id FROM department WHERE name = '${response.department}'`, rowsAsArray: true})
                .then(([rows, fields]) => {
                    // console.table(rows)
                    roleDept = rows[0][0]
                    // console.log('role:', roleDept)
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', ${response.salary}, ${roleDept});`)
                    // .then(() => init());
                    init()
                })
       
            console.log (`\n New role has been added to the database \n`)
        })                   
}

init()