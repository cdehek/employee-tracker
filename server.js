const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "christian",
    password: "123456",
    database: "employees"
});

start();

function start() {
    inquirer.prompt({
        message: "What would you like to do?",
        type: "list",
        choices: [
            "View All Employees",
            "View All Departments",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            "QUIT"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch (answers.choice) {
            case "View All Employees":
                viewAllEmployees()
                break;
        
            case "View All Departments":
                viewAllDepartments()
                break;
            
            case "Add Employee":
                addNewEmployee()
                break;
            
            case "Add Department":
                addNewDepartment()
                break;

            case "Add Role":
                addNewRole()
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;

            default:
                connection.end()
                break;
        };
    });
};

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;

        console.table(data);
        start();
    });
};

function viewAllDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;

        console.table(data);
        start();
    });
};

function addNewEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "number",
            name: "roleId",
            message: "What is the employees role ID"
        },
        {
            type: "number",
            name: "managerId",
            message: "What is the employees manager's ID?"
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function(err, data) {
            if (err) throw err;

            console.table(".....Employee added successfully!.....");
            start();
        });
    });
};

function addNewDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the name of the department that you would like to add?"
    },
]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, data) {
            if (err) throw err;

            console.log(".....Department added successfully!.....");
            start();
        });
    });
};

function addNewRole() {
    inquirer.prompt([
        {
            message: "Enter title:",
            type: "input",
            name: "title"
        },
        {
            message: "Enter salary:",
            type: "number",
            name: "salary"
        },
        {
            message: "Enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [res.title, res.salary, res.department_id], function(err, data) {
            if (err) throw err;

            console.log(".....Role added successfully!.....")
            start();
        });
    });
};

function updateEmployeeRole() {
    inquirer.prompt([
        {
            message: "Which employee would you like to update? (Use first name only for now)",
            type: "input",
            name: "name"
        },
        {
            message: "Enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name], function (err, data) {
            if (err) throw err;

            console.log("..... Employee updated successfully!.....")
            start();
        });
    });
};