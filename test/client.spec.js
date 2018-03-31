/* eslint no-unused-vars: "off" */
/* eslint max-len: "off" */

"use strict"

//const should = require("chai").should()
//const expect = require("chai").expect
//const WebSocketServer = require("..").Server

const WebSocket = require("..")
const SERVER_HOST = "localhost"
const SERVER_PORT = 0 // random free port

describe("Client", function() {
    let server = null, host = SERVER_HOST, port = Math.floor(Math.random() * (65536 - 40001) + 40000);
    port = 8889;

    before(function(done) {
        if (WebSocket.Server) {
            new Promise(function (resolve, reject) {
                const wss = new WebSocket.Server({
                    host: host || SERVER_HOST,
                    port: port || SERVER_PORT
                });
                wss.on("listening", function () { 
                    resolve(wss);
                });
            })
                .then(function (srv) {
                    server = srv;
                    host = server.options.host;
                    port = server.options.port;

                    server.on('connection', function connection(ws) {
                        ws.on('message', function incoming(message) {
                            console.log('received: %s', message);
                        });
                        ws.send('something');
                    });
                    done();
                });
        }
        done();
    });

    after(function() {
        if (server) {
            server.close();
        }
    });

    it('should return a new instance', function(done) {
        const client = new WebSocket("ws://" + host + ":" + port);
        client.should.be.an.instanceOf(WebSocket);
        client.on("open", function() {
            //done();
            //client.close();
            client.send("xxxx");
        });
        client.on("message", function(message) {
            console.log('received: %s', message.data);
            done();
            client.close();
        });
        client.on("error", function(error) {
            done(error);
            client.close();
        });
        //done();
    });
});