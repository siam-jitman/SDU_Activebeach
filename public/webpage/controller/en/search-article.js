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

        $("#viewSearchType").load("../template/en/search/list-search.html");
        $("#btnListView").addClass("active-view-btn");



        openLoading();

        $("#btnListView").on('click', function () {
            $("#viewSearchType").load("../template/en/search/list-search.html", function () {
                genSizeShowContentSearchDetail();
            });
            $("#btnListView").addClass("active-view-btn");
            $("#btnGridView").removeClass("active-view-btn");

        });

        $("#btnGridView").on('click', function () {
            $("#viewSearchType").load("../template/en/search/grid-search.html", function () {
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

        $("#btn-view-event").on('click', function () {
            var param = {
                text: $("#txt-search-bar").val(),
                category_id: $("#select-search-bar").val()
            };
            window.location.href = "./search-event.html?" + convertJsonToParameterURL(param);
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
    window.location.href = "./blog.html?" + convertJsonToParameterURL(param);
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
        rawResult.meta_id = dataList[i].blog_id[PAGE_LANGUAGE];
        // rawResult.meta_id = dataList[i].blog_scope;
        rawResult.thumbnail = dataList[i].thumbnail;
        rawResult.companyName = checkFieldForLanguageNull(dataList[i].subject);
        rawResult.location = dataList[i].address;
        rawResult.description = dataList[i].content;
        rawResult.reviews = dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " Reviews" : "");
        rawResult.ratings = dataList[i].ratings;
        rawResult.slug = dataList[i].slug[PAGE_LANGUAGE];

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
        var templateScore = $(".score-reviews-attaction-" + (dataList[i].meta_id == undefined ? dataList[i].blog_id[PAGE_LANGUAGE] : dataList[i].meta_id));
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
        $("#result-search-listing").append("<center><h2>Data not found</h2></center>");
    }
    closeLoading();
}

function requestServiceInterestingCategorys() {
    requestService(URL_INTERSTING_CATEGORYS, "GET", null, function (res) {

        for (var i = 0; i < res.data.categorys.length; i++) {
            DATA_CATEGORYS.push({
                categoryName: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                categoryNameDisplay: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                categoryNameValue: res.data.categorys[i].service_id,
                categoryUrlImage: res.data.categorys[i].thumbnail,
                categoryUrlIcon: res.data.categorys[i].icon
            });
        }

        var templateCategoryMenu = $("#index-category-menu").html();
        var templateCategorySearchBar = $("#select-search-bar").html();
        $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));
        $("#select-search-bar").html(bindDataListToTemplate(templateCategorySearchBar, [{
            categoryNameDisplay: "Choose a category",
            categoryNameValue: ""
        }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));
        $("#txt-search-bar").val(DATA_PARAM_IN_URL["text"]);
        $("#select-search-bar").val(DATA_PARAM_IN_URL["category_id"] == undefined ? DATA_PARAM_IN_URL["category_id"] : DATA_PARAM_IN_URL["category_id"]);

        var templateCategorySelectMobile = $("#index-category-select-mobile").html();
        $("#index-category-select-mobile").html(bindDataListToTemplate(templateCategorySelectMobile, [{
            categoryNameDisplay: "Choose a category",
            categoryNameValue: ""
        }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));

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
                    reviews: eventResultList[i].reviews + (PAGE_LANGUAGE == "en" ? " List" : ""),
                    thumbnail: eventResultList[i].thumbnail,
                    icon: eventResultList[i].icon,

                    category_name: eventResultList[i].service_name[PAGE_LANGUAGE],
                    company_name: eventResultList[i].title[PAGE_LANGUAGE],
                    meta_id: eventResultList[i].meta_id,
                    company_id: eventResultList[i].company_id[PAGE_LANGUAGE],
                    category_id: eventResultList[i].service_id,
                    lang: PAGE_LANGUAGE,
                });
            } else {
                break;
            }
        }

        var templateRecommendEvent = $("#content-recommend-search-event").html();
        $("#content-recommend-search-event").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

        for (var i = 0; i < eventResultList.length; i++) {
            if (i <= 2) {
                var templateScore = $(".content-recommend-ratings-event-" + i);
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

    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,

    }


    var dooSuccess = function (res) {
        //close loading

        var data = res.data;

        if ($("#txt-search-bar").val() == "") {
            $("#lable-sum-search-page").css({
                "display": "none"
            })
            if ($("#select-search-bar").val() != "") {
                $("#lable-sum-search-type-all").css({
                    "display": "block"
                })
                for (var i = 0; i < DATA_CATEGORYS.length; i++) {
                    if (DATA_CATEGORYS[i].categoryNameValue == $("#select-search-bar").val()) {
                        $("#lable-search-type-all").html(DATA_CATEGORYS[i].categoryNameDisplay)
                        break;
                    }
                }
            } else {
                $("#lable-sum-search-type-all").css({
                    "display": "none"
                })
            }
        } else {
            $("#lable-sum-search-page").css({
                "display": "block"
            })
            $("#lable-sum-search-type-all").css({
                "display": "none"
            })
            $("#lable-search-page").html($("#txt-search-bar").val())

        }
        $("#lable-search-count").html(data.count + (PAGE_LANGUAGE == "en" ? " List" : ""));
        $("#lable-search-type-all-count").html(data.count + (PAGE_LANGUAGE == "en" ? " List" : ""));

        SEARCH_RESULT_LIST = data.blogs === null ? [] : data.blogs;
        RAW_SEARCH_RESULT_LIST = data.blogs === null ? [] : data.blogs;
        MAX_SHOW_SIZE = data.blogs === null ? 0 : data.blogs.length;

        SHOW_SIZE = COUNT_SHOW_SIZE;
        genSizeShowContentSearchDetail();

        $('html, body').animate({
            scrollTop: 0
        }, 500);
    }

    requestService(URL_SEARCH_ARTICLE_RESULT, "GET", param, dooSuccess);
}

function requestServiceSearchTipsResult() {

    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {

        var eventResultList = res.data.events === null ? [] : res.data.events;
        var rawEventResultList = [];

        for (var i = 0; i < eventResultList.length; i++) {
            rawEventResultList.push({
                ...eventResultList[i],
                event_id: eventResultList[i].event_id,
                event_name: eventResultList[i].event_name[PAGE_LANGUAGE],
                location: eventResultList[i].address,
                description: eventResultList[i].description,
                ratings: eventResultList[i].ratings,
                reviews: eventResultList[i].reviews + (PAGE_LANGUAGE == "en" ? " List" : ""),
                thumbnail: eventResultList[i].thumbnail,
                icon: eventResultList[i].icon,
            });
        }

        var templateRecommendEvent = $("#content-recommend-search-tips").html();
        $("#content-recommend-search-tips").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

        for (var i = 0; i < eventResultList.length; i++) {
            if (i <= 2) {
                var templateScore = $(".content-recommend-ratings-tips-" + i);
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

    requestService(URL_SEARCH_EVENT_RESULT, "GET", param, dooSuccess);
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

            var templateRecommendEvent = $("#content-recommend-search-article").html();
            $("#content-recommend-search-article").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

            for (var i = 0; i < eventResultList.length; i++) {
                if (i <= 2) {
                    var templateScore = $(".content-recommend-ratings-article-" + eventResultList[i].id[PAGE_LANGUAGE]);
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

    requestService(URL_SEARCH_TIPS_RESULT, "GET", param, dooSuccess);
}

function clickBtnSearchBar(category_id) {
    if (category_id == undefined) {

        var param = {
            text: window.innerWidth <= 992 ? $("#index-txt-search-mobile").val() : $("#index-txt-search").val(),
            category_id: window.innerWidth <= 992 ? $("#index-category-select-mobile").val() : $("#index-category-select").val(),
        };
    } else {
        var param = {
            category_id: category_id
        };
    }
    window.location.href = "./search-article.html?" + convertJsonToParameterURL(param);
}