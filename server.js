const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extend: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    user: "postgres", //PostgreSQL username
    password: "abelha123", //PostgreSQL password
    host: "localhost", //Host to call
    database: "employees_db", //Dababase name to be connect
  },
  console.log(`Connected to the employees_db database.`) //If success message that it was connect to database
);

pool.connect();

//Questions to the user
const questions = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
    ],
  },
];

// SELECT e.id_emp, e.first_name, e.last_name, d.id_dpt,d.dpt_name, id_role, r.role_name
// FROM employee AS e
// JOIN departments AS d ON d.id_emp = e.id_emp
// JOIN roles AS r ON d.id_dpt = r.id_dpt;

// Function to initiate the process of the answers.
async function init() {
  const answers = await inquirer.prompt(questions);
  //Query all employees
  if (answers.action == "View All Employees") {
    pool.query(
      "SELECT e.id_emp, e.first_name, e.last_name, d.id_dpt,d.dpt_name, id_role, r.role_name FROM employee AS e JOIN departments AS d ON d.id_emp = e.id_emp JOIN roles AS r ON d.id_dpt = r.id_dpt",
      (err, res) => {
        if (!err) {
          console.table(res.rows);
        } else {
          console.log(err.message);
        }
        pool.end;
        init();
      }
    );
  }
  if (answers.action == "Add Employee") {
    inquirer.prompt([
      {
        type: "string",
        message: "Type the First Name, Last Name and Addresss",
        name: "Add Employee",
      },
    ]);

    pool.query("ADD EMPLOYEE", (err, res) => {
      if (!err) {
        console.table(res.rows);
      } else {
        console.log(err.message);
      }
      pool.end;
      init();
    });
  }
  if (answers.action == "View All Roles") {
    inquirer.prompt([
      {
        type: "string",
        message: "Type the First Name, Last Name and Addresss",
        name: "View All Roles",
      },
    ]);

    pool.query("SELECT * from roles", (err, res) => {
      if (!err) {
        console.table(res.rows);
      } else {
        console.log(err.message);
      }
      pool.end;
      init();
    });
  }
  if (answers.action == "View All Departments") {
    inquirer.prompt([
      {
        type: "string",
        message: "Type the First Name, Last Name and Addresss",
        name: "View All Departments",
      },
    ]);

    pool.query("SELECT * from departments", (err, res) => {
      if (!err) {
        console.table(res.rows);
      } else {
        console.log(err.message);
      }
      pool.end;
      init();
    });
  }
}

init();
