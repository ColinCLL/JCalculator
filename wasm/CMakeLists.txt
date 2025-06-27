cmake_minimum_required(VERSION 3.15)
project(jc_wasm)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

add_executable(jc_wasm
  groupCal.c
)

# Emscripten specific settings
set_target_properties(jc_wasm PROPERTIES
  SUFFIX ".js"
  LINK_FLAGS "-s WASM=1 -s EXPORTED_FUNCTIONS='[_groupCal]' -s EXPORTED_RUNTIME_METHODS='[ccall,cwrap]'"
)

# 添加优化编译选项
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O3 -flto")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -O3 -flto")

# 启用SIMD指令集
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -msimd128")