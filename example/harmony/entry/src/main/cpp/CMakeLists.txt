project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# OHOS libcxx-ohos ships no standard assert.h (only an empty-case variant that
# <cassert>/boost resolve to case-insensitively), so the assert macro is never
# defined and the rnoh sources fail with "use of undeclared identifier 'assert'".
# Force-include the musl sysroot's standard assert.h for CXX compilation only.
if(DEFINED ENV{DEVECO_SDK_HOME})
  set(MUSL_ASSERT_H "$ENV{DEVECO_SDK_HOME}/default/openharmony/native/sysroot/usr/include/assert.h")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -include ${MUSL_ASSERT_H}")
endif()

set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
get_filename_component(OH_MODULES "${OH_MODULES}" REALPATH)
set(OH_MODULES_DIR "${OH_MODULES}")
set(RNOH_CPP_DIR "${OH_MODULES}/@rnoh/react-native-openharmony/src/main/cpp")
set(PERMISSIONS_SRC "${OH_MODULES}/@zcating/react-native-permissions/src/main/cpp")

add_subdirectory("${RNOH_CPP_DIR}" ./rn)
add_subdirectory("${PERMISSIONS_SRC}" ./rnoh_permissions)

add_library(rnoh_app SHARED
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)

target_link_libraries(rnoh_app PUBLIC rnoh)
target_link_libraries(rnoh_app PUBLIC rnoh_permissions)