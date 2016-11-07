# Configure and run a BLE sample application to receive data from a BLE SensorTag
This sample repo accompanies [Lesson 3: Configure and run a BLE sample application to receive data from a BLE SensorTag](#) lesson. You will use scripts to automate the configuration and execution of a BLE sample application in your gateway. And receive incoming IoT hub messages.

## Prerequisites
See [Lesson 3: Configure and run a BLE sample application to receive data from a BLE SensorTag](#) for more information.

## Repository information
``` txt
.
|- iot-hub.js                 // Nodejs sample code read from an IoT hub
|- ble-message-printer.js     // BLE sample application's data decoder and printer
```

## Running this sample
Please follow the [Lesson 3: Configure and run a BLE sample application to receive data from a BLE SensorTag](#) for detailed walkthough of the steps below.

### Deploy and run
1. **`npm install`** - Install the npm packages
2. **`gulp init`** - Intialize config files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`
    - `config-gateway.json`: Configuration for connecting to gateway via SSH.
    - `config-sensortag.json`: Configuration for the SensorTag and BLE sample application in the Gateway SDK.
    - `config-azure.json`: Configuration for your Azure IoT hub and Azure Table storage connection.
3. Use the following command to modify your gateway config, fill in the gateway's mac address
   ``` bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-gateway.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-gateway.json
   ```
4. **`gulp install-tools`** - Install necessary tools on the gateway.
  - Copy files in the `/app` to gateway machine
5. **`gulp discover-sensortag`** - Discover TI SensorTag. Run after "install-tools".
6. **`gulp test-connectivity --mac <mac>`** - Test connectivity of the SensorTag. Run after "install-tools".
7. Use az to get device connection string. And then edit the config with IoT hub name, device connection string and mac address.
   ``` bash
   # Get IoT hub device connection string
   az iot device show-connection-string --hub {my hub name} --device-id {device id} --resource-group {resource group name}

   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-sensortag.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-sensortag.json
   ```
8. **`gulp run`** - Copy config file to the gateway machine and run the BLE sample application in the Gateway SDK.
9. *Start another console to do the following step to read message from azure function.*
   Use az to get IoT hub connection string, device connection string and azure storage connection string.  And then modify the config file.
   ``` bash
   # Get IoT hub connection string
   az iot hub show-connection-string --name {my hub name} --resource-group {resource group name}

   # Get IoT hub device connection string
   az iot device show-connection-string --hub {my hub name} --device-id {device id} --resource-group {resource group name}

   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-azure.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-azure.json
   ```
10. **`gulp read --iot-hub`** - read messages from your IoT hub
