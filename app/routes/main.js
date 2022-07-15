const utilities = require("../utilities");

module.exports = function(app) {
    /* GET handler for default route
     * description:
     *  this route displays the default home page (landing page)
     * input:
     *  none
     * output:
     *  a basic page that describe the system briefly
     */
    app.get('/', function(req, res) {
        // simply render the HTML in the template
        res.render('index.html');
    });
    
    /*
     * GET handler for the about route
     * description:
     *  this route displays developer information and description of system.
     * input:
     *  none
     * output:
     *  a basic page providing developer and system details
     */
    app.get('/about', function(req, res) {
        // simply render the HTML in the template
        res.render('about.html');
    });

    /*
     * GET handler for the add device route
     * description:
     *  this handler displays the initial form to allow user to define a new device to add to the database
     * input:
     *  type - the device type of the currently being added
     * output:
     *  a form that is customized based on the type parameter to only display fields that are valid for the
     *  given device type
     */
    app.get('/devices/add', function(req, res) {
        // get SQL query from utilities
        const qDeviceTypes = utilities.Q_DEVICE_TYPES;
        const qLocations = utilities.Q_LOCATIONS;
        const qDeviceType = utilities.Q_DEVICE_TYPE;

        // obtain list of all device types
        db.query(qDeviceTypes, (err, rDeviceTypes) => {
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }
            // obtain list of all locations
            db.query(qLocations, (err, rLocations) => {  
                // if error occurs, nothing we can do, redirect to home
                if (err) {
                    res.redirect('/');
                }   
                
                // get device type of specified type
                db.query(qDeviceType, [req.query.type], (err, rDeviceType) => {
                    // if error occurs, nothing we can do, redirect to home
                    if (err) {
                        res.redirect('/');
                    }   

                    // render device template with the data obtained from the queries above
                    res.render('device.html', {
                        deviceType: rDeviceType[0],
                        deviceTypes: rDeviceTypes,
                        locations: rLocations,
                        mode: utilities.MODE_ADD
                    });

                });
            });
        });
    });

    /*
     * POST handler for the add device route
     * description:
     *  this route validates the user input and executes the add device operation
     * input:
     *  all relevant fields of the new device are contained in the POST body
     * output:
     *  a result page is output depending on the result of adding the new device OR
     *  redisplay the add device form with error prompts if validation fails
     */
    app.post('/devices/add', function(req, res) {
        // get SQL queries from utilties
        const qDeviceType = utilities.Q_DEVICE_TYPE;
        const qDeviceTypes = utilities.Q_DEVICE_TYPES;
        const qLocations = utilities.Q_LOCATIONS;

        // extract device from POST body
        var device = utilities.extractDevice(req.body);

        // create the insert QUERY along with the arguments
        var q = utilities.createDeviceInsert(device, req.body);

        // get list of device types
        db.query(qDeviceTypes, (err, rDeviceTypes) => {
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }

            // get list of locations
            db.query(qLocations, (err, rLocations) => {
                // if error occurs, nothing we can do, redirect to home
                if (err) {
                    res.redirect('/');
                }

                // get device type relevant to the device being currently added
                db.query(qDeviceType, [device.type], (err, rDeviceType) => {
                    // if error occurs, nothing we can do, redirect to home
                    if (err) {
                        res.redirect('/');
                    }
                    
                    // validate user input and redisplay form if errors are found
                    var errors = utilities.validateDevice(device, rDeviceType[0]);
                    if (errors.length > 0) {
                        res.render('device.html', {
                            errors: errors,
                            mode: utilities.MODE_ADD,
                            dType: rDeviceType[0].id,
                            deviceTypes: rDeviceTypes,
                            locations: rLocations,
                        });
                        return;
                    }
                    
                    // perform actual insertion
                    db.query(q.query, q.args, (err, result) => {
                        // if errors occured, reflect in result page
                        if (err) {
                            res.render('result.html', {
                                status: 400,
                                message: 'The device was not successfully added to the MySmartHome system.'
                            });
                            return;
                        }

                        // insertion succeeded, reflect in result page
                        res.render('result.html', {
                            status: 200,
                            message: 'The device was successfully added to the MySmartHome system.'
                        });
                    });
                });
            });
        });      
    });
    
    /*
     * GET handler for the device list route
     * description:
     *  this route obtain all the currently existing devices in the system and display them as a list
     * input:
     *  none
     * output:
     *  a list of all devices existing in the system
     */
    app.get('/devices', function(req, res) {
        // get SQL query from utilities
        const qDevices = utilities.Q_DEVICES;

        // get list of all devices
        db.query(qDevices, (err, rDevices) => {
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }

            // successfully retrieved all devices, display using template
            res.render('devices.html', {
                devices: rDevices
            });
        })
    });
    
    /*
     * GET handler for the show device route
     * description:
     *  this route displays information regarding a specified device
     * input:
     *  id - the id of the device to display information on
     * output:
     *  a tabulated view of details of the specified device along with buttons to update or delete the device
     */
    app.get('/devices/:id', function(req, res) {
        // get SQL query from utilities
        const qDevice = utilities.Q_DEVICE;
        const qDeviceType = utilities.Q_DEVICE_TYPE;

        // get device id from request
        const devId = parseInt(req.params.id);

        // get device with specified id
        db.query(qDevice, [devId], (err, rDevice) => {
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }
            // selected device cannot be found, inform user
            if (rDevice.length == 0) {
                res.render('result.html', {
                    status: 400,
                    message: 'Device with device id ' + devId + ' cannot be found in the system.'
                });
                return;
            }
            
            // get device type of specified device
            db.query(qDeviceType, [rDevice[0].deviceType], (err, rDeviceType) => {
                // if error occurs, nothing we can do, redirect to home
                if (err) {
                    res.redirect('/');
                }
                // retrieval successful, display int tabulated format
                res.render('device.html', {
                    mode: utilities.MODE_SHOW,
                    deviceType: rDeviceType[0],
                    device: rDevice[0]
                });
            });
        });
    });

    /*
     * GET handler for the update device route
     * description:
     *  this displays a form for updating a device
     * input:
     *  id - the id of the device to update
     * output:
     *  a form customized for the selected device
     */
    app.get('/devices/:id/update', function(req, res) {        
        // get SQL queries from utilities
        const qDeviceType = utilities.Q_DEVICE_TYPE;
        const qLocations = utilities.Q_LOCATIONS;
        const qDevice = utilities.Q_DEVICE;

        // get device id from request
        const devId = parseInt(req.params.id);

        // get device with specified id
        db.query(qDevice, [devId], (err, rDevice) => {
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }
            // selected device cannot be found, inform user
            if (rDevice.length == 0) {
                res.render('result.html', {
                    status: 400,
                    message: 'Device with device id ' + devId + ' cannot be found in the system.'
                });
                return;
            }

            // get device type relevant to specified device
            db.query(qDeviceType, [rDevice[0].deviceType] , (err, rDeviceType) => {
                // if error occurs, nothing we can do, redirect to home
                if (err) {
                    res.redirect('/');
                }

                // get list of all locations
                db.query(qLocations, (err, rLocations) => {
                    // if error occurs, nothing we can do, redirect to home
                    if (err) {
                        res.redirect('/');
                    }

                    // render the device template in update mode
                    res.render('device.html', {
                        deviceType: rDeviceType[0],
                        locations: rLocations,
                        device: rDevice[0],
                        mode: utilities.MODE_UPDATE
                    });
                });
            });
        });        
    });

    /*
     * POST handler for the update device route
     * description:
     *  this handler performs validation of the user input and perform the actual device update
     * input:
     *  all device fields (updated) are passed within the POST body
     * output:
     *  result page showing execution result of the update OR
     *  redisplay the update form with error prompts should validation fail
     */
    app.post('/devices/update', function(req, res) {     
        // get SQL queries from utilities
        const qLocations = utilities.Q_LOCATIONS;
        const qDeviceType = utilities.Q_DEVICE_TYPE;

        // extract device details from POST body
        let device = utilities.extractDevice(req.body);

        // construct update query
        let q = utilities.createDeviceUpdate(device, req.body);

        // get list of all locations
        db.query(qLocations, (err, rLocations) => {
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }

            // get device type relevant to specified device
            db.query(qDeviceType, [device.type], (err, rDeviceType) => {
                // if error occurs, nothing we can do, redirect to home
                if (err) {
                    res.redirect('/');                    
                }

                // validate user input and redisplay form if errors are found
                var errors = utilities.validateDevice(device, rDeviceType[0]);
                if (errors.length > 0) {
                    res.render('device.html', {
                        errors: errors,
                        deviceType: rDeviceType[0],
                        locations: rLocations,
                        device: device,
                        mode: 1
                    });
                    return;
                }

                // perform actual update query
                db.query(q.query, q.args, (err, result) => {
                    // if errors occur, reflect in result page
                    if (err) {
                        res.render('result.html', {
                            status: 400,
                            message: 'The device was not successfully updated within the MySmartHome system.'
                        });
                        return;
                    }

                    // update succeeced, show in result page
                    res.render('result.html', {
                        status: 200,
                        message: 'The device was successfully updated within the MySmartHome system.'
                    });
                });
            });
        });
        
    });
    
    /*
     * GET handler for the delete device route
     * description:
     *  this displays tabulated details and ask for user confirmation to delete device
     * input:
     *  id - id of device to delete
     * output:
     *  tabulated details of specified device and options to proceed or cancel the delete operation
     */
    app.get('/devices/:id/delete', function(req, res) {
        // get SQL queries from utilities
        const qDevice = utilities.Q_DEVICE;
        const qDeviceType = utilities.Q_DEVICE_TYPE;

        // get device id from request
        const devId = parseInt(req.params.id);

        // get device with specified id
        db.query(qDevice, [devId], (err, rDevice) => { 
            // if error occurs, nothing we can do, redirect to home
            if (err) {
                res.redirect('/');
            }
            // selected device cannot be found, inform user
            if (rDevice.length == 0) {
                res.render('result.html', {
                    status: 400,
                    message: 'Device with device id ' + devId + ' cannot be found in the system.'
                });
                return;
            }

            // get device type of specified device
            db.query(qDeviceType, [rDevice[0].deviceType], (err, rDeviceType) => {
                // if error occurs, nothing we can do, redirect to home               
                if (err) {
                    res.redirect('/');
                }
            
                // retrieval success, render device template in delete mode
                res.render('device.html', {
                    device: rDevice[0],
                    deviceType: rDeviceType[0],
                    mode: utilities.MODE_DELETE
                });
            });
        });
    });

    /*
     * POST handler for the delete device route
     * description:
     *  this performs the actual delete operation and display the execution result of the delete operation
     * input:
     *  id of device to delete is contained in the POST body
     * output:
     *  a result page showing if delete was successful
     */
    app.post('/devices/delete', function(req, res) {
        // get SQL query from utilities
        const qDeviceDelete = utilities.Q_DEVICE_DELETE;

        // get device id from POST body
        var devId = parseInt(req.body.id);

        // perform actual delete operation
        db.query(qDeviceDelete, [devId], (err, result) => {
            // if delete failed, reflect in result
            if (err) {
                res.render('result.html', {
                    status: 400,
                    message: 'The device was not successful deleted.'
                });
                return;
            }

            // delete succeeded, show in result
            res.render('result.html', {
                status: 200,
                message: 'The device was successfully deleted.'
            });
        });
    });
}