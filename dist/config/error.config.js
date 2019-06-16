"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERR_CODE = {
    "-1": "",
    UNKNOWN_ERROR: -1,
    "-401001": "api permission denied",
    SDK_API_PERMISSION_DENIED: -401001,
    "-401002": "api parameter error",
    SDK_API_PARAMETER_ERROR: -401002,
    "-401003": "api parameter type error",
    SDK_API_PARAMETER_TYPE_ERROR: -401003,
    "-402001": "circular reference detected",
    SDK_DATABASE_CIRCULAR_REFERENCE: -402001,
    "-402002": "realtime listener init watch fail",
    SDK_DATABASE_REALTIME_LISTENER_INIT_WATCH_FAIL: -402002,
    "-402003": "realtime listener reconnect watch fail",
    SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL: -402003,
    "-402004": "realtime listener rebuild watch fail",
    SDK_DATABASE_REALTIME_LISTENER_REBUILD_WATCH_FAIL: -402004,
    "-402005": "realtime listener rebuild watch fail",
    SDK_DATABASE_REALTIME_LISTENER_CLOSE_WATCH_FAIL: -402005,
    "-402006": "realtime listener receive server error msg",
    SDK_DATABASE_REALTIME_LISTENER_SERVER_ERROR_MSG: -402006,
    "-402007": "realtime listener receive invalid server data",
    SDK_DATABASE_REALTIME_LISTENER_RECEIVE_INVALID_SERVER_DATA: -402007,
    "-402008": "realtime listener websocket connection error",
    SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR: -402008,
    "-402009": "realtime listener websocket connection closed",
    SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_CLOSED: -402009,
    "-402010": "realtime listener check last fail",
    SDK_DATABASE_REALTIME_LISTENER_CHECK_LAST_FAIL: -402010,
    "-402011": "realtime listener unexpected fatal error",
    SDK_DATABASE_REALTIME_LISTENER_UNEXPECTED_FATAL_ERROR: -402011,
    "-403001": "max upload file size exceeded",
    SDK_STORAGE_EXCEED_MAX_UPLOAD_SIZE: -403001,
    "-403002": "internal server error: empty upload url",
    SDK_STORAGE_INTERNAL_SERVER_ERROR_EMPTY_UPLOAD_URL: -403002,
    "-403003": "internal server error: empty download url",
    SDK_STORAGE_INTERNAL_SERVER_ERROR_EMPTY_DOWNLOAD_URL: -403003,
    "-404001": "empty call result",
    SDK_FUNCTIONS_EMPTY_CALL_RESULT: -404001,
    "-404002": "empty event id",
    SDK_FUNCTIONS_EMPTY_EVENT_ID: -404002,
    "-404003": "empty poll url",
    SDK_FUNCTIONS_EMPTY_POLL_URL: -404003,
    "-404004": "empty poll result json",
    SDK_FUNCTIONS_EMPTY_POLL_RESULT_JSON: -404004,
    "-404005": "exceed max poll retry",
    SDK_FUNCTIONS_EXCEED_MAX_POLL_RETRY: -404005,
    "-404006": "empty poll result base resp",
    SDK_FUNCTIONS_EMPTY_POLL_RESULT_BASE_RESP: -404006,
    "-404007": "error while waiting for the result",
    SDK_FUNCTIONS_POLL_RESULT_BASE_RESP_RET_ABNORMAL: -404007,
    "-404008": "error while waiting for the result",
    SDK_FUNCTIONS_POLL_RESULT_STATUS_CODE_ERROR: -404008,
    "-404009": "error while waiting for the result",
    SDK_FUNCTIONS_POLL_ERROR: -404009,
    "-404010": "result expired",
    SDK_FUNCTIONS_POLL_RESULT_EXPIRED: -404010,
    "-404011": "cloud function execution error",
    SDK_FUNCTIONS_CLOUD_FUNCTION_EXECUTION_ERROR: -404011,
    "-404012": "error while waiting for the result",
    SDK_FUNCTIONS_EXCEED_MAX_TIMEOUT_POLL_RETRY: -404012,
    "-404013": "error while waiting for the result",
    SDK_FUNCTIONS_EXCEED_MAX_SYSTEM_ERROR_POLL_RETRY: -404013,
    "-601001": "system error",
    WX_SYSTEM_ERROR: -601001,
    "-601002": "system args error",
    WX_SYSTEM_ARGS_ERROR: -601002,
    "-601003": "system network error",
    WX_SYSTEM_NETWORK_ERROR: -601003,
    "-601004": "api permission denied",
    WX_API_PERMISSION_DENIED: -601004,
    "-501001": "resource system error",
    TCB_RESOURCE_SYSTEM_ERROR: -501001,
    "-501002": "resource server timeout",
    TCB_RESOURCE_SERVER_TIMEOUT: -501002,
    "-501003": "exceed request limit",
    TCB_EXCEED_REQUEST_LIMIT: -501003,
    "-501004": "exceed concurrent request limit",
    TCB_EXCEED_CONCURRENT_REQUEST_LIMIT: -501004,
    "-501005": "invalid env",
    TCB_INVALID_ENV: -501005,
    "-501006": "invalid common parameters",
    TCB_INVALID_COMMON_PARAM: -501006,
    "-501007": "invalid parameters",
    TCB_INVALID_PARAM: -501007,
    "-501008": "invalid request source",
    TCB_INVALID_REQUEST_SOURCE: -501008,
    "-501009": "resource not initialized",
    TCB_RESOURCE_NOT_INITIALIZED: -501009,
    "-502001": "database request fail",
    TCB_DB_REQUEST_FAIL: -502001,
    "-502002": "database invalid command",
    TCB_DB_INVALID_COMMAND: -502002,
    "-502003": "database permission denied",
    TCB_DB_PERMISSION_DENIED: -502003,
    "-502004": "database exceed collection limit",
    TCB_DB_EXCEED_COLLECTION_LIMIT: -502004,
    "-502005": "database collection not exists",
    TCB_DB_COLLECTION_NOT_EXISTS: -502005,
    "-503001": "storage request fail",
    TCB_STORAGE_REQUEST_FAIL: -503001,
    "-503002": "storage permission denied",
    TCB_STORAGE_PERMISSION_DENIED: -503002,
    "-503003": "storage file not exists",
    TCB_STORAGE_FILE_NOT_EXISTS: -503003,
    "-503004": "storage invalid sign parameter",
    TCB_STORAGE_INVALID_SIGN_PARAM: -503004,
    "-504001": "functions request fail",
    TCB_FUNCTIONS_REQUEST_FAIL: -504001,
    "-504002": "functions execute fail",
    TCB_FUNCTIONS_EXEC_FAIL: -504002
};
