module.exports = class ConvertParam {
    convertJsonToParameterURL(json) {
        return Object.keys(json).map(function (item) {
            return decodeURI(item) + '=' + decodeURI(json[item])
        }).join('&')
    }

    convertParameterURLToJson(uri) {
        let paramInput = decodeURIComponent(uri.split("?")[1]);

        let paramArr = paramInput.split("&");
        let resultMap = {};
        for (let i = 0; i < paramArr.length; i++) {
            let key = paramArr[i].split("=")[0];
            let value = paramArr[i].split("=")[1] == undefined ? "" : paramArr[i]
                .split("=")[1];
            resultMap[key] = decodeURI(value);
            // console.log(key, value);
        }
        return resultMap;
    }
}