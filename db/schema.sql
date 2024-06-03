-- DELETE DATABASE IF EXISTS AND AFTER CREATE DATABASE
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Conect to the DATABASE
\c employees_db;

-- Creating table employee and id_emp is the PK field
CREATE TABLE employee (
    id_emp SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    address_emp VARCHAR(50) NOT NULL
);

-- Creating table departaments and id_dpt is the PK field and id_emp is the FK
CREATE TABLE departments (
    id_dpt SERIAL PRIMARY KEY,
    dpt_name VARCHAR(30) NOT NULL,
    id_emp INT,
    FOREIGN KEY (id_emp)
    REFERENCES employee (id_emp)
    ON DELETE SET NULL 
);

-- Creating table departaments and id_dpt is the PK field and id_dpt is the FK
CREATE TABLE roles (
    id_role SERIAL PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL,
    id_dpt INT,
    FOREIGN KEY (id_dpt)
    REFERENCES departments(id_dpt)
    ON DELETE SET NULL 
);
