#!/bin/sh
build_root=$(cd "$(dirname "$0")" && pwd)
build_dir="$build_root"/build
output_name=hello_world

rm -rf "$build_dir"
mkdir -p "$build_dir"

# Check for Azure IoT Gateway SDK headers
if [ ! -f /usr/include/azureiot/gateway.h ]; then
    echo Gateway SDK headers not found. Please make sure that the azure-iot-gateway-sdk-dev package is installed.
    exit 1
fi

echo ---------- Building the Hello World Gateway SDK sample ----------
gcc src/main.c --std=c99 -I/usr/include/azureiot -L. -lgateway -laziotsharedutil -o "$build_dir"/"$output_name"
[ $? -eq 0 ] || exit $?

cp -n src/*.json $build_dir

echo Finished Successfully

echo Output can be found in "$build_dir"

sleep 1 # wait for everything finishing
