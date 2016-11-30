# Save messages to the cloud and read them from the cloud
This sample repo accompanies [Lesson 4: Save messages to the cloud and read them from the cloud](#) lesson. It demonstrates how to use Azure function app to receive incoming IoT hub messages and persist them to Azure table storage.

## Prerequisites
See [Lesson 4: Save messages to the cloud and read them from the cloud](#) for more information.

## Repository information
``` txt
.
|- ..
|  |- .deployment             // Let Azure Function application specific the deploy script
|  |- deploy.cmd              // Azure Function application deploy script
|- ReceiveDeviceMessages/     // Azure Function sample code
|- arm-template.json          // Azure Resource Manager template that has definitation of Azure Function app and storage account
|- arm-template-param.json    // Configuration file used by the Azure Resource Manager template
|- azure-table.js             // Sample code for reading from Azure Table storage
```

## Running this sample
Please follow the [Lesson 4: Save messages to the cloud and read them from the cloud](#) for detailed walkthough of the steps below.

### Deploy and run
1. **`npm install`** - Install the npm packages
2. **`gulp init`** - Intialize config files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`
    - `config-gateway.json`: Configuration for connecting to gateway via SSH.
    - `config-sensortag.json`: Configuration for the SensorTag and BLE sample application in the Gateway SDK.
    - `config-azure.json`: Configuration for your Azure IoT Hub and Azure Table storage account.
3. Use az to get IoT Hub connection string, device connection string and azure storage connection string and edit IoT Hub connection string and device connection string in config-azure.json.
   ``` bash
   # Get azure storage connection string
   az storage account list -g {resource group name} --query [].name
   az storage account show-connection-string -g {resource group name} -n {storage name}

   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-azure.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-azure.json
   ```
4. **`gulp run`** - Configure and run the BLE sample application. This application will exit in 40 seconds.
   **`gulp run --iot-hub`** - Run the BLE sample application and read IoT Hub messages that have just been sent from SensorTag.
   **`gulp read --table-storage`** - Run the BLE sample application and read IoT Hub messages that have been persisted in Azure Table storage.