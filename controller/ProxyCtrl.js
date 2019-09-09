const axios = require('axios');
const Constants = require('../constants/Constants');
const uuidv4 = require('uuid/v4');
let TAG = "";
let TRACE_ID = "";

// axios.defaults.headers.post['Accept'] = '*/*';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 30000;

module.exports = class ProxyCtrl {

    constructor() {
        this.buildTraceId();
    }

    buildTraceId() {
        TRACE_ID = uuidv4();
        TAG = "[ProxyCtrl.js]" + " [" + TRACE_ID + "]";
    }

    async get(url) {
        try {
            console.log(TAG, "Full URL", Constants.URL_SERVICE + url);
            const response = await axios.get(Constants.URL_SERVICE + url);
            // console.log(TAG, "GET success", response);
            return response;
        } catch (error) {
            console.error(TAG, "GET error", error);
            return {
                error: "GET error",
                data: error
            };
        }
    }

    async post(url, data, header) {
        try {
            const response = await axios.post(Constants.URL_SERVICE + url, data == undefined ? {} : data, {
                headers: header
            });
            // console.log(TAG, "GET success", response);
            return response;
        } catch (error) {
            // console.error(TAG, "GET error", error);
            return {
                error: "POST error",
                data: error
            };
        }
    }

    convertJsonToParameterURL(json) {
        let newJson = Object.keys(json).map((item) => {
            let newObjKey = encodeURIComponent(item);
            let newObjValue = this.urlEncode(encodeURIComponent(json[item]), true);
            let newObj = newObjKey + '=' + newObjValue;
            return newObj;
        }).join('&')
        return newJson
    }

    urlEncode(inputString, encodeAllCharacter) {
        let outputString = '';
        if (inputString != null) {
            for (let i = 0; i < inputString.length; i++) {
                let charCode = inputString.charCodeAt(i);
                let tempText = "";
                if (charCode < 128) {
                    if (encodeAllCharacter) {
                        let hexVal = charCode.toString(16);
                        outputString += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
                    } else {
                        outputString += String.fromCharCode(charCode);
                    }

                } else if ((charCode > 127) && (charCode < 2048)) {
                    tempText += String.fromCharCode((charCode >> 6) | 192);
                    tempText += String.fromCharCode((charCode & 63) | 128);
                    outputString += escape(tempText);
                } else {
                    tempText += String.fromCharCode((charCode >> 12) | 224);
                    tempText += String.fromCharCode(((charCode >> 6) & 63) | 128);
                    tempText += String.fromCharCode((charCode & 63) | 128);
                    outputString += escape(tempText);
                }
            }
        }
        return outputString;
    }



    // async post(url, data) {
    //     try {
    //         const response = await axios.post(url, data);
    //         console.log(TAG, "POST success", response);
    //         return response;
    //     } catch (error) {
    //         console.error(TAG, "POST error", error);
    //         return {
    //             error: "POST error",
    //             data: error
    //         };
    //     }
    // }
    proxyResponse(res, data) {
        try {
            if (data.error) {
                res.statusCode = 200;
                res.setHeader('Trace-Id', TRACE_ID);
                res.send({
                    code: "ERROR-0001",
                    error: "service error",
                    message: data.data
                });
                // console.error(TAG, "error", data.error);
            } else {

                res.set(data.headers);
                res.statusCode = data.status;
                res.setHeader('Trace-Id', TRACE_ID);
                res.send(data.data);
            }
        } catch (error) {
            res.statusCode = 200;
            res.setHeader('Trace-Id', TRACE_ID);
            res.send({
                code: "ERROR-0002",
                error: "proxy error",
                message: error
            });
            console.error(TAG, "error", error);
        }
    }
}