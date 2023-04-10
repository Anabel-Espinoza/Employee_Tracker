INSERT INTO department (name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Sales"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 3),
        ("Salesperson", 80000, 3),
        ("Lead Engineer", 150000, 1),
        ("Software Engineer", 120000, 1),
        ("Account Manager", 160000, 2),
        ("Accountant", 120000, 2),
        ("Legal Team Leader", 250000, 4),
        ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("John", "Smoltz", 1, null),
        ("Greg", "Maddux", 2, 1),
        ("Tom", "Glavine", 3, null),
        ("Rafa", "Nadal", 4, 3),
        ("Sergio", "Perez", 5, null),
        ("Carlos", "Alcaraz", 6, 5),
        ("Mary", "Fried", 7, null),
        ("Laura", "Freeman", 8, 7);