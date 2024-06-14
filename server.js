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

pool.connect(); //Connect to the database

//Questions to the user
const questions = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
    ],
  },
];

// Function to initiate the process of the answers.
async function init() {
  const answers = await inquirer.prompt(questions);
  //Query all employees
  if (answers.action == "View All Employees") {
    pool.query(
      "SELECT e.id_emp,e.first_name,e.last_name,r.role_name,d.dpt_name FROM employee AS e JOIN roles AS r ON e.role_id = r.id_role JOIN departments AS d ON e.dpt_id = d.id_dpt",
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
  // To add an employee, I am using a switch case
  // where I compare the information inputted by the user and link this
  // with the ID numbers of the departments and roles.
  if (answers.action == "Add Employee") {
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Enter Employees First Name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Employees Last Name:",
        },
        {
          type: "list",
          name: "department",
          message: "Which Department Will this Employee Belong to?",
          choices: [
            "Finance",
            "Accouting",
            "Cost",
            "Board of Directors",
            "Risk Analysis",
          ],
        },
        {
          type: "list",
          name: "role",
          message: "What role will be assigned to the Employee?",
          choices: [
            "Assistant",
            "Controller",
            "Manager",
            "Developer",
            "Engineer",
          ],
        },
      ])
      .then((answers) => {
        let dpt_id = 0;
        let role_id = 0;

        switch (answers.role) {
          case "Assistant":
            role_id = 1;
            break;
          case "Controller":
            role_id = 2;
            break;
          case "Manager":
            role_id = 3;
            break;
          case "Developer":
            role_id = 4;
            break;
          case "Engineer":
            role_id = 5;
            break;
          default:
            role_id = 1;
        }

        switch (answers.department) {
          case "Finance":
            dpt_id = 1;
            break;
          case "Accouting":
            dpt_id = 2;
            break;
          case "Cost":
            dpt_id = 3;
            break;
          case "Board of Directors":
            dpt_id = 4;
            break;
          case "Risk Analysis":
            dpt_id = 5;
            break;
          default:
            dpt_id = 1;
        }

        pool.query(
          "INSERT INTO employee (first_name, last_name, role_id, dpt_id) VALUES ($1, $2, $3, $4)",
          [answers.first_name, answers.last_name, role_id, dpt_id],
          (err, res) => {
            if (!err) {
              console.log(
                `${answers.first_name} ${answers.last_name} ${role_id} ${dpt_id} Data inserted successfully!`
              );
            } else {
              console.error("Error inserting data:", err.message);
            }
            pool.end();
          }
        );
      });
  }
  if (answers.action == "View All Roles") {
    pool.query("SELECT * from roles", (err, res) => {
      if (!err) {
        console.table(res.rows);
      } else {
        console.log(err.message);
      }
      pool.end;
    });
  }
  //Adding new role
  if (answers.action == "Add Role") {
    inquirer
      .prompt([
        {
          type: "input",
          name: "role_name",
          message: "Enter the Role Name",
        },
      ])
      .then((answers) => {
        pool.query(
          "INSERT INTO roles (role_name) VALUES ($1)",
          [answers.role_name],
          (err, res) => {
            if (!err) {
              console.log(`${answers.role_name} inserted successfully!`);
            } else {
              console.error("Error inserting data:", err.message);
            }
            pool.end();
          }
        );
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

  //Adding new Department
  if (answers.action == "Add Department") {
    inquirer
      .prompt([
        {
          type: "input",
          name: "dpt_name",
          message: "Enter the Department Name",
        },
      ])
      .then((answers) => {
        pool.query(
          "INSERT INTO departments (dpt_name) VALUES ($1)",
          [answers.dpt_name],
          (err, res) => {
            if (!err) {
              console.log(`${answers.dpt_name} inserted successfully!`);
            } else {
              console.error("Error inserting data:", err.message);
            }
            pool.end();
          }
        );
      });
  }
}

init();
