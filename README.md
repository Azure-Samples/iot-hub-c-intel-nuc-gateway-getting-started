# iot hub c intel nuc gateway getting started
This repo contains the sample codes to help you run the azure-iot-gateway-sdk BLE sample application on Intel NUC with TI SensorTag. There are also sample codes for reading messages directly from IoT Hub as well as Azure table storage where IoT Hub messages were persisted by Azure function.

<!--
Placeholder for published GW Happy Path Tutorial
-->

## The following scripts will help you:
* Device discovery of sensortag devices
* Test the connectivity of sensortag devices
* Run the BLE sample application on Intel NUC
* Receive messages from your IoT hub
* Receive messages from your Azure Table storage

## File hierarchy
``` txt
.
|- Tools/                        // These scripts will run on Intel NUC
|- Lesson3/
|  |- iot-hub.js                 // Sample script for reading messages from IoT Hub
|  |- ble-message-printer.js     // Sample script for automation of BLE sample application's data decoder and printer
|- Lesson4/
|  |- ReceiveDeviceMessages/     // Azure Function sample code
|  |- arm-template.json          // Azure Resource Manager template that has definitation of Azure Function app and storage account
|  |- arm-template-param.json    // Configuration file used by the Azure Resource Manager template
|  |- azure-table.js             // Sample code for reading from Azure Table storage
```

## Starter Kit
**Don't have a kit yet?:** Click [here](http://azure.com/iotstarterkits)
