---
services: iot-hub
platforms: c
author: xshi
---

# iot hub c intel nuc gateway getting started
This repo contains the sample codes to help you run the azure-iot-gateway-sdk BLE sample application on Intel NUC with TI SensorTag. There are also sample codes for reading messages directly from IoT Hub as well as Azure table storage where IoT Hub messages were persisted by Azure function.

* [Get started with IoT Gateway Starter Kit with a SensorTag](https://docs.microsoft.com/azure/iot-hub/iot-hub-gateway-kit-c-get-started)
* [Get started with IoT Gateway Starter Kit with a simulated device](https://docs.microsoft.com/azure/iot-hub/iot-hub-gateway-kit-c-sim-get-started)

## The following scripts will help you
* Device discovery for sensortag devices
* Test the connectivity of sensortag devices
* Run the BLE sample application on Intel NUC
* Receive messages from your IoT hub
* Receive messages from your Azure Table storage

## What you need
* Set up your Intel NUC as an IoT gateway (Lesson [Set up Intel NUC as an IoT gateway](https://docs.microsoft.com/azure/iot-hub/iot-hub-gateway-kit-c-lesson1-set-up-nuc))
* Install necessary tools on your host machine (Lesson [Get the tools](https://docs.microsoft.com/azure/iot-hub/iot-hub-gateway-kit-c-lesson2-get-the-tools-win32))
* Create your Azure IoT hub and register a logical device (Lesson [Create your Azure IoT hub and register SensorTag](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-gateway-kit-c-lesson2-register-device))

## File hierarchy
``` txt
.
|- Tools/                        // These scripts will run on Intel NUC
|  |- lib/                       // Libraries will be used by scripts on Intel NUC
|      |- ble-config.js          // Create ble_gateway sample config with user config
|      |- bluetoothctl.js        // Interact with bluetoothctl shell
|      |- gateway-config.js      // Base methods to create gateway sample config with user config
|      |- interactcli.js         // Base methods to Interact with shell process
|      |- simudev-config.js      // Create simulate_device_cloud_upload sample config with user config
|      |- test-connectivity.js   // Test a MAC address' connectivity
|      |- util.js                // Utilities
|  |- deploy.js                  // Create sample config
|  |- discover-sensortag.js      // Discover availiable sensortag
|  |- run-ble-sample.js          // Create ble_gateway config and run the sample for 40 seconds
|  |- run-hello-world.js         // Create hello_world config and run the sample for 40 seconds
|  |- run-simudev-sample.js      // Create simulate_device_cloud_upload config and run the sample for 40 seconds
|  |- test-connectivity.js       // Test a MAC address' connectivity and show user the result
|- Lesson3/                      // Lesson3: Send messages to and read messages from IoT hub
|- Lesson4/                      // Lesson4: Save messages to the Azure storage
|- Lesson5/                      // Lesson5: Write and compile your own gateway module
```

## Starter Kit
**Don't have a kit yet?:** Click [here](http://azure.com/iotstarterkits)
