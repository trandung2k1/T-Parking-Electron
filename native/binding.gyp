{
  "targets": [
    {
      "target_name": "parking_addon",
      "sources": [
        "src/parking_addon.cpp"
      ],
     "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
    ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "NAPI_CPP_EXCEPTIONS"
      ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "conditions": [
        [
          "OS=='win'",
          {
            "msvs_settings": {
              "VCCLCompilerTool": {
                "ExceptionHandling": 1,
                "AdditionalOptions": [
                  "/EHsc"
                ]
              }
            },
            "libraries": [
              "bcrypt.lib",
              "crypt32.lib",
              "winhttp.lib",
              "winsqlite3.lib",
              "winmm.lib",
              "gdiplus.lib",
              "ole32.lib"
            ]
          }
        ],
        [
          "OS=='linux'",
          {
            "cflags_cc": [
              "-fexceptions",
              "-std=c++17"
            ],
            "libraries": [
              "-lcrypto",
              "-lcurl",
              "-lsqlite3",
              "-ljpeg"
            ]
          }
        ],
        [
          "OS=='mac'",
          {
            "xcode_settings": {
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
              "CLANG_CXX_LIBRARY": "libc++",
              "MACOSX_DEPLOYMENT_TARGET": "10.15"
            },
            "libraries": [
              "-lcrypto",
              "-lcurl",
              "-lsqlite3",
              "-ljpeg"
            ]
          }
        ]
      ]
    }
  ]
}