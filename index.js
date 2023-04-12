// Variables and required packages
const inquirer = require ('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')
let arrayDepartments = []
let arrayRoles = []
let arrayEmployees = []

// db connection
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database: 'management_db'
    },
    console.log('Connected to the management_db database')
)

// Inquirer questions - Main question and follow up
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

const updateEmpRoleQ = [
    {
        type: 'list',
        name: 'employee',
        message: "Which employee's role do you want to update?",
        choices: arrayEmployees
    },
    {
        type: 'list',
        name: 'newRole',
        message: "Which role do you want to assign to the selected employee?",
        choices: arrayRoles
    }
]

// Main question
function init() {
    inquirer
        .prompt(startQ)
        .then((response) => {
            
            switch (response.action) {
                case 'View all employees':
                    viewEmployees()                    
                    break
                case 'Add employee':
                    addEmployee()
                    break
                case 'Update employee role':
                    UpdateEmpRole()
                    break
                case 'View all roles':
                    viewRoles()
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
                    db.end()           
                    console.log('--Leaving app--')
            }
    }) 
}

function viewEmployees() {
    const viewEmployee = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS deparment, concat (e.first_name, " ", e.last_name) as Manager 
                FROM employee 
                JOIN role ON role.id = employee.role_id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee e ON e.id = employee.manager_id`
    db.query(viewEmployee, (err, results) => {
        if (err) throw err
        console.table(results)
        init()
    })
}

function addEmployee() {
    getEmplRoleArrays()
        
    inquirer
        .prompt(addEmployeeQ)
        .then((response) => {
            let idManager = ''
            let idRole = ''
            // Get role id from role title entered by the user
            db.promise().query(`SELECT id FROM role WHERE title = '${response.role}'`)
                .then (([row, fields]) => {            
                idRole = row[0].id    
                if (response.manager !== 'Null') {
                    let managerName = response.manager.split(" ")[0]
                    let managerLastN = response.manager.split(" ")[1]
                    // Get manager id from the employee name entered by the user
                    db.promise().query(`SELECT id FROM employee WHERE first_name = '${managerName}' AND last_name = '${managerLastN}';`)
                    .then(([rows, fields]) => {
                        idManager = rows[0].id
                         // INSERT new employee in employee table
                        db.query(`INSERT INTO employee SET ?`, {
                            first_name: response.firstName, 
                            last_name: response.lastName, 
                            role_id: idRole, 
                            manager_id: idManager})
                    })          
                } else {
                    db.query(`INSERT INTO employee SET ?`, {
                        first_name: response.firstName,
                        last_name: response.lastName,
                        role_id: idRole
                    })
                }
                console.log (`\n --New employee has been added to the database-- \n`)
                getEmplRoleArrays()
                init()
            })
        })                                       
}

function UpdateEmpRole() {
    getEmplRoleArrays()

    inquirer
        .prompt(updateEmpRoleQ)
        .then((response) => {
            let idEmployee = ''
            let idRole = ''
    
        // Get role id from role title entered by the user
        db.query(`SELECT id FROM role WHERE title = '${response.newRole}'`, (err, row) => {
            if (err) throw err
            idRole = row[0].id                
        })
        // Get employee id from the employee name entered by the user
        let employeeName = response.employee.split(" ")[0]
        let employeeLastN = response.employee.split(" ")[1]         
        db.promise().query(`SELECT id FROM employee WHERE first_name = '${employeeName}' AND last_name = '${employeeLastN}';`)
        .then(([rows, fields]) => {
            idEmployee = rows[0].id
            // UPDATE employee's role in employee table
            db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [idRole, idEmployee] )
       })
        console.log(`\n --Employee's role has been updated in the database-- \n`)
        init()
    })
}

function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((response) => {
            db.query(`INSERT INTO department (name) VALUES('${response.newDept}')`, (err, response) => {
                if(err) throw err; 
                console.log (`\n New Department has been added to the database \n`)
                init()
            })
        })                  
}

function viewRoles() {
    const viewRole= `SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role
                JOIN department ON  role.department_id = department.id ORDER BY role.id`

    db.query(viewRole, (err, results) => {
        if (err) throw err
        console.table(results)
        init()
    })
}

function addRole() {
    // Add current department names in arrayDepartments to insert in the inquirer list
    db.query({sql: 'SELECT name FROM department', rowsAsArray: true}, function(err, results, fields) {
        for (let i=0; i<results.length; i++) {
            arrayDepartments.push(results[i][0])
        }
    })

    inquirer
        .prompt(addRoleQ)
        .then((response) => {
            let roleDept = '' // GET id from the department selected by the user to add to role table
                db.promise().query({sql: `SELECT id FROM department WHERE name = '${response.department}'`, rowsAsArray: true})
                .then(([rows, fields]) => {
                    roleDept = rows[0][0]
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', ${response.salary}, ${roleDept});`)
                    init()
                })
            console.log (`\n New role has been added to the database \n`)
        })                   
}


// Helper function to add current employees and current roles to use in inquirer lists
function getEmplRoleArrays() {
    // Add all current roles in arrayRoles to insert in the inquirer list
    db.query('SELECT title FROM role', (err, results) => {
        if (err) throw err
        for (let i=0; i<results.length; i++) {
            arrayRoles.push(results[i].title)
        }
    })
    
    // Add all current employees in arrayEmployees to insert in the inquirer list
    db.query('SELECT concat(first_name, " ", last_name) as employeeName FROM employee', (err, rows) => {
        if (err) throw err
        for (let i=0; i<rows.length; i++) {
            arrayEmployees.push(rows[i].employeeName)
        }
        arrayEmployees.push('Null')
    })
}

// Start the app
init()