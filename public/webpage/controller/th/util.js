var TAG = "[util.js]"

var DATA_PARAM_IN_URL = {};
var PAGE_LANGUAGE = "";
var DATA_CATEGORYS = []
var CONFIG_SLICK = {
    infinite: true,
    dots: false,
    arrows: false,
    centerMode: true,
    centerPadding: '0',
    // autoplay: true,
    // autoplaySpeed: 3000,
}

var CONFIG_SLICK_GALLERY = {
    "slidesToShow": 3,
    "responsive": [{
        "breakpoint": 1024,
        "settings": {
            "slidesToShow": 3
        }
    }, {
        "breakpoint": 768,
        "settings": {
            "slidesToShow": 2
        }
    }]
};

function openLoading() {
    $("body").css("overflow", "hidden");
    $(".page_loader").css("display", "block");
    $(".page_loader").css("opacity", 0.5);
}


function closeLoading() {


    setTimeout(function () {
        $("body").css("overflow", "");
        $(".page_loader").css("display", "none");
        $(".page_loader").css("opacity", "");
        $(".page_loader").fadeOut("fast");
    }, 500);


}

function createSlick(id) {
    var slider = $(id);
    slider.slick(CONFIG_SLICK);

    slider.closest('.slick-slider-area').find('.slick-prev').on("click", function () {
        slider.slick('slickPrev');
    });
    slider.closest('.slick-slider-area').find('.slick-next').on("click", function () {
        slider.slick('slickNext');
    });
}


function createSlickGallery(id) {
    var slider = $(id);
    slider.slick(CONFIG_SLICK_GALLERY);

    slider.closest('.slick-slider-area').find('.slick-prev').on("click", function () {
        slider.slick('slickPrev');
    });
    slider.closest('.slick-slider-area').find('.slick-next').on("click", function () {
        slider.slick('slickNext');
    });
}

function convertJsonToParameterURL(json) {
    // return Object.keys(json).map(function (item) {
    //     return encodeURIComponent(item) + '=' + urlEncode(encodeURIComponent(json[item]), true)
    // }).join('&')


    return Object.keys(json).map(function (item) {
        return item + '=' + json[item]
    }).join('&')
}

function convertParameterURLToJson() {
    var paramInput = decodeURIComponent(document.location.href.split("?")[1]);

    var paramArr = paramInput.split("&");
    var resultMap = {};
    for (var i = 0; i < paramArr.length; i++) {
        var key = paramArr[i].split("=")[0];
        var value = paramArr[i].split("=")[1] == undefined ? "" : paramArr[i]
            .split("=")[1];
        resultMap[key] = decodeURI(value);
        // console.log(key, value);
    }

    return resultMap;
}

function convertParameterURLToJsonNotDecode(data) {
    var paramInput = data;

    var paramArr = paramInput.split("&");
    var resultMap = {};
    for (var i = 0; i < paramArr.length; i++) {
        var key = paramArr[i].split("=")[0];
        var value = paramArr[i].split("=")[1] == undefined ? "" : paramArr[i]
            .split("=")[1];
        // resultMap[key] = decodeURI(value);
        resultMap[key] = value;
        // console.log(key, value);
    }

    return resultMap;
}

function convertParameterURLToJsonNotDecodeSupportArray(data) {
    var paramInput = data;

    var paramArr = paramInput.split("&");
    var resultMap = {};
    for (var i = 0; i < paramArr.length; i++) {
        var key = paramArr[i].split("=")[0];
        var value = paramArr[i].split("=")[1] == undefined ? "" : paramArr[i]
            .split("=")[1];
        if (decodeURI(key).indexOf("[") >= 0 && decodeURI(key).indexOf("]") >= 0) {
            var keyArray = decodeURI(key).replace(/\[/g, "").replace(/\]/g, "");
            if (resultMap[keyArray] === undefined) {
                resultMap[keyArray] = [];
                resultMap[keyArray].push(value);
            } else {
                resultMap[keyArray].push(value);
            }
        } else {
            resultMap[key] = value;
        }
    }

    return resultMap;
}


function convertJsonToParameterURLNotEncode(json) {
    return Object.keys(json).map(function (item) {
        return item + '=' + json[item]
    }).join('&')
}

function convertJsonToParameterURLNotEncodeSupportArray(json) {
    return Object.keys(json).map(function (item) {
        if (typeof json[item] == "object") {
            return item + '=' + JSON.stringify(json[item])
        } else {
            return item + '=' + json[item]
        }
    }).join('&')
}

function urlEncode(inputString, encodeAllCharacter) {
    var outputString = '';
    if (inputString != null) {
        for (var i = 0; i < inputString.length; i++) {
            var charCode = inputString.charCodeAt(i);
            var tempText = "";
            if (charCode < 128) {
                if (encodeAllCharacter) {
                    var hexVal = charCode.toString(16);
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


function bindDataToTemplate(prototypeTemplate, data) {
    var templateResult = "";
    var template = prototypeTemplate;
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            template = template.replace(new RegExp("{{" + key + "}}", 'g'), data[key]);
        }
    }
    templateResult = templateResult + template;
    return templateResult;
}

function bindDataListToTemplate(prototypeTemplate, data) {
    // console.log(TAG, "bindDataListToTemplate", prototypeTemplate, data);
    var templateList = "";
    for (var i = 0; i < data.length; i++) {
        var template = prototypeTemplate;
        for (var key in data[i]) {
            if (data[i].hasOwnProperty(key)) {
                template = template.replace(new RegExp("{{" + key + "}}", 'g'), data[i][key]);
            }
        }
        templateList = templateList + template;
    }
    // console.log(TAG, "bindDataListToTemplate", templateList);
    return templateList;
}

function bindDataListToTemplateNotMap(prototypeTemplate, data) {
    // console.log(TAG, "bindDataListToTemplate", prototypeTemplate, data);
    var templateList = "";
    for (var i = 0; i < data.length; i++) {
        var template = prototypeTemplate;
        // for (var key in data[i]) {
        // if (data[i]) {
        template = template.replace(new RegExp("{{data}}", 'g'), data[i]);
        // }
        // }
        templateList = templateList + template;
    }
    // console.log(TAG, "bindDataListToTemplateNotMap", templateList);
    return templateList;
}

function linkTo(url) {
    window.location.href = url;
}