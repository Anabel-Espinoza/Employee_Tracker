// Variables and required packages
const inquirer = require ('inquirer')
const cTable = require('console.table')
db = require('./connection')
let arrayDepartments = []
let arrayRoles = []
let arrayEmployees = []

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
                'View employees by manager',
                'Delete department',
                'Budget by department',
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

const viewByManagerQ = [
    {
        type: 'list',
        name: 'manager',
        message: 'Select a manager to view who reports to them.',
        choices: arrayEmployees
    }
]

const deleteDepartmentQ = [
    {
        type: 'list',
        name: 'department',
        message: 'Select a department to delete',
        choices: arrayDepartments
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
                    viewDepartments() 
                    break                   
                case 'Add department':
                    addDepartment()
                    break
                case 'View employees by manager':
                    viewByManager()
                    break
                case 'Delete department':
                    deleteDepartment()
                    break
                case 'Budget by department':
                    budgetByDept()
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
    rolesArray() // Get current roles/employees from the database to use in inquirer list
    employeeArray()
    arrayEmployees.push('None') // Add null option in manager
  
    inquirer
        .prompt(addEmployeeQ)
        .then((response) => {
            let idManager = ''
            let idRole = ''
            // Get role id from role title entered by the user
            db.promise().query(`SELECT id FROM role WHERE title = '${response.role}'`)
                .then (([row, fields]) => {            
                idRole = row[0].id    
                if (response.manager !== 'None') {
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
                arrayEmployees = []
                arrayRoles = []
                console.log (`\n --New employee has been added to the database-- \n`)
                init()
            })
        })                                       
}

function UpdateEmpRole() {    
    db.promise().query('SELECT concat(first_name, " ", last_name) as employeeName FROM employee')
    .then (([rows, fields]) => {
        // console.log(rows)
        for (let i=0; i<rows.length; i++) {
            arrayEmployees.push(rows[i].employeeName)
        }
        // console.log(arrayEmployees)
        db.query('SELECT title FROM role', (err, results) => {
            if (err) throw err
            for (let i=0; i<results.length; i++) {
                arrayRoles.push(results[i].title)
            }
        })

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
    })
}

function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((response) => {
            db.query(`INSERT INTO department (name) VALUES('${response.newDept}')`, (err, response) => {
                if(err) throw err; 
                console.log (`\n --New Department has been added to the database-- \n`)
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
    departmentArray()
    
    inquirer
        .prompt(addRoleQ)
        .then((response) => {
            let roleDept = '' // GET id from the department selected by the user to add to role table
                db.promise().query(`SELECT id FROM department WHERE name = '${response.department}'`)
                .then(([rows, fields]) => {
                    roleDept = rows[0].id
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', ${response.salary}, ${roleDept});`)
                    console.log (`\n --New role has been added to the database-- \n`)
                    arrayDepartments = []
                    init()
                })
        })                   
}

function viewDepartments() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err
        console.table(results)
        init()
    })
}

const viewByManager = async() => {
    const array = await employeeArray()
    // console.log(arrayEmployees)
    inquirer 
        .prompt(viewByManagerQ)
        .then((response) => { 
            let manager_id = ''
            let managerName = response.manager.split(" ")[0]
            let managerLastN = response.manager.split(" ")[1]
            db.promise().query(`SELECT id FROM employee WHERE first_name = '${managerName}' AND last_name = '${managerLastN}'`)
                .then(([rows, fields]) => {
                    manager_id = rows[0].id
                    const viewQuery = `SELECT id, first_name, last_name 
                        FROM employee 
                        WHERE manager_id = ${manager_id}`
                    db.query(viewQuery, (err, results) => {
                    if (err) throw err
                    arrayEmployees = []
                    console.table(results)
                    init()
                    })
                })
        })
}

function deleteDepartment() {
    console.log('array if', arrayDepartments)
    inquirer
        .prompt(deleteDepartmentQ)
        .then((response) => {          
            db.query(`DELETE FROM department WHERE name = ?`, [response.department], (err, result) => {
            if (err) throw err
            console.log(`/n -- Department has been deleted --`)
            init()
        })
    })                 
}

function budgetByDept() {
    db.query(`SELECT department.name AS department, sum(salary) AS budget
    FROM role
    JOIN department
    ON  role.department_id = department.id
    GROUP by department_id`, (err, results) => {
        if(err) throw err
        console.table(results)
        init()
    })
}

// Add all current roles in arrayRoles to insert in inquirer list
function rolesArray() {
    db.query('SELECT title FROM role', (err, results) => {
    if (err) throw err
    for (let i=0; i<results.length; i++) {
        arrayRoles.push(results[i].title)
    }
    })
}

// Add all current employees in arrayEmployees to insert in inquirer list
function employeeArray() {
    db.query('SELECT concat(first_name, " ", last_name) as employeeName FROM employee', (err, rows) => {
    if (err) throw err
    for (let i=0; i<rows.length; i++) {
        arrayEmployees.push(rows[i].employeeName)
    }
    })
}

// Add current departments into arrayDepartments to use in inquirer list
function departmentArray() {
    db.query('SELECT name FROM department', (err, results) => {
        for (let i=0; i<results.length; i++) {
            arrayDepartments.push(results[i].name)
        }
    })
}

// Start the app
init()