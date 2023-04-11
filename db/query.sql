-- VIEW ALL DEPARTMENTS
SELECT * FROM department;

-- VIEW ALL ROLES
SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department
ON  role.department_id = department.id
ORDER BY role.id;

-- VIEW ALL EMPLOYEES
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS deparment, concat (e.first_name, " ", e.last_name) as Manager
FROM employee
JOIN role
ON role.id = employee.role_id
JOIN department
ON role.department_id = department.id
LEFT JOIN employee e
ON e.id = employee.manager_id

-- ADD NEW DEPARTMENT
INSERT INTO department (name)
    VALUES('HR');

-- ADD NEW ROLE
INSERT INTO role (title, salary, department_id)
    VALUES('HR specialist', 80000, 5);