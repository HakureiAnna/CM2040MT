/* start afresh by removing existing database */
DROP DATABASE IF EXISTS mysmarthome;

/* create datbase */
CREATE DATABASE mysmarthome;

/* grant all privileges to the user (local testing)*/
/* 
USE mysmarthome;
GRANT ALL PRIVILEGES ON mysmarthome.* TO 'root'@'localhost';
*/