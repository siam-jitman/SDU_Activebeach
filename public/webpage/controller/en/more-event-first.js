var TAG = "[search.js]"
var DATA_CATEGORYS = [];
var SEARCH_RESULT_LIST = [];
var RAW_SEARCH_RESULT_LIST = [];
var COUNT_SHOW_SIZE = 6;
var SHOW_SIZE = 6;
var MAX_SHOW_SIZE = 6;

$(function () {
    'use strict';
    $(window).on('load', function () {

        $("#viewSearchType").load("../template/th/search/list-search.html");
        $("#btnListView").addClass("active-view-btn");



        openLoading();

        $("#btnListView").on('click', function () {
            $("#viewSearchType").load("../template/th/search/list-search.html", function () {
                genSizeShowContentSearchDetail();
            });
            $("#btnListView").addClass("active-view-btn");
            $("#btnGridView").removeClass("active-view-btn");

        });

        $("#btnGridView").on('click', function () {
            $("#viewSearchType").load("../template/th/search/grid-search.html", function () {
                genSizeShowContentSearchDetail();
            });
            $("#btnListView").removeClass("active-view-btn");
            $("#btnGridView").addClass("active-view-btn");

        });

        $("#loadContentSearchMore").on('click', function () {
            genSizeShowContentSearchDetail(true);
        });

        $("#select-sort-bar").change(function () {
            console.log($("#select-sort-bar").val())
            if ($("#select-sort-bar").val() == "asc") {
                SEARCH_RESULT_LIST = JSON.parse(JSON.stringify(SEARCH_RESULT_LIST.sort()));
            } else if ($("#select-sort-bar").val() == "desc") {
                SEARCH_RESULT_LIST = JSON.parse(JSON.stringify(SEARCH_RESULT_LIST.reverse()));
            } else {
                SEARCH_RESULT_LIST = JSON.parse(JSON.stringify(RAW_SEARCH_RESULT_LIST));
            }
            genSizeShowContentSearchDetail();
        });


        $("#btn-view-article").on('click', function () {
            var param = {
                text: $("#txt-search-bar").val(),
                category_id: $("#select-search-bar").val()
            };
            window.location.href = "./search-article.html?" + convertJsonToParameterURL(param);
        });

        $("#btn-view-tips").on('click', function () {
            var param = {
                text: $("#txt-search-bar").val(),
                category_id: $("#select-search-bar").val()
            };
            window.location.href = "./search-tips.html?" + convertJsonToParameterURL(param);
        });

        $("#btn-view-all").on('click', function () {
            var param = {
                text: $("#txt-search-bar").val(),
                category_id: $("#select-search-bar").val()
            };
            window.location.href = "./search.html?" + convertJsonToParameterURL(param);

        });

        requestServiceInterestingCategorys();


        $("body").scrollTop();
    });
});

function clickBtnToDetail(id) {

    var param = {
        id: id
    };
    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
}

function clickBtnToDetailEvent(id, name) {

    console.log("clickBtnToDetailEvent", id, name);

    var param = {
        id: id,
        name: name
    };
    window.location.href = "./detail-event.html?" + convertJsonToParameterURL(param);
}

function genSizeShowContentSearchDetail(nextMore) {
    if (nextMore) {
        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    }
    var searchResultListMazSize = [];
    for (var i = 0; i < SHOW_SIZE; i++) {
        if (SEARCH_RESULT_LIST[i] != undefined) {
            searchResultListMazSize.push(SEARCH_RESULT_LIST[i]);
        }
    }

    if (MAX_SHOW_SIZE <= SHOW_SIZE) {
        $("#loadContentSearchMore").css("display", "none");
    } else {
        $("#loadContentSearchMore").css("display", "contents");
    }

    genContentSearchDetail(searchResultListMazSize);
}

function genContentSearchDetail(dataList) {
    var rawResult = {
        meta_id: "",
        thumbnail: "",
        ratings: "",
        reviews: "",
        location: "",
        description: "",
        categoryName: "",
    }

    var rawResultArray = [];

    for (var i = 0; i < dataList.length; i++) {

        rawResult = JSON.parse(JSON.stringify(dataList[i]));
        rawResult.meta_id = dataList[i].id[PAGE_LANGUAGE];
        rawResult.thumbnail = dataList[i].thumbnail;
        rawResult.companyName = checkFieldForLanguageNull(dataList[i].name);
        rawResult.location = dataList[i].address;
        rawResult.description = dataList[i].content;
        rawResult.reviews = "";
        rawResult.reviews = dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews");
        rawResult.ratings = dataList[i].ratings;

        rawResultArray.push(JSON.parse(JSON.stringify(rawResult)));
    }

    if ($("#btnListView").hasClass("active-view-btn")) {
        console.log("result-search-listing");
        var resultSearchListing = $("#result-search-listing");
        var templateResultSearchListingTepm = $("#result-search-temp").html();
        resultSearchListing.html(bindDataListToTemplate(templateResultSearchListingTepm, JSON.parse(JSON.stringify(rawResultArray))));

    }
    if ($("#btnGridView").hasClass("active-view-btn")) {
        console.log("result-search-grid");
        var resultSearchListing = $("#result-search-grid");
        var templateResultSearchListingTepm = $("#result-search-grid-temp").html();
        resultSearchListing.html(bindDataListToTemplate(templateResultSearchListingTepm, JSON.parse(JSON.stringify(rawResultArray))));

    }

    for (var i = 0; i < dataList.length; i++) {
        var templateScore = $(".score-reviews-attaction-" + dataList[i].id[PAGE_LANGUAGE]);
        var score = templateScore.data("start");
        var iconStartSelect = '<i class="fa fa-star"></i>';
        var iconStartNone = '<i class="fa fa-star-o"></i>';
        for (var n = 5; n >= 1; n--) {
            if (n <= score) {
                templateScore.prepend(iconStartSelect);
            } else {
                templateScore.prepend(iconStartNone);
            }
        }
    }
    if (rawResultArray.length === 0) {
        $("#result-search-listing").append("<center><h2>ไม่พบข้อมูล</h2></center>");
    }
    closeLoading();
}

function requestServiceInterestingCategorys() {
    requestService(URL_INTERSTING_CATEGORYS, "GET", {
        "lang": window.location.href.split(window.location.hostname + (window.location.port != "" ? ":" + window.location.port : "") + "/")[1].split("/")[0]
    }, function (res) {

        for (var i = 0; i < res.data.categorys.length; i++) {
            DATA_CATEGORYS.push({
                categoryName: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                categoryNameDisplay: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                categoryNameValue: res.data.categorys[i].service_id,
                // categoryUrlImage: res.data.categorys[i].image,
                categoryUrlImage: res.data.categorys[i].thumbnail,
                categoryUrlIcon: res.data.categorys[i].icon
            });
        }

        var templateCategoryMenu = $("#index-category-menu").html();
        var templateCategorySearchBar = $("#select-search-bar").html();
        $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));
        $("#select-search-bar").html(bindDataListToTemplate(templateCategorySearchBar, [{
            categoryNameDisplay: "เลือกหมวดหมู่ที่ต้องการ",
            categoryNameValue: ""
        }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));
        $("#txt-search-bar").val(DATA_PARAM_IN_URL["text"]);
        $("#select-search-bar").val(DATA_PARAM_IN_URL["category_id"] == undefined ? DATA_PARAM_IN_URL["category_id"] : DATA_PARAM_IN_URL["category_id"]);

        $('.selectpicker').selectpicker("refresh");

        loadMainModalFavorite();
        requestServiceSearchEventResult();
        requestSearchResult();
        requestServiceSearchTipsResult();
        requestServiceSearchArticleResult();
    });
}


function requestSearchResult() {

    openLoading();

    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,

    }


    var dooSuccess = function (res) {

        var eventResultList = res.data.searchs;
        var rawEventResultList = [];

        for (var i = 0; i < eventResultList.length; i++) {

            if (i <= 2) {
                rawEventResultList.push({
                    ...eventResultList[i],
                    event_id: eventResultList[i].meta_id,
                    event_name: eventResultList[i].title[PAGE_LANGUAGE],
                    location: eventResultList[i].address,
                    description: eventResultList[i].content,
                    ratings: eventResultList[i].ratings,
                    reviews: eventResultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                    thumbnail: eventResultList[i].thumbnail,
                    icon: eventResultList[i].icon,

                    category_name: eventResultList[i].service_name[PAGE_LANGUAGE],
                    company_name: eventResultList[i].title[PAGE_LANGUAGE],
                    meta_id: eventResultList[i].meta_id,
                    company_id: eventResultList[i].company_id[PAGE_LANGUAGE],
                    category_id: eventResultList[i].service_id,
                    lang: PAGE_LANGUAGE

                });
            } else {
                break;
            }
        }

        if (rawEventResultList.length === 0) {
            document.getElementById("main-content-recommend-search-event").setAttribute("style", "display: none");
        }
        var templateRecommendEvent = $("#content-recommend-search-event").html();

        $("#content-recommend-search-event").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

        for (var i = 0; i < eventResultList.length; i++) {

            if (i <= 2) {
                var templateScore = $(".content-recommend-ratings-event-" + eventResultList[i].meta_id);
                var score = templateScore.data("start");
                var iconStartSelect = '<i class="fa fa-star"></i>';
                var iconStartNone = '<i class="fa fa-star-o"></i>';
                for (var n = 5; n >= 1; n--) {
                    if (n <= score) {
                        templateScore.prepend(iconStartSelect);
                    } else {
                        templateScore.prepend(iconStartNone);
                    }
                }
            } else {
                break;
            }
        }
    }

    requestService(URL_SEARCH_RESULT, "GET", param, dooSuccess);
}

function requestServiceSearchEventResult() {

    openLoading();


    var paramInUrl = convertParameterURLToJson();

    var param = {
        company_id: paramInUrl.company_id,
        category_id: paramInUrl.category_id,
        meta_id: paramInUrl.meta_id,
        category_name: paramInUrl.category_name,
        company_name: paramInUrl.company_name,
        lang:  PAGE_LANGUAGE,
        // lang:paramInUrl.lang,
    }

    var dooSuccess = function (res) {
        //close loading

        var data = res.data;

        $("#lable-search-type-all").html(DATA_PARAM_IN_URL.endpoint);
        $("#lable-search-type-all-count").html(data.count + (PAGE_LANGUAGE == "th" ? " รายการ" : " List"));

        if (paramInUrl.apiName === "ReviewTips") {

            SEARCH_RESULT_LIST = data.trips === null ? [] : data.trips;
            RAW_SEARCH_RESULT_LIST = data.trips === null ? [] : data.trips;
            MAX_SHOW_SIZE = data.trips === null ? 0 : data.trips.length;
        } else if (paramInUrl.apiName === "ReviewNearbyAttactions") {

            SEARCH_RESULT_LIST = data.attactions === null ? [] : data.attactions;
            RAW_SEARCH_RESULT_LIST = data.attactions === null ? [] : data.attactions;
            MAX_SHOW_SIZE = data.attactions === null ? 0 : data.attactions.length;
        } else if (paramInUrl.apiName === "ReviewEvents") {

            SEARCH_RESULT_LIST = data.events === null ? [] : data.events;
            RAW_SEARCH_RESULT_LIST = data.events === null ? [] : data.events;
            MAX_SHOW_SIZE = data.events === null ? 0 : data.events.length;
        } else if (paramInUrl.apiName === "ReviewArticles") {

            SEARCH_RESULT_LIST = data.blogs === null ? [] : data.blogs;
            RAW_SEARCH_RESULT_LIST = data.blogs === null ? [] : data.blogs;
            MAX_SHOW_SIZE = data.blogs === null ? 0 : data.blogs.length;
        } else if (paramInUrl.apiName === "InterestingLandmark") {

            SEARCH_RESULT_LIST = data.landmarks === null ? [] : data.landmarks;
            RAW_SEARCH_RESULT_LIST = data.landmarks === null ? [] : data.landmarks;
            MAX_SHOW_SIZE = data.landmarks === null ? 0 : data.landmarks.length;
        } else if (paramInUrl.apiName === "NearbyAttactions") {

            SEARCH_RESULT_LIST = data.attactions === null ? [] : data.attactions;
            RAW_SEARCH_RESULT_LIST = data.attactions === null ? [] : data.attactions;
            MAX_SHOW_SIZE = data.attactions === null ? 0 : data.attactions.length;
        } else if (paramInUrl.apiName === "InterestingEvents") {

            SEARCH_RESULT_LIST = data.events === null ? [] : data.events;
            RAW_SEARCH_RESULT_LIST = data.events === null ? [] : data.events;
            MAX_SHOW_SIZE = data.events === null ? 0 : data.events.length;
        } else if (paramInUrl.apiName === "InterestingTips") {

            SEARCH_RESULT_LIST = data.trips === null ? [] : data.trips;
            RAW_SEARCH_RESULT_LIST = data.trips === null ? [] : data.trips;
            MAX_SHOW_SIZE = data.trips === null ? 0 : data.trips.length;
        }


        SHOW_SIZE = COUNT_SHOW_SIZE;
        genSizeShowContentSearchDetail();

        $('html, body').animate({
            scrollTop: 0
        }, 500);
    }

    requestService(SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + "FirstPage/" + paramInUrl.apiName, "GET", param, dooSuccess);
}

function requestServiceSearchTipsResult() {

    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {

        var eventResultList = res.data.trips === undefined ? [] : res.data.trips === null ? [] : res.data.trips;
        var rawEventResultList = [];

        for (var i = 0; i < eventResultList.length; i++) {

            if (i <= 2) {
                rawEventResultList.push({
                    ...eventResultList[i],
                    event_id: eventResultList[i].id[PAGE_LANGUAGE],
                    event_name: eventResultList[i].name[PAGE_LANGUAGE],
                    location: eventResultList[i].address,
                    description: eventResultList[i].content,
                    ratings: eventResultList[i].ratings,
                    reviews: eventResultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                    thumbnail: eventResultList[i].thumbnail,
                    icon: eventResultList[i].icon,
                });
            } else {
                break;
            }
        }

        if (rawEventResultList.length === 0) {
            document.getElementById("main-content-recommend-search-tips").setAttribute("style", "display: none");
        }
        var templateRecommendEvent = $("#content-recommend-search-tips").html();
        $("#content-recommend-search-tips").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

        for (var i = 0; i < eventResultList.length; i++) {
            if (i <= 2) {
                var templateScore = $(".content-recommend-ratings-tips-" + eventResultList[i].id[PAGE_LANGUAGE]);
                var score = templateScore.data("start");
                var iconStartSelect = '<i class="fa fa-star"></i>';
                var iconStartNone = '<i class="fa fa-star-o"></i>';
                for (var n = 5; n >= 1; n--) {
                    if (n <= score) {
                        templateScore.prepend(iconStartSelect);
                    } else {
                        templateScore.prepend(iconStartNone);
                    }
                }
            } else {
                break;
            }
        }
    }

    requestService(URL_SEARCH_TIPS_RESULT, "GET", param, dooSuccess);
}

function requestServiceSearchArticleResult() {

    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {

        var eventResultList = res.data.blogs === undefined ? [] : res.data.blogs;

        if (!eventResultList || eventResultList.length === 0) {
            $("#main-content-recommend-search-article").css("display", "none")
        } else {
            var rawEventResultList = [];

            for (var i = 0; i < eventResultList.length; i++) {
                if (i <= 2) {
                    rawEventResultList.push({
                        ...eventResultList[i],
                        event_id: eventResultList[i].blog_id[PAGE_LANGUAGE],
                        event_name: eventResultList[i].subject,
                        location: eventResultList[i].address,
                        description: eventResultList[i].content,
                        ratings: eventResultList[i].ratings,
                        reviews: eventResultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                        thumbnail: eventResultList[i].thumbnail,
                        icon: eventResultList[i].icon,

                        slug: eventResultList[i].slug[PAGE_LANGUAGE],
                    });
                } else {
                    break;
                }
            }

            var templateRecommendEvent = $("#content-recommend-search-article").html();
            $("#content-recommend-search-article").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

            for (var i = 0; i < eventResultList.length; i++) {

                if (i <= 2) {
                    var templateScore = $(".content-recommend-ratings-article-" + eventResultList[i].blog_id[PAGE_LANGUAGE]);
                    var score = templateScore.data("start");
                    var iconStartSelect = '<i class="fa fa-star"></i>';
                    var iconStartNone = '<i class="fa fa-star-o"></i>';
                    for (var n = 5; n >= 1; n--) {
                        if (n <= score) {
                            templateScore.prepend(iconStartSelect);
                        } else {
                            templateScore.prepend(iconStartNone);
                        }
                    }
                } else {
                    break;
                }
            }
        }

    }

    requestService(URL_SEARCH_ARTICLE_RESULT, "GET", param, dooSuccess);
}

function clickBtnSearchBar(category_id) {
    if (category_id == undefined) {

        var param = {
            text: $("#txt-search-bar").val(),
            category_id: $("#select-search-bar").val(),
        };
    } else {
        var param = {
            category_id: category_id
        };
    }
    window.location.href = "./search-event.html?" + convertJsonToParameterURL(param);
}