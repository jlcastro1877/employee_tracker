-- DELETE DATABASE IF EXISTS AND AFTER CREATE DATABASE
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Conect to the DATABASE
\c employees_db;

CREATE TABLE departments (
    id_dpt SERIAL PRIMARY KEY,
    dpt_name VARCHAR(30) NOT NULL
);

-- Creating table roles and id_role is the PK field
CREATE TABLE roles (
    id_role SERIAL PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL
);

-- Creating table employee and id_emp is the PK field
CREATE TABLE employee (
    id_emp SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    role_id INT,
    dpt_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id_role),
    FOREIGN KEY (dpt_id) REFERENCES departments(id_dpt)
);
