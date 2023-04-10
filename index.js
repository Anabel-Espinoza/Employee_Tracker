const inquirer = require ('inquirer')
const mysql = require('mysql2')

const question = [
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

const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database: 'management_db'
    },
    console.log('Connected to the management_db database')
)

function init() {
    inquirer
        .prompt(question)
        .then((response) => {
            switch (response.action) {
                case 'View all employees':
                    console.log('View all employees')
                    init()
                    break
                case 'Add employee':
                    console.log('Add employee')
                    init()
                    break
                case 'Update employee role':
                    console.log('Update employee role')
                    init()
                    break
                case 'View all roles':
                    console.log('View all roles')
                    init()
                    break
                case 'Add role':
                    console.log('Add role')
                    init()
                    break
                case 'View all departments':
                    console.log('View all departments')
                    init()
                    break
                default:
                    console.log('Add department')
                    init()
            }
        })
}

init()