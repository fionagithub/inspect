let logBuff = [];
let logStickBuff = [];
// logger
function log(v, isStick) {
    v = new Date().toTimeString().substr(0, 9) + v;
    console.log(v);
    isStick ? logStickBuff.push(v) : logBuff.push(v);
    if (logBuff.length > 3) logBuff.shift();
    let html = logStickBuff.join('<br>') + "<br>" + logBuff.join('<br>');
    return html
    //  $app.innerHTML = logStickBuff.join('<br>') + "<br>" + logBuff.join('<br>');
}
function clearStickBuff() {
    logStickBuff.length = 0;
}
function upload(data) {
    fetch('https://ble.laputacloud.com/smarttag', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(console.log)
        .catch(err => log('上传失败'))
}
function bleScan() {
    log('========= BLE: Start scan =========')
    ble.startScan([],
        function (device) {
            if (/^SmartTag/.test(device.name)) {
                log('√ ' + device.name, true);
                let mdata = device.advertising && device.advertising.kCBAdvDataManufacturerData && new Uint8Array(device.advertising.kCBAdvDataManufacturerData);
                let _device = {
                    phoneId: window.device.uuid,
                    name: device.name,
                    data: mdata.join(','),
                    rssi: device.rssi,
                    time: new Date()
                }
                // bleDevices[device.id] = _device;
                upload(_device);
            } else {
                log(device.name + ':' + device.id)
            }

        },
        function (reason) {
            console.log("startScan failed", reason);
        })
}

setTimeout(function () {
    ble.stopScan(
        function () {
            log("======= BLE: Scan complete =======");
            clearStickBuff();
        },
        function () {
            log("====== BLE: Stop scan failed ======");
        }
    );
    setTimeout(bleScan, 30000)
}, 10000)
function initialBLE() {
    bleScan();
    log("----------initialBLE------------")
    window.open = cordova.InAppBrowser.open
}
export default initialBLE
