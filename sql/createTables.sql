/* switch to relevant database */
USE mysmarthome;

/* create DeviceType table */
CREATE TABLE DeviceType (
	id INT AUTO_INCREMENT,
	type VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	mode_min INT DEFAULT 0,
	mode_max INT DEFAULT 9,
	volume TINYINT DEFAULT 0,
	vol_min INT DEFAULT 0,
	vol_max INT DEFAULT 100,
	temperature TINYINT DEFAULT 0,
	tmp_min INT DEFAULT 18,
	tmp_max INT DEFAULT 50,
	brightness TINYINT DEFAULT 0,
	brg_min INT DEFAULT 0,
	brg_max INT DEFAULT 100,
	PRIMARY KEY(id)
);

/* create Location table */
CREATE TABLE Location (
	id INT AUTO_INCREMENT,
	location VARCHAR(255) NOT NULL,
	PRIMARY KEY(id)
);

/* create Device table */
CREATE TABLE Device (
	id INT AUTO_INCREMENT,
	deviceType INT NOT NULL,
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	location INT NOT NULL,
	readytime DATETIME,
	duration TIME,
	status TINYINT DEFAULT 0,
	`mode` TINYINT DEFAULT 0,
	volume INT,
	temperature INT,
	brightness INT,
	PRIMARY KEY(id),
	FOREIGN KEY (deviceType) REFERENCES DeviceType(Id),
	FOREIGN KEY (location) REFERENCES Location(Id)
);