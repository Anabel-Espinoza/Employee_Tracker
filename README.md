# Employee_Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Description

This application is a CMS (Content Management System) that runs from the command line to help the user manage departments, roles, and employees from the management database. 
The user has a list of options to perform: view and add departments, roles, or employees. User can also update employee role, delete department, and learn the budget per department.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)
- [Credits](#credits)
- [License](#license)

## Installation

- Clone the repository.
- Run schema.sql and seeds.sql from the db folder.
- Install required packages. From the terminal: npm i.
- Get .env file with SQL_password.
- Run the app. From the terminal: node index.js.

## Usage

- A list of actions will be prompted in the terminal for the user to select. 
- View options will display tables with the db information.
- Add and update options will required from the user to answer follow up questions.
- The main menu will appear automatically for the user to keep working in the app.
- To exit, select 'Quit' from the main menu.

**Video of the application functionality:** https://drive.google.com/file/d/1P8_PYGpXyUZZZiBvf-xyBOmQt_wSlLqv/view

## Tests

N/A.

## Credits

Packages and documentation
- Inquirer: https://www.npmjs.com/package/inquirer/v/8.2.4
- Node MySQL 2: https://www.npmjs.com/package/mysql2
- Console.table: https://www.npmjs.com/package/console.table
- asciiart-logo: https://www.npmjs.com/package/asciiart-logo
- dotenv: https://www.npmjs.com/package/dotenv

Additional Resources
- Understanding SQL Server SELF JOIN By Practical Examples: https://www.devart.com/dbforge/sql/sqlcomplete/self-join-in-sql-server.html#:~:text=The%20SELF%20JOIN%20in%20SQL,will%20result%20in%20an%20error.

TA Constan Fernando
- Provided list of commands to concat names, add alias in SQL queries.

## License

Project under MIT license.