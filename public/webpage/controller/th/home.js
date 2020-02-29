var DATA_HOME_RECOMMEND_LANDMARK = []
var DATA_HOME_RECOMMEND_ATTACTIONS = []

$(function () {
    'use strict';
    $(window).on('load', function () {

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

                    // categoryUrlIcon: res.data.categorys[i].icon
                    categoryUrlIcon: res.data.categorys[i].icon
                });
            }

            var templateCategoryMenu = $("#index-category-menu").html();

            var templateCategorySelect = $("#select-search-bar").html();
            var templateCategoryFirst = $("#index-category-first").html();
            var templateCategoryContent = $("#index-category-content").html();



            $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));

            if ((window.location.href.indexOf("search.html?category_id")) >= 0) {
                $('#label-page-categories').css("font-weight", "bold");
                $('#label-page-categories').css("color", "rgb(240, 24, 34)");


                $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("font-weight", "bold");
                $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("color", "rgb(240, 24, 34)");
            }
            $("#select-search-bar").html(bindDataListToTemplate(templateCategorySelect, [{
                categoryNameDisplay: "เลือกหมวดหมู่ที่ต้องการ",
                categoryNameValue: ""
            }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));
            $("#index-category-first").html(bindDataToTemplate(templateCategoryFirst, JSON.parse(JSON.stringify(DATA_CATEGORYS[0]))));

            var templateCategorySelectMobile = $("#index-category-select-mobile").html();
            $("#index-category-select-mobile").html(bindDataListToTemplate(templateCategorySelectMobile, [{
                categoryNameDisplay: "เลือกหมวดหมู่ที่ต้องการ",
                categoryNameValue: ""
            }].concat(JSON.parse(JSON.stringify(DATA_CATEGORYS)))));

            loadMainModalFavorite();

            // console.log("DATA_CATEGORYS", DATA_CATEGORYS);
            var dataCategoryContent = JSON.parse(JSON.stringify(DATA_CATEGORYS));
            dataCategoryContent.splice(0, 1);
            if (dataCategoryContent.length > 4) {
                dataCategoryContent.length = 4;
            }

            // for (var i = 0; i < dataCategoryContent.length; i++) {
            //     dataCategoryContent.splice
            // }

            // console.log("dataCategoryContent", dataCategoryContent);

            $("#index-category-content").html(bindDataListToTemplate(templateCategoryContent, dataCategoryContent));

            $('.selectpicker').selectpicker("refresh");
        });

        requestService(URL_INTERSTING_LANDMARK, "GET", {
            lang: PAGE_LANGUAGE
        }, function (res) {
            var dataList = res.data.landmarks;
            DATA_HOME_RECOMMEND_LANDMARK = []
            DATA_HOME_RECOMMEND_ATTACTIONS = []
            for (var i = 0; i < dataList.length; i++) {

                if (dataList[i].title) {
                    if (dataList[i].title[PAGE_LANGUAGE]) {
                        var title = dataList[i].title[PAGE_LANGUAGE];
                    } else {
                        var title = dataList[i].title;
                    }
                } else {
                    var title = "";
                }

                if (title == "") {
                    var title = "&nbsp;";
                }

                DATA_HOME_RECOMMEND_LANDMARK.push({
                    "company_id": dataList[i].company_id == undefined ? "" : dataList[i].company_id[PAGE_LANGUAGE] == undefined ? dataList[i].company_id : dataList[i].company_id[PAGE_LANGUAGE],
                    // "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "title": title,
                    "address": dataList[i].address,
                    "image": dataList[i].thumbnail,
                    "icon": dataList[i].icon,
                    "content": dataList[i].content,
                    "ratings": dataList[i].ratings,
                    "comments": dataList[i].comments,
                    "reviews": dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                    "viewer": dataList[i].viewer,
                    "show_content": dataList[i].show_content ? "block" : "none",
                    "service_id": dataList[i].service_id,
                    "service_name": dataList[i].service_name[PAGE_LANGUAGE],
                });
            }

            var templateSlideRrecommendLandmark = $("#index-slide-recommend-landmark").html();

            $("#index-slide-recommend-landmark").html(bindDataListToTemplate(templateSlideRrecommendLandmark, DATA_HOME_RECOMMEND_LANDMARK));
            createSlick("#index-slide-recommend-landmark");

            for (var i = 0; i < dataList.length; i++) {
                var templateScore = $(".score-reviews-landmark-" + (dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id));
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

        });

        requestService(URL_NEAR_BY_ATTACTIONS, "GET", {
            lang: PAGE_LANGUAGE
        }, function (res) {

            var dataList = res.data.attactions;
            DATA_HOME_RECOMMEND_LANDMARK = []
            DATA_HOME_RECOMMEND_ATTACTIONS = []
            for (var i = 0; i < dataList.length; i++) {
                if (dataList[i].title) {
                    if (dataList[i].title[PAGE_LANGUAGE]) {
                        var title = dataList[i].title[PAGE_LANGUAGE];
                    } else {
                        var title = dataList[i].title;
                    }
                } else {
                    var title = "";
                }

                if (title == "") {
                    var title = "&nbsp;";
                }
                DATA_HOME_RECOMMEND_ATTACTIONS.push({
                    "company_id": dataList[i].company_id == undefined ? "" : dataList[i].company_id[PAGE_LANGUAGE] == undefined ? dataList[i].company_id : dataList[i].company_id[PAGE_LANGUAGE],
                    // "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "title": title,
                    "address": dataList[i].address,
                    "image": dataList[i].thumbnail,
                    "icon": dataList[i].icon,
                    "content": dataList[i].content,
                    "ratings": dataList[i].ratings,
                    "comments": dataList[i].comments,
                    "reviews": dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                    "viewer": dataList[i].viewer,
                    "show_content": dataList[i].show_content ? "block" : "none",
                    "service_id": dataList[i].service_id,
                    "service_name": dataList[i].service_name[PAGE_LANGUAGE],
                });
            }

            var templateSlideRrecommendAttaction = $("#index-slide-recommend-attaction").html();

            $("#index-slide-recommend-attaction").html(bindDataListToTemplate(templateSlideRrecommendAttaction, DATA_HOME_RECOMMEND_ATTACTIONS));
            createSlick("#index-slide-recommend-attaction");

            for (var i = 0; i < dataList.length; i++) {
                var templateScore = $(".score-reviews-attaction-" + (dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id));
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
        });

        requestService(URL_INTERSTING_EVENTS, "GET", {
            lang: PAGE_LANGUAGE
        }, function (res) {

            var dataList = res.data.events;
            DATA_HOME_RECOMMEND_LANDMARK = []
            DATA_HOME_RECOMMEND_ATTACTIONS = []
            for (var i = 0; i < dataList.length; i++) {
                if (dataList[i].name) {
                    if (dataList[i].name[PAGE_LANGUAGE]) {
                        var title = dataList[i].name[PAGE_LANGUAGE];
                    } else {
                        var title = dataList[i].name;
                    }
                } else {
                    var title = "";
                }

                if (title == "") {
                    var title = "&nbsp;";
                }
                DATA_HOME_RECOMMEND_ATTACTIONS.push({
                    "company_id": dataList[i].id[PAGE_LANGUAGE],
                    // "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "title": title,
                    "address": dataList[i].address,
                    "image": dataList[i].thumbnail,
                    "icon": dataList[i].icon,
                    "content": dataList[i].content,
                    "ratings": dataList[i].ratings,
                    "comments": dataList[i].comments,
                    "reviews": dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                    "viewer": dataList[i].viewer,
                    "show_content": dataList[i].show_content ? "block" : "none",
                    "service_id": dataList[i].service_id,
                    "service_name": dataList[i].service_name[PAGE_LANGUAGE],
                });
            }

            var templateSlideRrecommendAttaction = $("#index-slide-recommend-event").html();

            $("#index-slide-recommend-event").html(bindDataListToTemplate(templateSlideRrecommendAttaction, DATA_HOME_RECOMMEND_ATTACTIONS));
            createSlick("#index-slide-recommend-event");

            for (var i = 0; i < dataList.length; i++) {
                var templateScore = $(".score-reviews-event-" + (dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id));
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
        });

        requestService(URL_INTERSTING_TIPS, "GET", {
            lang: PAGE_LANGUAGE
        }, function (res) {

            var dataList = res.data.trips;
            DATA_HOME_RECOMMEND_LANDMARK = []
            DATA_HOME_RECOMMEND_ATTACTIONS = []
            for (var i = 0; i < dataList.length; i++) {
                if (dataList[i].name) {
                    if (dataList[i].name[PAGE_LANGUAGE]) {
                        var title = dataList[i].name[PAGE_LANGUAGE];
                    } else {
                        var title = dataList[i].name;
                    }
                } else {
                    var title = "";
                }

                if (title == "") {
                    var title = "&nbsp;";
                }

                console.log("dataList[i].id", dataList[i].id)
                DATA_HOME_RECOMMEND_ATTACTIONS.push({

                    "company_id": dataList[i].id[PAGE_LANGUAGE],
                    // "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "meta_id": dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id,
                    "title": title,
                    "address": dataList[i].address,
                    "image": dataList[i].thumbnail,
                    "icon": dataList[i].icon,
                    "content": dataList[i].content,
                    "ratings": dataList[i].ratings,
                    "comments": dataList[i].comments,
                    "reviews": dataList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews"),
                    "viewer": dataList[i].viewer,

                    "show_content": dataList[i].show_content ? "block" : "none",
                    "service_id": dataList[i].service_id,
                    "service_name": dataList[i].service_name[PAGE_LANGUAGE],
                });
            }


            console.log("DATA_HOME_RECOMMEND_ATTACTIONS", DATA_HOME_RECOMMEND_ATTACTIONS)

            var templateSlideRrecommendAttaction = $("#index-slide-recommend-tip").html();

            $("#index-slide-recommend-tip").html(bindDataListToTemplate(templateSlideRrecommendAttaction, DATA_HOME_RECOMMEND_ATTACTIONS));
            createSlick("#index-slide-recommend-tip");

            for (var i = 0; i < dataList.length; i++) {
                var templateScore = $(".score-reviews-tip-" + (dataList[i].meta_id == undefined ? dataList[i].id[PAGE_LANGUAGE] : dataList[i].meta_id));
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
        });

        //close loading
        closeLoading();
    })
});

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
    window.location.href = "./search.html?" + convertJsonToParameterURL(param);
}

function clickBtnToDetailRecommend(meta_id, company_id, title, service_id, service_name) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    var param = {
        category_name: service_name,
        company_name: title,
        meta_id: meta_id,
        company_id: company_id,
        category_id: service_id,
        lang: PAGE_LANGUAGE
    };
    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
    //     }
    // }
}