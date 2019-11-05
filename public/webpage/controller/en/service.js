var TAG = "[service.js]"


var SERVICE_HOST = window.location.hostname == "localhost" ? window.location.protocol + '//' + window.location.hostname + ":3001/" : window.location.protocol + '//' + window.location.hostname + '/';

// var SERVICE_HOST = "localhost";
// var SERVICE_PORT = ":3000/";
var SERVICE_CONTEXT = "proxy/";
var SERVICE_CONTEXT_FORMDATA = "formdata/";
var SERVICE_CONTEXT_FORMBODY = "formbody/";
var SERVICE_VERSION = "";

// FirstPage
var SERVICE_FIRST_PAGE = SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "FirstPage/";
var URL_INTERSTING_CATEGORYS = SERVICE_FIRST_PAGE + "InterestingCategorys";
var URL_INTERSTING_LANDMARK = SERVICE_FIRST_PAGE + "InterestingLandmark";
var URL_NEAR_BY_ATTACTIONS = SERVICE_FIRST_PAGE + "NearbyAttactions";
var URL_INTERSTING_EVENTS = SERVICE_FIRST_PAGE + "InterestingEvents";
var URL_INTERSTING_TIPS = SERVICE_FIRST_PAGE + "InterestingTips";

// SearchPage
var SERVICE_SEARCH_PAGE = SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "Search/";
var URL_SEARCH_RESULT = SERVICE_SEARCH_PAGE + "SearchResult";
var URL_SEARCH_EVENT_RESULT = SERVICE_SEARCH_PAGE + "SearchEventResult";
var URL_SEARCH_TIPS_RESULT = SERVICE_SEARCH_PAGE + "SearchTipsResult";
var URL_SEARCH_ARTICLE_RESULT = SERVICE_SEARCH_PAGE + "SearchArticleResult";

// DetailPage
var SERVICE_DETAIL_PAGE = SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "Review/";
var SERVICE_DETAIL_PAGE_FORMDATA = SERVICE_HOST + SERVICE_CONTEXT_FORMDATA + SERVICE_VERSION + "Review/";
var URL_REVIEW_DETAIL_RESULT = SERVICE_DETAIL_PAGE + "ReviewDetail";
var URL_REVIEW_CONMENTS_RESULT = SERVICE_DETAIL_PAGE + "ReviewComments";
var URL_REVIEW_NEAR_BY_ATTACTION = SERVICE_DETAIL_PAGE + "ReviewNearbyAttactions";
var URL_REVIEW_TIPS = SERVICE_DETAIL_PAGE + "ReviewTips";
var URL_REVIEW_EVENTS = SERVICE_DETAIL_PAGE + "ReviewEvents";
var URL_REVIEW_ARTICLES = SERVICE_DETAIL_PAGE + "ReviewArticles";
var URL_REVIEW_ADDED_COMMENT = SERVICE_DETAIL_PAGE_FORMDATA + "ReviewAddedComment";

// TrackingPage
var SERVICE_TRACKING_PAGE = SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "Tracking/";
var URL_TRACKING_DETAIL = SERVICE_TRACKING_PAGE + "TrackingDetail";

//Auth
var SERVICE_AUTH_PAGE = SERVICE_HOST + SERVICE_CONTEXT_FORMBODY + SERVICE_VERSION + "Auth/";
var SERVICE_AUTH_GET_PAGE = SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "Auth/";
var URL_AUTH_TOKEN = SERVICE_AUTH_PAGE + "Token";
var URL_AUTH_INVOKE_TOKEN = SERVICE_AUTH_PAGE + "InvokeToken";
var URL_AUTH_GET_TOKEN = SERVICE_AUTH_GET_PAGE + "GetToken";

//Account
var SERVICE_ACCOUNT_PAGE = SERVICE_HOST + SERVICE_CONTEXT_FORMBODY + SERVICE_VERSION + "Account/";
var URL_ACCOUNT_REGISTER = SERVICE_ACCOUNT_PAGE + "Register";
var URL_ACCOUNT_FAVORITE = SERVICE_ACCOUNT_PAGE + "Favorite";

// Blogger
var SERVICE_BLOGGER_PAGE = SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "Blogger/";
var SERVICE_BLOGGER_PAGE_FORMDATA = SERVICE_HOST + SERVICE_CONTEXT_FORMDATA + SERVICE_VERSION + "Blogger/";
var URL_BLOG_DETAIL = SERVICE_BLOGGER_PAGE + "BlogDetail";
var URL_BLOG_COMMENTS = SERVICE_BLOGGER_PAGE + "BlogComments";
var URL_BLOG_ARTICLE_RESULT = SERVICE_BLOGGER_PAGE + "BlogArticleResult";
var URL_BLOG_ADDED_COMMENTS = SERVICE_BLOGGER_PAGE_FORMDATA + "BlogAddedComment";
var URL_BLOG_HISTORY = SERVICE_BLOGGER_PAGE + "BlogHistory";

function requestService(url, method, data, success, failure) {
    console.log(TAG, "start request service => ", url, " : method => ", method);
    $.ajax({
        type: method,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.getItem("access_token") != undefined ? "Bearer " + localStorage.getItem("access_token") : null);
        },
        url: url,
        data: method === "GET" ? data : JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(TAG, "requestService() => success => ", data);
            success(data);
        },
        failure: function (errMsg) {
            console.log(TAG, "requestService() => ERROR => ", errMsg);
            if (failure != undefined) {
                failure();
            }
        }
    });
}


function requestFormDataService(url, method, data, success, failure) {
    console.log(TAG, "data", data);
    var formData = new FormData();
    for (var key in data) {
        formData.append(key, data[key]);
    }

    console.log(TAG, "start request service => ", url, " : method => ", method, " : formData => ", formData);
    $.ajax({
        type: method,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.getItem("access_token") != undefined ? "Bearer " + localStorage.getItem("access_token") : null);
        },
        url: url,
        data: formData,
        contentType: "application/x-www-form-urlencoded",
        async: false,
        cache: false,
        processData: false,
        success: function (data) {
            console.log(TAG, "requestService() => success => ", data);
            success(data);
        },
        failure: function (errMsg) {
            console.log(TAG, "requestService() => ERROR => ", errMsg);
            if (failure != undefined) {
                failure();
            }
        }
    });
}


function requestFormBodyService(url, method, data, success, failure) {
    console.log(TAG, "data", data);
    // var formBody = new FormData();
    // for (var key in data) {
    //     // formData.append(key, data[key]);
    //     formBody.set(key, data[key]);
    // }

    console.log(TAG, "start request service => ", url, " : method => ", method, " : data => ", data);
    $.ajax({
        type: method,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", localStorage.getItem("access_token") != undefined ? "Bearer " + localStorage.getItem("access_token") : null);
        },
        url: url,
        data: data,
        contentType: "application/x-www-form-urlencoded",
        async: false,
        cache: false,
        processData: false,
        success: function (data) {
            console.log(TAG, "requestService() => success => ", data);
            success(data);
        },
        failure: function (errMsg) {
            console.log(TAG, "requestService() => ERROR => ", errMsg);
            if (failure != undefined) {
                failure();
            }
        }
    });
}