const inquirer = require('inquirer');
const mysql = require('mysql2');
const sequelize = require('./config/connection');
const db = require('./config/connection');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'mySQLTweezer6109!',
//     database: 'employees_db'
//   });

// setting up the function to authenticate the connection to the database
function authenticateDatabase() {
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
            viewEmployees(); // Call viewEmployees after the connection is established
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}
// Actually calling the function.  Establishes a connection to the database. It uses the 'sequelize.authenticate()' method to authenticate the connection.
authenticateDatabase();

function viewEmployees() {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title AS role, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res); // uses table view rather than logging the result to the console
    });
}

function viewDepartments() {
    db.query(`SELECT id, name 'department' FROM department`, function (err, results) {
        if (err) {
            console.log(err);
            init();
        } else {
            console.table(results);
            init();
        }
    });
}

function viewRoles() {
    db.query(`SELECT role.id, title 'role', salary, department.name 'department' 
    FROM role 
    JOIN department 
    ON role.department_id = department.id`, 
    function (err, results) {
        if (err) {
            console.log(err);
            init();
        } else {
            console.table(results);
            init();
        }
    });
}

function addEmployee() {
    db.query('SELECT * FROM role', function (err, roles) {
        if (err) {
            console.log(err);
            init();
            return;
        }

        db.query('SELECT * FROM employee', function (err, managers) {
            if (err) {
                console.log(err);
                init();
                return;
            }

            const roleChoices = roles.map(role => role.title);
            const managerChoices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the employee\'s first name?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the employee\'s last name?'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employee\'s role?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who is the employee\'s manager?',
                    choices: managerChoices
                }
            ]).then((answers) => {
                const role = roles.find(role => role.title === answers.role_id);
                answers.role_id = role.id;

                const manager = managers.find(manager => `${manager.first_name} ${manager.last_name}` === answers.manager_id);
                answers.manager_id = manager.id;

                db.query('INSERT INTO employee SET ?', answers, function (err, results) {
                    if (err) {
                        console.log(err);
                        init();
                    } else {
                        console.log("Employee added!");
                        init();
                    }
                });
            });
        });
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the department\'s name?'
        }
    ]).then((answers) => {
        db.query('INSERT INTO department SET ?', answers, function (err, results) {
            if (err) {
                console.log(err);
                init();
            } else {
                console.log("Department added!");
                init();
            }
        });
    })
}

function addRole() {
    db.query('SELECT * FROM department', function (err, departments) {
        if (err) {
            console.log(err);
            init();
            return;
        }

        const departmentChoices = departments.map(department => department.name);

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the role\'s title?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the role\'s salary?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'What department does the role belong to?',
                choices: departmentChoices
            }
        ]).then((answers) => {
            const department = departments.find(department => department.name === answers.department_id);
            answers.department_id = department.id;

            db.query('INSERT INTO role SET ?', answers, function (err, results) {
                if (err) {
                    console.log(err);
                    init();
                } else {
                    console.log("Role added!");
                    init();
                }
            });
        });
    });
}

function updateRole() {
    db.query('SELECT * FROM employee', function (err, employees) {
        if (err) {
            console.log(err);
            init();
            return;
        }

        db.query('SELECT * FROM role', function (err, roles) {
            if (err) {
                console.log(err);
                init();
                return;
            }

            const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
            const roleChoices = roles.map(role => role.title);

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the employee\'s new role?',
                    choices: roleChoices
                }
            ]).then((answers) => {
                const employee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.id);
                answers.id = employee.id;

                const role = roles.find(role => role.title === answers.role_id);
                answers.role_id = role.id;

                db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.role_id, answers.id], function (err, results) {
                    if (err) {
                        console.log(err);
                        init();
                    } else {
                        console.log("Employee role updated!");
                        init();
                    }
                });
            });
        });
    });
}

function init () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all departments', 'View all roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Exit']
        }
    ]).then((answers) => {
        switch (answers.options) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Exit':
                sequelize.end();
                break;
        }
    })
}

init();

