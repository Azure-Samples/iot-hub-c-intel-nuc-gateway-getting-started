# Compile and run Azure gateway SDK module and sample application
This sample accompanies [Compile and run Azure gateway SDK module and sample application](#) lesson. You will use scripts to compile the Azure gateway SDK's module and sample application yourself.

## Prerequisites
See the associate lesson.

## Repository information

```txt
.
|- module\                    
|    |- my_module\               // Azure gateway SDK hello_world module source code and build script
|        |- inc\
|        |   |- my_module.h
|        |- src\                
|        |   |- my_module.c
|        |- build.sh
|- sample\                       // Azure gateway SDK hello_world sample application source code and build script
|    |- hello_world\
|        |- src\                    
|        |   |- hello_world.json
|        |   |- main.c
|        |- build.sh
|- config.json
|- gulpfile.js
```

## Compile and run hello_world sample

These steps will guide you through compilation of Azure gateway SDK's hello_world sample application on your Intel NUC. This sample application creates a gateway from hello_world.json file which includes two modules. The gateway logs "hello world" message every 5 seconds.

Please follow the [Compile and run Azure gateway SDK module and sample application](#) for detailed walkthough of the steps below.

1. **`npm install`** - Install the npm packages

2. **`gulp init`** - Intialize configuration files in user's profile folder `%USERPROFILE%\.iot-hub-getting-started`

   * `config-gateway.json`: Configuration for connecting to gateway via SSH.
   * `config-sensortag.json`: Configuration for the sensor connected to gateway. The file will be sent to your Intel NUC.
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

## Write and compile your own module and compile it on Intel NUC
These steps will guide you write your own gateway module and compile it. Your own module can print out the message when receiving it. Please follow the [Compile and run Azure gateway SDK module and sample application](#) for detailed walkthough of the steps below.

The `module/my_module` folder contains an Azure IoT gateway SDK module's code template. A module must implement the following interfaces:

```c
MODULE_API base;
pfModule_ParseConfigurationFromJson Module_ParseConfigurationFromJson;
pfModule_FreeConfiguration Module_FreeConfiguration;
pfModule_Create Module_Create;
pfModule_Destroy Module_Destroy;
pfModule_Receive Module_Receive;
pfModule_Start Module_Start;
```

1. Open the code template folder by running the following command:

   ```bash
   code module/my_module
   ```
   
2. Include the following two header files
   ```c
   #include <stdio.h>
   #include "azure_c_shared_utility/xlogging.h"
   ```
   
   Fill the `MyModule_Receive` function with the following piece of code:

   ```c
   if (message == NULL)
   {
       LogError("invalid arg message");
   }
   else
   {
       // get the message content
       const CONSTBUFFER * content = Message_GetContent(message);
       // get the local time and format it
       time_t temp = time(NULL);
       if (temp == (time_t)-1)
       {
           LogError("time function failed");
       }
       else
       {
           struct tm* t = localtime(&temp);
           if (t == NULL)
           {
               LogError("localtime failed");
           }
           else
           {
               char timetemp[80] = { 0 };
               if (strftime(timetemp, sizeof(timetemp) / sizeof(timetemp[0]), "%c", t) == 0)
               {
                   LogError("unable to strftime");
               }
               else
               {
                   printf("[%s] %.*s\r\n", timetemp, (int)content->size, content->buffer);
               }
           }
       }
   }
   ```


3. Modify the `config.json` as the following sample configuration. This configuration specific `workspace` folder in your host machine should be transfered to your Intel NUC's `~/<deploy_path>` when compiling.

   ``` json
   "workspace": "./module/my_module",
   "deploy_path": "module/my_module",
   ```

4. **`gulp compile`** - Ship the module source code to your Intel NUC and run build.sh to compile it.


## Run hello_world sample with your own module

1. **`gulp modules --list`** - List all avaliable Azure gateway SDK module binary on your Intel NUC. You should find the binary you compiled in step2 is in `/root/gateway_sample/module/my_module/build/libmy_module.so` if you haven't change the login username in `config-gateway.json`.

   > `gulp modules --list` will find all .so file on your Intel NUC under specific folders (we call them feeds), you can use the following command to configure the feeds:
   >
   > * `gulp modules --add-feed <path>` - Add a folder's absolute path to the feeds
   > * `gulp modules --feeds` - Show all specific folders on your Intel NUC, --list will list modules under these folders
   > * `gulp modules --list` - List all modules under specific folder on your Intel NUC
   > * `gulp modules --rm-feed <path>` - Remove a folder path from the feeds

2. Use the following command to modify the `hello_world` sample application's json file.

   ``` bash
   code sample/hello_world/src/hello_world.json
   ```

   Add the following item into `modules`, the `module.path` should be `/root/gateway_sample/module/my_module/build/libmy_module.so`, if you didn't change your username and password in `config-gateway.json`.
   This item declare a new module for the gateway which has a unique name `my_module`, and the binary for the module is specific in the `module.path`.
   ```json
   {
     "name": "my_module",
     "loader": {
       "name": "native",
       "entrypoint": {
         "module.path": "/root/gateway_sample/module/my_module/build/libmy_module.so"
       }
     },
     "args": null
   }
   ```

   Add the following item into `links`, this will transfer message send from `hello_world` to `my_module`
   ```json
   {
      "source": "hello_world",
      "sink": "my_module"
    }
   ```
   
   Make sure your `hello_world.json` still be a valid json file and then save it.

3. **`gulp run --config sample/hello_world/src/hello_world.json`** - run the hello_world sample application, the `--config` parameter force the `run-hello-world.js` script run with json file you provided.
