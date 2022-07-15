module.exports = {
    // set of constants to prevent using magic numbers in the code 
    // these are used to set the mode for the device template 
    MODE_ADD: 0,
    MODE_UPDATE: 1,
    MODE_DELETE: 2,
    MODE_SHOW: 3,
    
    // list of SQL queries
    // SQL query to get all fields of all device types from devices table
    Q_DEVICE_TYPES: 'SELECT * FROM DeviceType',
    // SQL query to get all fields of all locations from the locations table
    Q_LOCATIONS: 'SELECT * FROM Location',
    Q_DEVICE_TYPE: 'SELECT * FROM DeviceType WHERE id = ?',
    /*
     * SQL query to get all devices from the devices table, 
     * inner joined with the type name field from the device types table
     * and further inner joined with the location name field from the locations table
     */
    Q_DEVICES: 'SELECT d.id, d.name, d.description, dt.type, d.deviceType, d.status, ' + 
        'd.mode, d.location, l.location AS locationName, d.brightness, d.temperature, d.volume, d.readytime, d.duration ' + 
        'FROM Device AS d ' + 
        'INNER JOIN DeviceType AS dt ON dt.id = d.deviceType ' + 
        'INNER JOIN Location AS l ON l.id = d.location ',
    /*
     * SQL query to get all fields of specified device from the device table
     * inner joined with the type name field from the device types table
     * and further inner joined with the location name field from the locations table
     */
    Q_DEVICE: 'SELECT d.id, d.name, d.description, dt.type, d.deviceType, l.location as locationName, d.status, ' + 
        'd.mode, d.location, d.brightness, d.temperature, d.volume, d.readytime, d.duration ' + 
        'FROM Device AS d ' + 
        'INNER JOIN DeviceType AS dt ON dt.id = d.deviceType ' +
        'INNER JOIN Location AS l ON l.id = d.location ' +
        'WHERE d.id = ?',
    // SQL query to delete device with specified id from the devices table
    Q_DEVICE_DELETE: 'DELETE FROM Device WHERE id = ?',

    // validation function that validates a single field
    validate: function(val, minVal, maxVal) {
        // return comparison result of comparing val to the allowed minimum and maximum value
        return val >= minVal && val <= maxVal;
    },
    /* 
     * validate function that validates the entire device
     * returns an array of errors that can be rendered on the device template
     */
    validateDevice: function(device, deviceType) {
        // return object, an array of detected errors
        var errors = [];
        // name validation
        if (device.name.length == '') {
            errors.push('Please enter a name for the device.');
        }
        // mode validation
        if (!this.validate(device.mode, deviceType.mode_min, deviceType.mode_max)) {
            errors.push('Please enter a mode bewteen ' + deviceType.mode_min + ' and ' + deviceType.mode_max + '.');
        }
        // temperature validation if device type supports temperature field
        if (deviceType.temperature != 0) {            
            if (!this.validate(device.temperature, deviceType.tmp_min, deviceType.tmp_max)) {
                errors.push('Please enter a temperature between ' + deviceType.tmp_min + ' and ' + deviceType.tmp_max + '.');
            }
        }
        // brightness validation if device type supports brightness field
        if (deviceType.brightness != 0) {
            if (!this.validate(device.brightness, deviceType.brg_min, deviceType.brg_max)) {
                errors.push('Please enter a brightness between ' + deviceType.brg_min + ' and ' + deviceType.brg_max + '.');
            }
        }
        // volume validation if device type supports volume field
        if (deviceType.volume != 0) {
            if (!this.validate(device.volume, deviceType.vol_min, deviceType.vol_max)) {
                errors.push('Please enter a volume between ' + deviceType.vol_min + ' and ' + device.vol_max + '.');
            }
        }
        return errors;
    },
    // utility function used to extract device details into a new JSON object from src
    extractDevice: function(src) {
        return {
            name: src.name,
            type: parseInt(src.deviceType),
            description: src.description,
            location: parseInt(src.location),
            status: (src.status == 'on'? 1: 0),
            duration: src.duration,
            readyTime: src.readyTime,
            mode: parseInt(src.mode)
        };
    },
    // utility function that returns a custom object that contains both the query and argument for the insertion operation
    createDeviceInsert: function(device, src) {
        // prefix of SQL query to insert new device into the devices table
        let sql = 'INSERT INTO Device(name, deviceType, location, description, readytime, duration, status, mode';
        // middle part of query
        let params = '(?, ?, ?, ?, ?, ?, ?, ?';
        // array of arguments that is common to all devices
        let args = [device.name, device.type, device.location, device.description, device.readyTime,             
            device.duration, device.status, device.mode];
        // if volume exists in src, add it to both query and args
        if ('volume' in src) {            
            device.volume = parseInt(src.volume);
            sql += ', volume';
            params += ', ?';
            args.push(device.volume);
        }
        // if brightness exists in src, add it to both query and args
        if ('brightness' in src) {
            device.brightness = parseInt(src.brightness);
            sql += ', brightness';
            params += ', ?';
            args.push(device.brightness);
        }
        // if temperature exists in src, add it to both query and args
        if ('temperature' in src) {
            device.temperature = parseInt(src.temperature);
            sql += ', temperature';
            params += ', ?';
            args.push(device.temperature);
        }
        // finish constructing the query
        sql += ') VALUES' + params + ')';
        return {
            query: sql,
            args: args
        };
    },
    // utility function that returns a custom object that contains both the query and argument for the update operation
    createDeviceUpdate: function(device, src) {
        // prefix of SQL query to update existing device in the devices table with specified id
        let sql = 'UPDATE Device SET ' +
            'name = ?, ' + 
            'deviceType = ?, ' + 
            'location = ?, ' + 
            'description = ?, ' +
            'readytime = ?, ' +
            'duration = ?, ' + 
            'status = ?, ' + 
            'mode = ?';
        // arguments common to all devices
        let args = [device.name, device.type, device.location, device.description, device.readyTime,             
            device.duration, device.status, device.mode];
        // if volume exists in src, add it to both query and args
        if ('volume' in src) {            
            device.volume = parseInt(src.volume);
            sql += ', volume = ?';
            args.push(device.volume);
        }
        // if brightness exists in src, add it to both query and args
        if ('brightness' in src) {
            device.brightness = parseInt(src.brightness);
            sql += ', brightness = ?';
            args.push(device.brightness);
        }
        // if temperature exists in src, add it to both query and args
        if ('temperature' in src) {
            device.temperature = parseInt(src.temperature);
            sql += ', temperature = ?';
            args.push(device.temperature);
        }
        // finish constructing the query and args
        sql += ' WHERE id = ?';
        args.push(parseInt(src.id));
        return {
            query: sql,
            args: args
        };
    },
};