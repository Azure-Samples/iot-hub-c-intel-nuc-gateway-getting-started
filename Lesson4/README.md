# Save messages to the cloud and read them from the cloud
This sample repo accompanies [Lesson 4: Save messages to the cloud and read them from the cloud](#) lesson. It demonstrates how to use an Azure function app to receive incoming IoT hub messages and persist them to Azure table storage.

## Prerequisites
See [Lesson 4: Save messages to the cloud and read them from the cloud](#) for more information.

## Repository information
``` txt
.
|- ReceiveDeviceMessages/     // Azure Functions sample code
|- arm-template.json          // Azure Resource Manager template that contains an Azure Functions and a storage account
|- arm-template-param.json    // Configuration file used by the Azure Resource Manager template
|- azure-table.js             // Nodejs sample code read from Azure Table storage
```

## Running this sample
Please follow the [Lesson 4: Save messages to the cloud and read them from the cloud](#) for detailed walkthough of the steps below.

### Deploy and run
1. **`npm install`** - Install the npm packages
2. **`gulp init`** - Intialize config files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`
    - `config-gateway.json`: Configuration for connecting to gateway via SSH.
    - `config-sensortag.json`: Configuration for the SensorTag and BLE sample application in the Gateway SDK.
    - `config-azure.json`: Configuration for your Azure IoT hub and Azure Table storage connection.
3. **`gulp run`** - Copy config file to the gateway machine and run the BLE sample application in the Gateway SDK.
4. *Start another console to do the following step to read message from azure function.*
   Use az to get IoT hub connection string, device connection string and azure storage connection string.  And then modify the config file.
   ``` bash
   # Get azure storage connection string
   az storage account list -g {resource group name} --query [].name
   az storage account show-connection-string -g {resource group name} -n {storage name}

   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-azure.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-azure.json
   ```
5. **`gulp read --iot-hub`** - read messages from your IoT hub
   **`gulp read --table-storage`** - read messages from your Azure Table storage
