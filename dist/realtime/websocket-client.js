"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const virtual_websocket_client_1 = require("./virtual-websocket-client");
const utils_1 = require("../utils/utils");
const message_1 = require("./message");
const ws_event_1 = require("./ws-event");
const error_1 = require("../utils/error");
const error_2 = require("./error");
const error_config_1 = require("../config/error.config");
const WS_READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};
const MAX_RTT_OBSERVED = 3;
const DEFAULT_EXPECTED_EVENT_WAIT_TIME = 5000;
const DEFAULT_UNTRUSTED_RTT_THRESHOLD = 10000;
const DEFAULT_MAX_RECONNECT = 5;
const DEFAULT_WS_RECONNECT_INTERVAL = 10000;
const DEFAULT_PING_FAIL_TOLERANCE = 2;
const DEFAULT_PONG_MISS_TOLERANCE = 2;
const DEFAULT_LOGIN_TIMEOUT = 5000;
class RealtimeWebSocketClient {
    constructor(options) {
        this._virtualWSClient = new Set();
        this._queryIdClientMap = new Map();
        this._watchIdClientMap = new Map();
        this._pingFailed = 0;
        this._pongMissed = 0;
        this._logins = new Map();
        this._wsReadySubsribers = [];
        this._wsResponseWait = new Map();
        this._rttObserved = [];
        this.initWebSocketConnection = async (reconnect, availableRetries = this._maxReconnect) => {
            if (reconnect && this._reconnectState) {
                return;
            }
            if (reconnect) {
                this._reconnectState = true;
            }
            if (this._wsInitPromise) {
                return this._wsInitPromise;
            }
            console.log(`[realtime] initWebSocketConnection reconnect ${reconnect} availableRetries ${availableRetries}`);
            if (reconnect) {
                this.pauseClients();
            }
            this.close(ws_event_1.CLOSE_EVENT_CODE.ReconnectWebSocket);
            this._wsInitPromise = new Promise(async (resolve, reject) => {
                try {
                    console.log(`[realtime] initWebSocketConnection start throwErrorIfNetworkOffline`);
                    console.log(`[realtime] initWebSocketConnection start getSignature`);
                    await this.getAccessToken();
                    console.log(`[realtime] initWebSocketConnection getSignature success`);
                    console.log(`[realtime] initWebSocketConnection start connectSocket`);
                    await new Promise(success => {
                        this._ws = new WebSocket("wss://tcb-ws.tencentcloudapi.com");
                        console.log("(((((((((((((((((((((((((((((((");
                        success();
                    });
                    console.log(`[realtime] initWebSocketConnection connectSocket successfully fired`);
                    await this.initWebSocketEvent();
                    resolve();
                    if (reconnect) {
                        this.resumeClients();
                        this._reconnectState = false;
                    }
                }
                catch (e) {
                    console.error(`[realtime] initWebSocketConnection connect fail`, e);
                    if (availableRetries > 0) {
                        const isConnected = true;
                        console.log(`[realtime] initWebSocketConnection waiting for network online`);
                        console.log(`[realtime] initWebSocketConnection network online`);
                        this._wsInitPromise = undefined;
                        if (isConnected) {
                            console.log(`[realtime] initWebSocketConnection sleep ${this._reconnectInterval}ms`);
                            await utils_1.sleep(this._reconnectInterval);
                            if (reconnect) {
                                this._reconnectState = false;
                            }
                        }
                        resolve(this.initWebSocketConnection(reconnect, availableRetries - 1));
                    }
                    else {
                        reject(e);
                        if (reconnect) {
                            this.closeAllClients(new error_1.CloudSDKError({
                                errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_RECONNECT_WATCH_FAIL,
                                errMsg: e
                            }));
                        }
                    }
                }
            });
            let success = false;
            try {
                await this._wsInitPromise;
                success = true;
                this._wsReadySubsribers.forEach(({ resolve }) => resolve());
            }
            catch (e) {
                this._wsReadySubsribers.forEach(({ reject }) => reject());
            }
            finally {
                this._wsInitPromise = undefined;
                this._wsReadySubsribers = [];
            }
            console.log(`[realtime] initWebSocketConnection ${success ? "success" : "fail"}`);
        };
        this.initWebSocketEvent = () => new Promise((resolve, reject) => {
            if (!this._ws) {
                throw new Error(`can not initWebSocketEvent, ws not exists`);
            }
            let wsOpened = false;
            this._ws.onopen = event => {
                console.warn(`[realtime] ws event: open`, event);
                wsOpened = true;
                resolve();
            };
            this._ws.onerror = event => {
                this._logins = new Map();
                if (!wsOpened) {
                    console.error(`[realtime] ws open failed with ws event: error`, event);
                    reject(event);
                }
                else {
                    console.error(`[realtime] ws event: error`, event);
                    this.clearHeartbeat();
                    this._virtualWSClient.forEach(client => client.closeWithError(new error_1.CloudSDKError({
                        errCode: error_config_1.ERR_CODE.SDK_DATABASE_REALTIME_LISTENER_WEBSOCKET_CONNECTION_ERROR,
                        errMsg: event
                    })));
                }
            };
            this._ws.onclose = closeEvent => {
                console.warn(`[realtime] ws event: close`, closeEvent);
                this._logins = new Map();
                this.clearHeartbeat();
                switch (closeEvent.code) {
                    case ws_event_1.CLOSE_EVENT_CODE.ReconnectWebSocket: {
                        break;
                    }
                    case ws_event_1.CLOSE_EVENT_CODE.NoRealtimeListeners: {
                        break;
                    }
                    case ws_event_1.CLOSE_EVENT_CODE.HeartbeatPingError:
                    case ws_event_1.CLOSE_EVENT_CODE.HeartbeatPongTimeoutError:
                    case ws_event_1.CLOSE_EVENT_CODE.NormalClosure:
                    case ws_event_1.CLOSE_EVENT_CODE.AbnormalClosure: {
                        if (this._maxReconnect > 0) {
                            this.initWebSocketConnection(true, this._maxReconnect);
                        }
                        else {
                            this.closeAllClients(ws_event_1.getWSCloseError(closeEvent.code));
                        }
                        break;
                    }
                    case ws_event_1.CLOSE_EVENT_CODE.NoAuthentication: {
                        this.closeAllClients(ws_event_1.getWSCloseError(closeEvent.code, closeEvent.reason));
                        break;
                    }
                    default: {
                        if (this._maxReconnect > 0) {
                            this.initWebSocketConnection(true, this._maxReconnect);
                        }
                        else {
                            this.closeAllClients(ws_event_1.getWSCloseError(closeEvent.code));
                        }
                    }
                }
            };
            this._ws.onmessage = res => {
                const rawMsg = res.data;
                this.heartbeat();
                let msg;
                try {
                    msg = JSON.parse(rawMsg);
                }
                catch (e) {
                    throw new Error(`[realtime] onMessage parse res.data error: ${e}`);
                }
                console.log(`[realtime] onMessage ${msg.msgType} (${new Date().toLocaleString()})`, msg);
                if (msg.msgType === "ERROR") {
                    let virtualWatch = null;
                    this._virtualWSClient.forEach(item => {
                        if (item.watchId === msg.watchId) {
                            virtualWatch = item;
                        }
                    });
                    if (virtualWatch) {
                        virtualWatch.listener.onError(msg);
                    }
                }
                const responseWaitSpec = this._wsResponseWait.get(msg.requestId);
                if (responseWaitSpec) {
                    try {
                        if (msg.msgType === "ERROR") {
                            responseWaitSpec.reject(new error_2.RealtimeErrorMessageError(msg));
                        }
                        else {
                            responseWaitSpec.resolve(msg);
                        }
                    }
                    catch (e) {
                        console.error(`ws onMessage responseWaitSpec.resolve(msg) errored:`, e);
                    }
                    finally {
                        this._wsResponseWait.delete(msg.requestId);
                    }
                    if (responseWaitSpec.skipOnMessage) {
                        return;
                    }
                }
                if (msg.msgType === "PONG") {
                    if (this._lastPingSendTS) {
                        const rtt = Date.now() - this._lastPingSendTS;
                        if (rtt > DEFAULT_UNTRUSTED_RTT_THRESHOLD) {
                            console.warn(`[realtime] untrusted rtt observed: ${rtt}`);
                            return;
                        }
                        if (this._rttObserved.length >= MAX_RTT_OBSERVED) {
                            this._rttObserved.splice(0, this._rttObserved.length - MAX_RTT_OBSERVED + 1);
                        }
                        this._rttObserved.push(rtt);
                    }
                    return;
                }
                let client = msg.watchId && this._watchIdClientMap.get(msg.watchId);
                if (client) {
                    client.onMessage(msg);
                }
                else {
                    console.error(`[realtime] no realtime listener found responsible for watchId ${msg.watchId}: `, msg);
                    switch (msg.msgType) {
                        case "INIT_EVENT":
                        case "NEXT_EVENT":
                        case "CHECK_EVENT": {
                            client = this._queryIdClientMap.get(msg.msgData.queryID);
                            if (client) {
                                client.onMessage(msg);
                            }
                            break;
                        }
                        default: {
                            for (const [watchId, client] of this._watchIdClientMap) {
                                console.log("watchid*****", watchId);
                                client.onMessage(msg);
                                break;
                            }
                        }
                    }
                }
            };
            this.heartbeat();
        });
        this.isWSConnected = () => {
            return Boolean(this._ws && this._ws.readyState === WS_READY_STATE.OPEN);
        };
        this.onceWSConnected = async () => {
            if (this.isWSConnected()) {
                return;
            }
            if (this._wsInitPromise) {
                return this._wsInitPromise;
            }
            return new Promise((resolve, reject) => {
                this._wsReadySubsribers.push({
                    resolve,
                    reject
                });
            });
        };
        this.webLogin = async (envId, refresh) => {
            if (!refresh) {
                if (envId) {
                    const loginInfo = this._logins.get(envId);
                    if (loginInfo) {
                        if (loginInfo.loggedIn && loginInfo.loginResult) {
                            console.log(`[realtime] login: already logged in`);
                            return loginInfo.loginResult;
                        }
                        else if (loginInfo.loggingInPromise) {
                            return loginInfo.loggingInPromise;
                        }
                    }
                }
                else {
                    const emptyEnvLoginInfo = this._logins.get("");
                    if (emptyEnvLoginInfo && emptyEnvLoginInfo.loggingInPromise) {
                        return emptyEnvLoginInfo.loggingInPromise;
                    }
                }
            }
            console.log(`[realtime] login: logging in`);
            const promise = new Promise(async (resolve, reject) => {
                try {
                    const accessTokenRes = await this.getAccessToken();
                    const loginMsg = {
                        watchId: undefined,
                        requestId: message_1.genRequestId(),
                        msgType: "LOGIN",
                        msgData: {
                            envId: accessTokenRes.env,
                            accessToken: accessTokenRes.accessToken,
                            referrer: "web",
                            sdkVersion: "",
                            dataVersion: ""
                        }
                    };
                    console.log("login requestid************", loginMsg.requestId);
                    const loginResMsg = await this.send({
                        msg: loginMsg,
                        waitResponse: true,
                        skipOnMessage: true,
                        timeout: DEFAULT_LOGIN_TIMEOUT
                    });
                    if (!loginResMsg.msgData.code) {
                        resolve({
                            envId: accessTokenRes.env
                        });
                    }
                    else {
                        reject(new Error(`${loginResMsg.msgData.code} ${loginResMsg.msgData.message}`));
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
            let loginInfo = envId && this._logins.get(envId);
            const loginStartTS = Date.now();
            if (loginInfo) {
                loginInfo.loggedIn = false;
                loginInfo.loggingInPromise = promise;
                loginInfo.loginStartTS = loginStartTS;
            }
            else {
                loginInfo = {
                    loggedIn: false,
                    loggingInPromise: promise,
                    loginStartTS
                };
                this._logins.set(envId || "", loginInfo);
            }
            try {
                const loginResult = await promise;
                const curLoginInfo = envId && this._logins.get(envId);
                if (curLoginInfo &&
                    curLoginInfo === loginInfo &&
                    curLoginInfo.loginStartTS === loginStartTS) {
                    loginInfo.loggedIn = true;
                    loginInfo.loggingInPromise = undefined;
                    loginInfo.loginStartTS = undefined;
                    loginInfo.loginResult = loginResult;
                    return loginResult;
                }
                else if (curLoginInfo) {
                    if (curLoginInfo.loggedIn && curLoginInfo.loginResult) {
                        return curLoginInfo.loginResult;
                    }
                    else if (curLoginInfo.loggingInPromise) {
                        return curLoginInfo.loggingInPromise;
                    }
                    else {
                        throw new Error(`ws unexpected login info`);
                    }
                }
                else {
                    throw new Error(`ws login info reset`);
                }
            }
            catch (e) {
                loginInfo.loggedIn = false;
                loginInfo.loggingInPromise = undefined;
                loginInfo.loginStartTS = undefined;
                loginInfo.loginResult = undefined;
                throw e;
            }
        };
        this.getAccessToken = async () => {
            return this._context.appConfig.getAccessToken();
        };
        this.getWaitExpectedTimeoutLength = () => {
            if (!this._rttObserved.length) {
                return DEFAULT_EXPECTED_EVENT_WAIT_TIME;
            }
            return ((this._rttObserved.reduce((acc, cur) => acc + cur) /
                this._rttObserved.length) *
                1.5);
        };
        this.ping = async () => {
            const msg = {
                watchId: undefined,
                requestId: message_1.genRequestId(),
                msgType: "PING",
                msgData: null
            };
            await this.send({
                msg
            });
            console.log("ping sent");
        };
        this.send = (opts) => new Promise(async (_resolve, _reject) => {
            let timeoutId;
            let _hasResolved = false;
            let _hasRejected = false;
            const resolve = (value) => {
                _hasResolved = true;
                timeoutId && clearTimeout(timeoutId);
                _resolve(value);
            };
            const reject = (error) => {
                _hasRejected = true;
                timeoutId && clearTimeout(timeoutId);
                _reject(error);
            };
            if (opts.timeout) {
                timeoutId = setTimeout(async () => {
                    if (!_hasResolved || !_hasRejected) {
                        await utils_1.sleep(0);
                        if (!_hasResolved || !_hasRejected) {
                            reject(new error_1.TimeoutError(`wsclient.send timedout`));
                        }
                    }
                }, opts.timeout);
            }
            try {
                console.log(`[realtime] ws send ${opts.msg.msgType} (${new Date().toLocaleString()}): `, opts);
                if (this._wsInitPromise) {
                    await this._wsInitPromise;
                }
                if (!this._ws) {
                    reject(new Error(`invalid state: ws connection not exists, can not send message`));
                    return;
                }
                if (this._ws.readyState !== WS_READY_STATE.OPEN) {
                    reject(new Error(`ws readyState invalid: ${this._ws.readyState}, can not send message`));
                    return;
                }
                if (opts.waitResponse) {
                    this._wsResponseWait.set(opts.msg.requestId, {
                        resolve,
                        reject,
                        skipOnMessage: opts.skipOnMessage
                    });
                }
                console.log("send msg:", opts.msg);
                try {
                    this._ws.send(JSON.stringify(opts.msg));
                    if (!opts.waitResponse) {
                        resolve();
                    }
                }
                catch (err) {
                    if (err) {
                        reject(err);
                        if (opts.waitResponse) {
                            this._wsResponseWait.delete(opts.msg.requestId);
                        }
                    }
                }
            }
            catch (e) {
                reject(e);
            }
        });
        this.closeAllClients = (error) => {
            this._virtualWSClient.forEach(client => {
                client.closeWithError(error);
            });
        };
        this.pauseClients = (clients) => {
            ;
            (clients || this._virtualWSClient).forEach(client => {
                client.pause();
            });
        };
        this.resumeClients = (clients) => {
            ;
            (clients || this._virtualWSClient).forEach(client => {
                client.resume();
            });
        };
        this.onWatchStart = (client, queryID) => {
            this._queryIdClientMap.set(queryID, client);
        };
        this.onWatchClose = (client, queryID) => {
            if (queryID) {
                this._queryIdClientMap.delete(queryID);
            }
            this._watchIdClientMap.delete(client.watchId);
            this._virtualWSClient.delete(client);
            if (!this._virtualWSClient.size) {
                this.close(ws_event_1.CLOSE_EVENT_CODE.NoRealtimeListeners);
            }
        };
        this._maxReconnect = options.maxReconnect || DEFAULT_MAX_RECONNECT;
        this._reconnectInterval =
            options.reconnectInterval || DEFAULT_WS_RECONNECT_INTERVAL;
        this._context = options.context;
    }
    heartbeat(immediate) {
        this.clearHeartbeat();
        this._pingTimeoutId = setTimeout(async () => {
            try {
                if (!this._ws || this._ws.readyState !== WS_READY_STATE.OPEN) {
                    return;
                }
                this._lastPingSendTS = Date.now();
                await this.ping();
                this._pingFailed = 0;
                this._pongTimeoutId = setTimeout(() => {
                    console.error(`pong timed out`);
                    if (this._pongMissed < DEFAULT_PONG_MISS_TOLERANCE) {
                        this._pongMissed++;
                        this.heartbeat(true);
                    }
                    else {
                        this.initWebSocketConnection(true);
                    }
                }, this._context.appConfig.realtimePongWaitTimeout);
            }
            catch (e) {
                if (this._pingFailed < DEFAULT_PING_FAIL_TOLERANCE) {
                    this._pingFailed++;
                    this.heartbeat();
                }
                else {
                    this.close(ws_event_1.CLOSE_EVENT_CODE.HeartbeatPingError);
                }
            }
        }, immediate ? 0 : this._context.appConfig.realtimePingInterval);
    }
    clearHeartbeat() {
        this._pingTimeoutId && clearTimeout(this._pingTimeoutId);
        this._pongTimeoutId && clearTimeout(this._pongTimeoutId);
    }
    close(code) {
        this.clearHeartbeat();
        if (this._ws) {
            this._ws.close(code, ws_event_1.CLOSE_EVENT_CODE_INFO[code].name);
            this._ws = undefined;
        }
    }
    watch(options) {
        if (!this._ws && !this._wsInitPromise) {
            this.initWebSocketConnection(false);
        }
        const virtualClient = new virtual_websocket_client_1.VirtualWebSocketClient(Object.assign({}, options, { send: this.send, login: this.webLogin, isWSConnected: this.isWSConnected, onceWSConnected: this.onceWSConnected, getWaitExpectedTimeoutLength: this.getWaitExpectedTimeoutLength, onWatchStart: this.onWatchStart, onWatchClose: this.onWatchClose, debug: true }));
        this._virtualWSClient.add(virtualClient);
        this._watchIdClientMap.set(virtualClient.watchId, virtualClient);
        return virtualClient.listener;
    }
}
exports.RealtimeWebSocketClient = RealtimeWebSocketClient;
