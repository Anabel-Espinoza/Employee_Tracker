const inquirer = require ('inquirer')
const mysql = require('mysql2')
const tables = require('console.table')

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
                'Add department'
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
        choices: 'arrayDepartments' //check this
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

function init() {
    inquirer
        .prompt(startQ)
        .then((response) => {
            switch (response.action) {
                case 'View all employees':
                    console.log(`\n Selected: ${response.action} \n`)
                    db.query('SELECT * FROM employee', (err, results) => 
                        console.table(results))
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
                    break
                case 'Add role':
                    console.log('Add role')
                    break
                case 'View all departments':
                    db.query('SELECT * FROM department', (err, results) =>
                    console.table(results))
                    break
                default:
                    console.log('Add department')
            }
            init()
        })
}


init()