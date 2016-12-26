# Compile and run Azure gateway SDK module and sample application
This sample accompanies [Compile and run Azure gateway SDK module and sample application](#) lesson. You will use scripts to compile the Azure gateway SDK's module and sample application yourself.

## Prerequisites
See associate lesson for more information.

## Repository information

```txt
.
|- module\                    
|    |- hello_world\           
|        |- src\                 // Azure gateway SDK hello_world module source code
|        |   |- hello_world.c
|        |   |- hello_world.h
|        |- build.sh             // build script for hello_world module
|- sample\
|    |- hello_world\
|        |- src\                    // Azure gateway SDK hello_world sample application source code
|        |   |- hello_world.json
|        |   |- main.c
|        |- build.sh                // build script for hello_world sample application
|- config.json
|- gulpfile.js
```

## Compile and run hello_world sample

These steps will guide you compile the Azure gateway SDK's hello_world sample application on your Intel NUC. This sample application creates a gateway from hello_world.json file and use two modules in Azure IoT gateway SDK to log a "hello world" message to a file every 5 seconds.

Please follow the [Compile and run Azure gateway SDK module and sample application](#) for detailed walkthough of the steps below.

1. **`npm install`** - Install the npm packages

2. **`gulp init`** - Intialize configuration files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`

   * `config-gateway.json`: Configuration for connecting to gateway via SSH.
   * `config-sensortag.json`: Configuration for the sensor will be connected to gateway, which will be send to your Intel NUC.
   * `config-azure.json`: Configuration for your Azure IoT Hub and Azure Table storage account.

3. Use the following command to modify your gateway configuration files, fill in the gateway's mac address

   ``` bash
   # For Windows command prompt
   code %USERPROFILE%\.iot-hub-getting-started\config-gateway.json

   # For MacOS or Ubuntu
   code ~/.iot-hub-getting-started/config-gateway.json
   ```

4. **`gulp compile`** - Ship the sample source code to your Intel NUC and run build.sh to compile it.

5. **`gulp run`** - Run [`../Tools/run-hello-world.js`](../Tools/run-hello-world.js) which is configured in [`config.json`](config.json) to start the hello_world sample application on your Intel NUC. 

## Compile the hello_world module and run hello_world sample to use the new module

These steps will guide you compile the Azure gateway SDK's hello_world module on your Intel NUC. The module's source code is in the `module/hello_world/` folder. In the `hello_world.c`, it add a line `printf("%d: %s\n", ++count, HELLOWORLD_MESSAGE);` to print the message before send it out.

Please follow the [Compile and run Azure gateway SDK module and sample application](#) for detailed walkthough of the steps below.

1. Modify the `config.json` as follow sample. This configuration specific `workspace` folder in your host machine should be transfered to your Intel NUC's `~/<deploy_path>` when compiling.

   ``` json
   "workspace": "./module/hello_world",
   "deploy_path": "module/hello_world",
   ```

2. **`gulp compile`** - Ship the module source code to your Intel NUC and run build.sh to compile it.

3. **`gulp modules --list`** - List all avaliable Azure gateway SDK module binary on your Intel NUC. You should find the binary you compiled in step 2 is in `/root/gateway_sample/module/hello_world/build/libhello_world.so` if you haven't change the login username in `config-gateway.json`.

   > `gulp modules --list` will find all .so file on your Intel NUC under specific folders (we call them feeds), you can use the following command to configure the feeds:
   `gulp modules --add-feed <path>` - Add a folder's absolute path to the feeds
   `gulp modules --feeds` - Show all specific folders on your Intel NUC, --list will list modules under these folders
   `gulp modules --list` - List all modules under specific folder on your Intel NUC
   `gulp modules --rm-feed <path>` - Remove a folder path from the feeds

4. Use the following command to modify the `hello_world` sample application's json file. Replace the `hello_world` module's `module.path` value to the path you obstain in step3.

   ``` bash
   # For Windows command prompt
   code sample\hello_world\src\hello_world.json

   # For MacOS or Ubuntu
   code sample/hello_world/src/hello_world.json
   ```

5. **`gulp run --config sample/hello_world/src/hello_world.json`** - run the hello_world sample application, the `--config` parameter force the `run-hello-world.js` script run with json file you provided.