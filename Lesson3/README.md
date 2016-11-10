# Configure and run the BLE sample application to receive data from BLE SensorTag
This sample repo accompanies [Lesson 3: Configure and run the BLE sample application to receive data from BLE SensorTag](#) lesson. You will use scripts to automate the configuration and execution of the BLE sample application on your gateway device. The scripts will also read device-to-cloud messages from IoT Hub and Azure table storage.

## Prerequisites
See [Lesson 3: Configure and run the BLE sample application to receive data from BLE SensorTag](#) for more information.

## Repository information
``` txt
.
|- iot-hub.js                 // Sample script for reading messages from IoT Hub
|- ble-message-printer.js     // Sample script for automation of BLE sample application's data decoder and printer
```

## Running this sample
Please follow the [Lesson 3: Configure and run the BLE sample application to receive data from BLE SensorTag](#) for detailed walkthough of the steps below.

### Deploy and run
1. **`npm install`** - Install the npm packages
2. **`gulp init`** - Intialize configuration files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`
    - `config-gateway.json`: Configuration for connecting to gateway via SSH.
    - `config-sensortag.json`: Configuration for the SensorTag and BLE sample application in the Gateway SDK.
    - `config-azure.json`: Configuration for your Azure IoT Hub and Azure Table storage account.
3. Use the following command to modify your gateway configuration files, fill in the gateway's mac address
   ``` bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-gateway.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-gateway.json
   ```
4. **`gulp install-tools`** - Install necessary tools on the gateway.
  - Copy files in the `/app` folder on the gateway
5. **`gulp discover-sensortag`** - Device discovery for TI SensorTag. Run after "install-tools".
6. **`gulp test-connectivity --mac <mac>`** - Test connectivity of the SensorTag. Run after "install-tools" and "discover-sensortag".
7. Get the registered IoT Hub device connection string and edit IoT Hub name, device connection string and SensorTag mac address in config-sensortag.json.
   ``` bash
   # Get IoT hub device connection string
   az iot device show-connection-string --hub {my hub name} --device-id {device id} --resource-group {resource group name}

   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-sensortag.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-sensortag.json
   ```
8. **`gulp run`** - Configure and run the BLE sample application.
9. *Start another console to do the following steps to read message from IoT Hub.*
   Use az to get IoT Hub connection string, device connection string and azure storage connection string and edit IoT Hub connection string and device connection string in config-azure.json.
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
10. **`gulp read --iot-hub`** - this reads IoT Hub messages that have just been sent from SensorTag.
