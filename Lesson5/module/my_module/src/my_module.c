/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */

#include <stdio.h>
#include "module.h"
#include "azure_c_shared_utility/xlogging.h"

void* MyModule_ParseConfigurationFromJson(const char* configuration)
{
    // Not implemented
    return NULL;
}

void MyModule_FreeConfiguration(void * configuration)
{
    // Not implemented
}

MODULE_HANDLE MyModule_Create(BROKER_HANDLE broker, const void* configuration)
{
    return (MODULE_HANDLE)0x42;
}

void MyModule_Destroy(MODULE_HANDLE module)
{
    // Not implemented
}

void MyModule_Receive(MODULE_HANDLE module, MESSAGE_HANDLE message)
{
    // Not implemented
}

static const MODULE_API_1 Module_GetApi_Impl =
{
    {MODULE_API_VERSION_1},

    MyModule_ParseConfigurationFromJson,
    MyModule_FreeConfiguration,
    MyModule_Create,
    MyModule_Destroy,
    MyModule_Receive

};

MODULE_EXPORT const MODULE_API* Module_GetApi(MODULE_API_VERSION gateway_api_version)
{
    (void)gateway_api_version;
    return (const MODULE_API*)&Module_GetApi_Impl;
}
