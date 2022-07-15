USE mysmarthome;

/* insert some default device types into the database */
INSERT INTO DeviceType(type, volume, 
	temperature, brightness) VALUES
('Lighting System', 0, 0, 1),
('Speaker System', 1, 0, 0),
('Surveliance System', 0, 0, 0),
('Rice Cooker', 0, 0, 0),
('Slow Cooker', 0, 1, 0),
('Bread Machine', 0, 0, 0),
('Clothes Dryer', 0, 1, 0),
('Washing Machine', 0, 1, 0),
('Air Purifier', 0, 0, 0),
('Air Conditioner', 0, 1, 0),
('Water Heater', 0, 1, 0),
('Refridgerator', 0, 1, 0),
('TV System', 1, 0, 1),
('Bath Filler', 0, 1, 0),
('Dish Washer', 0, 1, 0),
('Coffee Maker', 0, 1, 0),
('PC System', 1, 0, 1),
('Curtains', 0, 0, 1),
('Electric Kettle', 0, 1, 0),
('Robot Cleaner', 0, 0, 0);

/* update the inserted device types with more logical ranges */
UPDATE DeviceType SET
 tmp_min=50, tmp_max=200, description='Slow cooker for all your hot soup needs!'
WHERE type='Slow Cooker';
UPDATE DeviceType SET
 tmp_min=30, tmp_max=80
WHERE type='Clothes Dryer' OR 
 type='Washing Machine';
UPDATE DeviceType SET
 tmp_min=12, tmp_max=30
WHERE type='Air Conditioner';
UPDATE DeviceType SET
 tmp_min=50, tmp_max=80
WHERE type='Water Heater';
UPDATE DeviceType SET
 tmp_min=38, tmp_max=48
WHERE type='Bath Filler';
UPDATE DeviceType SET
 tmp_min=-10, tmp_max=2
WHERE type='Refridgerator';
UPDATE DeviceType SET
 tmp_min=40, tmp_max=80
WHERE type='Dish Washer';
UPDATE DeviceType SET
 tmp_min=12, tmp_max=100
WHERE type='Coffee Maker';
UPDATE DeviceType SET
 tmp_min=40, tmp_max=100
WHERE type='Electric Kettle';

/* insert some default locations into the database */
INSERT INTO Location(location) VALUES
('Living Room'),
('Kitchen'),
('Bath Room 1'),
('Bath Room 2'),
('Bedroom 1'),
('Bedroom 2');

/* insert some sample devices into the database */
INSERT INTO Device(name, location, deviceType, mode, status, volume) VALUES 
('Speaker 1', 1, 2, 1, 1, 50), 
('Speaker 2', 2, 2, 2, 1, 75);

/* insert some more sample devices into the database */
INSERT INTO Device(name, location, deviceType, mode, status, brightness) VALUES 
('Ceiling Light 1', 3, 1, 3, 0, 25),
('Ceiling Light 2', 4, 1, 4, 1, 30);