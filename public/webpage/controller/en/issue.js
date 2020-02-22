var DATA_CATEGORYS = [];

$(function () {
    'use strict';
    $(window).on('load', function () {
        requestServiceInterestingCategorys();
    })
})

function requestServiceInterestingCategorys() {
    requestService(URL_INTERSTING_CATEGORYS, "GET", {"lang" : window.location.href.split(window.location.hostname + (window.location.port != "" ? ":" + window.location.port : "") + "/")[1].split("/")[0]}, function (res) {

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
        $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));

                if ((window.location.href.indexOf("search.html?category_id")) >= 0) {
                    $('#label-page-categories').css("font-weight", "bold");
                    $('#label-page-categories').css("color", "rgb(240, 24, 34)");
        
        
                    $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("font-weight", "bold");
                    $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("color", "rgb(240, 24, 34)");
                }



        loadMainModalFavorite();
        closeLoading();
    });
}

