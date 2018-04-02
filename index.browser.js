/**
 * WebSocket implements a browser-side WebSocket specification.
 * @module Client
 */

"use strict";

var _eventemitter = require("eventemitter3");

var BrowserWebSocket = null;
/*if (typeof WebSocket !== 'undefined') {
    BrowserWebSocket = WebSocket;
} else */
if (typeof MozWebSocket !== 'undefined') {
    BrowserWebSocket = MozWebSocket;
} else if (typeof global !== 'undefined') {
    BrowserWebSocket = global.WebSocket || global.MozWebSocket;
} else if (typeof window !== 'undefined') {
    BrowserWebSocket = window.WebSocket || window.MozWebSocket;
} else if (typeof self !== 'undefined') {
    BrowserWebSocket = self.WebSocket || self.MozWebSocket;
}

/** Instantiate a WebSocket class
 * @constructor
 * @param {String} address - url to a websocket server
 * @param {(Object)} options - websocket options, no user on browser-side
 * @param {(String|Array)} protocols - a list of protocols
 * @return {WebSocket} - returns a WebSocket instance
 */
function WebSocket(address, options, protocols) {

    if (!(this instanceof WebSocket)) {
        throw new TypeError("Cannot call a class as a function");
    }

    if (!this) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    _eventemitter.call(this);
    //(WebSocket.__proto__ || Object.getPrototypeOf(WebSocket)).call(this);

    var _this = this;

    _this.socket = new BrowserWebSocket(address, protocols);

    /** 
     * An event listener to be called when the WebSocket connection's readyState 
     * changes to OPEN; this indicates that the connection is ready to send and 
     * receive data. The event is a simple one with the name "open".
     * @event
     * @param {Event} event - 
     * @param {String} event.type - "open"
     */  
    _this.socket.onopen = function (event) {
        if (_this.onopen) {
            _this.onopen.call(_this, event);
            //_this.onopen.call(this);
        }
        return _this.emit("open", event);
        //return _this.emit("open");
    };
    /** 
     * An event listener to be called when a message is received from the 
     * server. The listener receives a MessageEvent named "message".
     * @event
     * @param {MessageEvent} event - 
     * @param {String} event.type - "message"
     * @param {*} event.data - The data sent by the message emitter.
     */  
    _this.socket.onmessage = function (event) {
        if (_this.onmessage) {
            _this.onmessage.call(_this, event.data);
            //_this.onmessage.call(this, event.data);
        }
        return _this.emit("message", event.data);
        //return _this.emit("message", event.data);
    };
    /** 
     * An event listener to be called when an error occurs. This is a simple 
     * event named "error".
     * @event
     * @param {Event} event - 
     * @param {String} event.type - "error"
     */  
    _this.socket.onerror = function (event) {
        if (_this.onerror) {
            _this.onerror.call(_this, event);
            //_this.onerror.call(_this, error);
        }
        return _this.emit("error", event);
        //return _this.emit("error", error);
    };
    /** 
     * An event listener to be called when the WebSocket connection's readyState 
     * changes to CLOSED. The listener receives a CloseEvent named "close".
     * @event
     * @param {CloseEvent} event - 
     * @param {String} event.type - "close"
     * @param {Number} event.code - Returns an unsigned short containing the 
     * close code send by the server. 
     * @param {String} event.code - Returns a DOMString indicating the reason 
     * the server closed the connection. This is specific to the particular 
     * server and sub-protocol.
     * @param {Boolean} event.code - Returns a Boolean that Indicates whether 
     * or not the connection was cleanly closed.
     */    
    _this.socket.onclose = function (event) {
        if (_this.onclose) {
            _this.onclose.call(_this, event);
            //_this.onclose.call(_this);
        }
        return _this.emit("close", event);
        //return _this.emit("close");
    };
    return _this;
}

WebSocket.prototype = Object.create(_eventemitter.prototype, {
    constructor: {
        value: WebSocket,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

Object.setPrototypeOf(WebSocket, _eventemitter);

/**
 * A string indicating the type of binary data being transmitted by the connection. 
 * This should be either "blob" if DOM Blob objects are being used or "arraybuffer" 
 * if ArrayBuffer objects are being used.
 * 
 * @type {String}
 */
Object.defineProperty(WebSocket.prototype, 'binaryType', {
    enumerable: true,
    configurable: true,
    get: function binaryType() {
        return this.socket.binaryType;
    },
    set: function binaryType(type) {
        this.socket.binaryType = type;
    },
});

/**
 * These constants are used by the readyState attribute to describe the state of the 
 * WebSocket connection. **Read only**
 * 
 * @type {Number}
 */
Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
    enumerable: true,
    configurable: false,
    writalble: false,
    value: 0,
});
Object.defineProperty(WebSocket.prototype, 'OPEN', {
    enumerable: true,
    configurable: false,
    writalble: false,
    value: 1,
});
Object.defineProperty(WebSocket.prototype, 'CLOSING', {
    enumerable: true,
    configurable: false,
    writalble: false,
    value: 2,
});
Object.defineProperty(WebSocket.prototype, 'CLOSED', {
    enumerable: true,
    configurable: false,
    writalble: false,
    value: 3,
});

/**
 * The number of bytes of data that have been queued using calls to send() but not
 * yet transmitted to the network. This value resets to zero once all queued data 
 * has been sent. This value does not reset to zero when the connection is closed; 
 * if you keep calling send(), this will continue to climb. **Read only**
 * 
 * @type {Number}
 */
Object.defineProperty(WebSocket.prototype, 'bufferedAmount', {
    enumerable: true,
    configurable: true,
    get: function bufferedAmount() {
        return this.socket.bufferedAmount;
    },
    set: undefined,
});

/**
 * The extensions selected by the server. This is currently only the empty string 
 * or a list of extensions as negotiated by the connection. **Read only**.
 * 
 * @type {String}
 */
Object.defineProperty(WebSocket.prototype, 'extensions', {
    enumerable: true,
    configurable: true,
    get: function extensions() {
        return this.socket.extensions;
    },
    set: undefined,
});

/**
 * A string indicating the name of the sub-protocol the server selected; this will 
 * be one of the strings specified in the protocols parameter when creating the 
 * WebSocket object. **Read only**.
 * 
 * @type {String}
 */
Object.defineProperty(WebSocket.prototype, 'protocol', {
    enumerable: true,
    configurable: true,
    get: function protocol() {
        return this.socket.protocol;
    },
    set: undefined,
});

/**
 * The current state of the connection; this is one of the Ready state constants. 
 * **Read only**.
 * 
 * @type {Number}
 */
Object.defineProperty(WebSocket.prototype, 'readyState', {
    enumerable: true,
    configurable: true,
    get: function readyState() {
        return this.socket.readyState;
    },
    set: undefined,
});

/**
 * The URL as resolved by the constructor. This is always an absolute URL. 
 * **Read only**.
 * 
 * @type {String}
 */
Object.defineProperty(WebSocket.prototype, 'url', {
    enumerable: true,
    configurable: true,
    get: function url() {
        return this.socket.url;
    },
    set: undefined,
});

/**
 * Sends data through a websocket connection
 * @method
 * @param {(String|Object)} data - data to be sent via websocket
 * @param {Object} options - ws options
 * @param {Function} callback - a callback called once the data is sent
 * @return {Undefined}
 */
Object.defineProperty(WebSocket.prototype, 'send', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function send(data, options, callback) {
        try {
            this.socket.send(data);
            if (callback) {
                callback();
            }
        } catch (error) {
            //callback(error);
            console.log(error);
        }
    }
});

/**
 * Closes an underlying socket
 * @method
 * @param {Number} code - status code explaining why the connection is being closed
 * @param {String} reason - a description why the connection is closing
 * @return {Undefined}
 * @throws {Error}
 */
Object.defineProperty(WebSocket.prototype, 'close', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function close(code, reason) {
        this.socket.close(code, reason);
    }
});

// /**
//  * Register an event listener.
//  * @method
//  * @param {String} method A string representing the event type to listen for
//  * @param {Function} listener The listener to add
//  * @public
//  */
// Object.defineProperty(WebSocket.prototype, 'addEventListener', {
//     enumerable: false,
//     configurable: true,
//     writable: true,
//     value: function addEventListener(type, listener) {
//         this.socket.addEventListener(type, listener);
//     }
// });

// /**
//  * Remove an event listener.
//  * @method
//  * @param {String} method A string representing the event type to remove
//  * @param {Function} listener The listener to remove
//  * @public
//  */
// Object.defineProperty(WebSocket.prototype, 'removeEventListener', {
//     enumerable: false,
//     configurable: true,
//     writable: true,
//     value: function removeEventListener(type, listener) {
//         this.socket.removeEventListener(type, listener);
//     }
// });

module.exports = WebSocket;
