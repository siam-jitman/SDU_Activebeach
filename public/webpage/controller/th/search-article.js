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
        slug: ''
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
        rawResult.reviews = dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews");
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
        var templateScore = $(".score-reviews-attaction-" + dataList[i].blog_id[PAGE_LANGUAGE]);
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
    //if (scroll != 0) {
    //        console.log("window.scrollTo(0, scroll)")
    //        setTimeout(function () {
    //            window.scrollTo(0, scroll);
    //        }, 1000)
    //    }
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

        if ((window.location.href.indexOf("search.html?category_id")) >= 0) {
            $('#label-page-categories').css("font-weight", "bold");
            $('#label-page-categories').css("color", "rgb(240, 24, 34)");


            $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("font-weight", "bold");
            $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("color", "rgb(240, 24, 34)");
        }
        $("#select-search-bar").html(bindDataListToTemplate(templateCategorySearchBar, [{
            categoryNameDisplay: "เลือกหมวดหมู่ที่ต้องการ",
            categoryNameValue: ""
        }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));
        $("#txt-search-bar").val(DATA_PARAM_IN_URL["text"]);
        $("#select-search-bar").val(DATA_PARAM_IN_URL["category_id"] == undefined ? DATA_PARAM_IN_URL["category_id"] : DATA_PARAM_IN_URL["category_id"]);

        var templateCategorySelectMobile = $("#index-category-select-mobile").html();
        $("#index-category-select-mobile").html(bindDataListToTemplate(templateCategorySelectMobile, [{
            categoryNameDisplay: "เลือกหมวดหมู่ที่ต้องการ",
            categoryNameValue: ""
        }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));
        $("#index-txt-search-mobile").val(DATA_PARAM_IN_URL["text"]);
        $("#index-category-select-mobile").val(DATA_PARAM_IN_URL["category_id"] == undefined ? DATA_PARAM_IN_URL["category_id"] : DATA_PARAM_IN_URL["category_id"]);

        $('.selectpicker').selectpicker("refresh");


        loadMainModalFavorite();
        requestServiceSearchEventResult();
        requestSearchResult();
        requestServiceSearchTipsResult();
        requestServiceSearchArticleResult();
    });
}


function requestSearchResult(nextMore) {
    if (nextMore) {
        CURRENT_PAGE = CURRENT_PAGE + 1;
        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    } else {
        COUNT_SHOW_SIZE = 10;
        SHOW_SIZE = 10;
        MAX_SHOW_SIZE = 10;
        CURRENT_PAGE = 1;
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
                    lang: PAGE_LANGUAGE,
                    show_content: eventResultList[i].show_content ? "block" : "none",
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

function requestServiceSearchEventResult(nextMore) {
    if (nextMore) {
        CURRENT_PAGE = CURRENT_PAGE + 1;
        SHOW_SIZE = SHOW_SIZE + COUNT_SHOW_SIZE;
    } else {
        COUNT_SHOW_SIZE = 10;
        SHOW_SIZE = 10;
        MAX_SHOW_SIZE = 10;
        CURRENT_PAGE = 1;
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
        $("#lable-search-count").html(data.total + (PAGE_LANGUAGE == "th" ? " รายการ" : " List"));
        $("#lable-search-type-all-count").html(data.total + (PAGE_LANGUAGE == "th" ? " รายการ" : " List"));

        SEARCH_RESULT_LIST = data.blogs === null ? SEARCH_RESULT_LIST.concat([]) : SEARCH_RESULT_LIST.concat(data.blogs);
        RAW_SEARCH_RESULT_LIST = data.blogs === null ? RAW_SEARCH_RESULT_LIST.concat([]) : RAW_SEARCH_RESULT_LIST.concat(data.blogs);
        MAX_SHOW_SIZE = data.total

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

    requestService(URL_SEARCH_ARTICLE_RESULT, "GET", param, dooSuccess);
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

        var eventResultList = res.data.events === undefined ? [] : res.data.events === null ? [] : res.data.events;
        var rawEventResultList = [];

        for (var i = 0; i < eventResultList.length; i++) {
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

    requestService(URL_SEARCH_EVENT_RESULT, "GET", param, dooSuccess);
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
        var eventResultList = [];
        eventResultList = res.data.blogs === undefined ? [] : res.data.blogs;
        console.log(eventResultList)
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
            text: window.innerWidth <= 992 ? $("#index-txt-search-mobile").val() : $("#txt-search-bar").val(),
            category_id: window.innerWidth <= 992 ? $("#index-category-select-mobile").val() : $("#select-search-bar").val(),
        };
    } else {
        var param = {
            category_id: category_id
        };
    }
    window.location.href = "./search-article.html?" + convertJsonToParameterURL(param);
}