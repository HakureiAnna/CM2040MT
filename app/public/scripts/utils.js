/*
 utility function to force a reload of the add device route
 this is done due to the limitation of the EJS templating system
 since such a reload, by modern standards, is usually performed using
 a mechanism such as AJAX to just reload part of the page as part of a SPA application
 but EJS templating happens on the server side and thus a reload of ther page to force
 a refetch of relevant information is necessary
 */
function handleDeviceChange(deviceType) {
    location.href = '/devices/add?type=' + deviceType;
}

/*
 * utility function to provide update label display of the slider value
 */
function updateDisplay(dspId, val) {
    const dsp = document.getElementById(dspId);
    dsp.innerText = val;
}