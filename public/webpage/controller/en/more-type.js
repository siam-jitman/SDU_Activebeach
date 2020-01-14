var TAG = "[search.js]"
var DATA_CATEGORYS = [];
var SEARCH_RESULT_LIST = [];
var RAW_SEARCH_RESULT_LIST = [];
var COUNT_SHOW_SIZE = 10;
var SHOW_SIZE = 10;
var MAX_SHOW_SIZE = 10;
var CURRENT_PAGE = 1;
var scroll = 0

$(function () {
    'use strict';
    $(window).on('load', function () {

        $("#viewSearchType").load("../template/th/search/grid-search.html");
        $("#btnGridView").addClass("active-view-btn");



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

        //$("#loadContentSearchMore").on('click', function () {
        //            scroll = $("body").scrollTop();
        //            console.log("loadContentSearchMore", scroll)
        //            requestServiceSearchEventResult(true);
        //        });

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

        $("#btn-view-article").on('click', function () {
            var param = {
                text: $("#txt-search-bar").val(),
                category_id: $("#select-search-bar").val()
            };
            window.location.href = "./search-article.html?" + convertJsonToParameterURL(param);

        });

        requestServiceInterestingCategorys();


        $("body").scrollTop();
    });
});

function clickBtnToDetail(id) {

    console.log(id);
    for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
        if (SEARCH_RESULT_LIST[i].meta_id == id) {
            var param = {
                category_name: SEARCH_RESULT_LIST[i].service_name[PAGE_LANGUAGE],
                company_name: SEARCH_RESULT_LIST[i].title[PAGE_LANGUAGE],
                meta_id: SEARCH_RESULT_LIST[i].meta_id,
                company_id: SEARCH_RESULT_LIST[i].company_id[PAGE_LANGUAGE],
                category_id: SEARCH_RESULT_LIST[i].service_id,
                lang: PAGE_LANGUAGE
            };

            if (typeof SEARCH_RESULT_LIST[i].service_name === "object") {
                param.category_name = SEARCH_RESULT_LIST[i].service_name[PAGE_LANGUAGE];
            } else {
                param.category_name = SEARCH_RESULT_LIST[i].service_name;
            }

            window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
        }
    }

}

function genSizeShowContentSearchDetail(nextMore) {
    //    if (nextMore) {
    //        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    //    }
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

function clickLoadContentSearchMore() {
    scroll = window.scrollY;
    console.log("loadContentSearchMore => ", scroll)
    requestServiceSearchEventResult(true);
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
        icon: ""
    }

    var rawResultArray = [];

    for (var i = 0; i < dataList.length; i++) {
        rawResult = JSON.parse(JSON.stringify(dataList[i]));
        rawResult.meta_id = dataList[i].service_id;
        rawResult.companyName = checkFieldForLanguageNull(dataList[i].service_name);
        rawResult.thumbnail = dataList[i].thumbnail == "" ? rawResult.thumbnail : dataList[i].thumbnail;

        rawResultArray.push(rawResult)
    }

    // setTimeout(function () {
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

    if (rawResultArray.length === 0) {
        $("#result-search-listing").append("<center><h2>ไม่พบข้อมูล</h2></center>");
    }

    closeLoading();
    // }, 2000);
}

function requestSearchResult() {

    openLoading();


    var paramInUrl = convertParameterURLToJson();

    var param = {
        company_id: paramInUrl.company_id,
        category_id: paramInUrl.category_id,
        meta_id: paramInUrl.meta_id,
        category_name: paramInUrl.category_name,
        company_name: paramInUrl.company_name,
        lang: PAGE_LANGUAGE,
        // lang:paramInUrl.lang,
    }

    var dooSuccess = function (res) {
        //close loading

        var data = res.data;

        // $("#lable-search-type-all").html(data.title + ' "<span>' + DATA_PARAM_IN_URL.company_name + '</span>" ');
        $("#lable-search-type-all-count").html(data.total + (PAGE_LANGUAGE == "th" ? " รายการ" : " List"));


        SEARCH_RESULT_LIST = data.categorys === null ? [] : data.categorys;
        RAW_SEARCH_RESULT_LIST = data.categorys === null ? [] : data.categorys;
        MAX_SHOW_SIZE = data.categorys === null ? 0 : data.categorys.length;

        //SHOW_SIZE = COUNT_SHOW_SIZE;
        if (nextMore) {
            genSizeShowContentSearchDetail()
        } else {
            genSizeShowContentSearchDetail();
        }

        //$('html, body').animate({
        //            scrollTop: 0
        //        }, 500);
    }

    requestService(SERVICE_HOST + SERVICE_CONTEXT + SERVICE_VERSION + paramInUrl.endpoint + "/" + paramInUrl.apiName, "GET", param, dooSuccess);
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
        $("#txt-search-bar").val(DATA_PARAM_IN_URL["company_name"]);
        $("#select-search-bar").val(DATA_PARAM_IN_URL["category_id"] == undefined ? DATA_PARAM_IN_URL["category_id"] : DATA_PARAM_IN_URL["category_id"]);


        $('.selectpicker').selectpicker("refresh");

        loadMainModalFavorite();
        requestSearchResult();
        requestServiceSearchEventResult();
        requestServiceSearchTipsResult();
        requestServiceSearchArticleResult();
    });
}

function requestServiceSearchEventResult(nextMore) {
    if (nextMore) {
        CURRENT_PAGE = CURRENT_PAGE + 1;
        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    }
    openLoading();
    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,
        page: CURRENT_PAGE,
        page_size: 10,

    }

    var dooSuccess = function (res) {

        var eventResultList = res.data.events === undefined ? [] : res.data.events === null ? [] : res.data.events;
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
            document.getElementById("main-content-recommend-search-event").setAttribute("style", "display: none");
        }
        var templateRecommendEvent = $("#content-recommend-search-event").html();

        $("#content-recommend-search-event").html(bindDataListToTemplate(templateRecommendEvent, rawEventResultList));

        for (var i = 0; i < eventResultList.length; i++) {
            if (i <= 2) {
                var templateScore = $(".content-recommend-ratings-event-" + eventResultList[i].id[PAGE_LANGUAGE]);
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

function requestServiceSearchTipsResult(nextMore) {
    if (nextMore) {
        CURRENT_PAGE = CURRENT_PAGE + 1;
        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    }
    openLoading();
    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,
        page: CURRENT_PAGE,
        page_size: 10,

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

function requestServiceSearchArticleResult(nextMore) {
    if (nextMore) {
        CURRENT_PAGE = CURRENT_PAGE + 1;
        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    }
    openLoading();
    var param = {
        q: $("#txt-search-bar").val(),
        order: $("#select-sort-bar").val() == "" ? "asc" : $("#select-sort-bar").val(),
        category_id: $("#select-search-bar").val(),
        lang: PAGE_LANGUAGE,
        page: CURRENT_PAGE,
        page_size: 10,

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
                        slug: eventResultList[i].slug[PAGE_LANGUAGE],
                        icon: eventResultList[i].icon
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
    window.location.href = "./search.html?" + convertJsonToParameterURL(param);
}