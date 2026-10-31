#include <napi.h>

Napi::String GetVersion(const Napi::CallbackInfo& info) {
    return Napi::String::New(
        info.Env(),
        "t-parking-native-1.0.0"
    );
}

Napi::Number AddNumbers(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() != 2 ||
        !info[0].IsNumber() ||
        !info[1].IsNumber()) {
        Napi::TypeError::New(
            env,
            "Expected two numbers"
        ).ThrowAsJavaScriptException();

        return Napi::Number::New(env, 0);
    }

    const double a = info[0].As<Napi::Number>().DoubleValue();
    const double b = info[1].As<Napi::Number>().DoubleValue();

    return Napi::Number::New(env, a + b);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        "getVersion",
        Napi::Function::New(env, GetVersion)
    );

    exports.Set(
        "addNumbers",
        Napi::Function::New(env, AddNumbers)
    );

    return exports;
}

NODE_API_MODULE(parking_addon, Init)