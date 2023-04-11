-- VIEW ALL DEPARTMENTS
SELECT * FROM department;

-- VIEW ALL ROLES
SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department
ON  role.department_id = department.id
ORDER BY role.id;

-- VIEW ALL EMPLOYEES (needs to add manager name)
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department
FROM employee
JOIN role
ON role.id = employee.role_id
JOIN department
ON role.department_id = department.id;


