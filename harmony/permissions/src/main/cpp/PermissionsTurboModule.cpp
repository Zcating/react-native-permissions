/*
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
#include "PermissionsTurboModule.h"
#include "RNOH/ArkTSTurboModule.h"

using namespace rnoh;
using namespace facebook;

static jsi::Value hostFunction_RTNPermissionsTurboModule_check(jsi::Runtime &rt, react::TurboModule &turboModule,
    const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "check", args, count);
}
static jsi::Value hostFunction_RTNPermissionsTurboModule_checkMultiple(jsi::Runtime &rt,
    react::TurboModule &turboModule, const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "checkMultiple", args, count);
}
static jsi::Value hostFunction_RTNPermissionsTurboModule_request(jsi::Runtime &rt, react::TurboModule &turboModule,
    const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "request", args, count);
}

static jsi::Value hostFunction_RTNPermissionsTurboModule_requestMultiple(jsi::Runtime &rt,
    react::TurboModule &turboModule, const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "requestMultiple", args, count);
}

static jsi::Value hostFunction_RTNPermissionsTurboModule_requestNotifications(jsi::Runtime &rt,
    react::TurboModule &turboModule, const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "requestNotifications", args, count);
}
static jsi::Value hostFunction_RTNPermissionsTurboModule_checkNotifications(jsi::Runtime &rt,
    react::TurboModule &turboModule, const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "checkNotifications", args, count);
}
static jsi::Value hostFunction_RTNPermissionsTurboModule_openSettings(jsi::Runtime &rt,
    react::TurboModule &turboModule, const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openSettings", args, count);
}
static jsi::Value hostFunction_RTNPermissionsTurboModule_openPhotoPicker(jsi::Runtime &rt,
    react::TurboModule &turboModule, const jsi::Value *args, size_t count)
{
    return static_cast<ArkTSTurboModule &>(turboModule).callAsync(rt, "openPhotoPicker", args, count);
}

RTNPermissionsTurboModule::RTNPermissionsTurboModule(const ArkTSTurboModule::Context ctx, const std::string name)
    : ArkTSTurboModule(ctx, name)
{
    methodMap_["check"] = MethodMetadata{1, hostFunction_RTNPermissionsTurboModule_check};
    methodMap_["checkMultiple"] = MethodMetadata{1, hostFunction_RTNPermissionsTurboModule_checkMultiple};
    methodMap_["request"] = MethodMetadata{1, hostFunction_RTNPermissionsTurboModule_request};
    methodMap_["requestMultiple"] = MethodMetadata{1, hostFunction_RTNPermissionsTurboModule_requestMultiple};
    methodMap_["requestNotifications"] = MethodMetadata{0, hostFunction_RTNPermissionsTurboModule_requestNotifications};
    methodMap_["checkNotifications"] = MethodMetadata{0, hostFunction_RTNPermissionsTurboModule_checkNotifications};
    methodMap_["openSettings"] = MethodMetadata{0, hostFunction_RTNPermissionsTurboModule_openSettings};
    methodMap_["openPhotoPicker"] = MethodMetadata{0, hostFunction_RTNPermissionsTurboModule_openPhotoPicker};
}