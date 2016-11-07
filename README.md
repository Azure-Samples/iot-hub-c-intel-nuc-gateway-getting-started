# iot hub c intel nuc gateway getting started
This repo contains the source code to help you run the azure-iot-gateway-sdk BLE sample on Intel NUC with SensorTag. And you can also create an azure function to receive message which is sent from BLE sample.

<!--
Should put publish link here
-->

## Using these scripts, you can:
* Discovery the availiable sensortag devices
* Test the connectivity of sensortag device
* Run BLE sample on the NUC
* Receive messages from your IoT hub
* Receive messages from your Azure Table storage

## File hierarchy
``` txt
.
|- Tools/                        // Tools run on your Gateway machine
|- Lesson3/
|  |- iot-hub.js                 // Nodejs sample code read from an IoT hub
|  |- ble-message-printer.js     // Printer for BLE sample application's raw data
|- Lesson4/
|  |- ReceiveDeviceMessages/     // Azure Functions sample code
|  |- arm-template.json          // Azure Resource Manager template that contains an Azure Functions and a storage account
|  |- arm-template-param.json    // Configuration file used by the Azure Resource Manager template
|  |- azure-table.js             // Nodejs sample code read from Azure Table storage
```

## Starter Kit
**Don't have a kit yet?:** Click [here](http://azure.com/iotstarterkits)
