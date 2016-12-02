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

### Deploy and run BLE sample

> If you don't have a physical SensorTag device, please jump to [Deploy and run simulate device cloud upload sample](#run-simudev)

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
  - Copy files in the `/Tools` folder to your gateway
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
8. **`gulp run`** - Configure and run the BLE sample application. This application will exit in 40 seconds.
9. Use az to get IoT Hub connection string, device connection string and azure storage connection string and edit IoT Hub connection string and device connection string in config-azure.json.
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
10. **`gulp run --iot-hub`** - Run the BLE sample application and read IoT Hub messages that have just been sent from SensorTag.

## <a id="run-simudev"></a>Deploy and run simulate device cloud upload sample
1. Use the following command to modify your configuration, change the `"has_sensortag"` value from `true` to `false`.
   ```bash
   code ../config.json
   ```
2. **`npm install`** - Install the npm packages
3. > *If you have run the script with `has_sensortag: true` flag before, you can run `gulp clean` to clean your personal config, this command will clean your edited config files in your profile folder created by `gulp init`, and tools installed on NUC by `gulp install-tools` command*

  **`gulp init`** - Intialize configuration files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`
    - `config-gateway.json`: Configuration for connecting to gateway via SSH.
    - `config-sensortag.json`: Configuration for simulate device cloud upload sample application in the Gateway SDK.
    - `config-azure.json`: Configuration for your Azure IoT Hub and Azure Table storage account.
4. Use the following command to modify your gateway configuration files, fill in the gateway's mac address
   ``` bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-gateway.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-gateway.json
   ```
5. **`gulp install-tools`** - Install necessary tools on the gateway.
  - Copy files in the `/Tools` folder to your gateway
6. Get the registered IoT Hub device connection string and edit IoT Hub name, device connection string in config-sensortag.json.
   ``` bash
   # Get IoT hub device connection string
   az iot device show-connection-string --hub {my hub name} --device-id {device id} --resource-group {resource group name}

   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-sensortag.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-sensortag.json
   ```
7. **`gulp run`** - Configure and run the simulate device cloud upload sample application. This application will exit in 40 seconds.
8. Use az to get IoT Hub connection string, device connection string and azure storage connection string and edit IoT Hub connection string and device connection string in config-azure.json.
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
9. **`gulp run --iot-hub`** - Run the simulate device cloud upload sample application and read IoT Hub messages that have just been sent from the simulate device cloud upload sample application.
