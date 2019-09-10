var DATA_CATEGORYS = [];

$(function () {
    'use strict';
    $(window).on('load', function () {
        requestServiceInterestingCategorys();
    })
})

function requestServiceInterestingCategorys() {
    requestService(URL_INTERSTING_CATEGORYS, "GET", null, function (res) {

        for (var i = 0; i < res.data.categorys.length; i++) {
            DATA_CATEGORYS.push({
                categoryName: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                categoryNameDisplay: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                categoryNameValue: res.data.categorys[i].service_id,
                // categoryUrlImage: res.data.categorys[i].image,
                categoryUrlImage: "http://placehold.it/460x481",
                categoryUrlIcon: res.data.categorys[i].icon
            });
        }

        var templateCategoryMenu = $("#index-category-menu").html();
        $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));



        loadMainModalFavorite();
        closeLoading();
    });
}

function clickMenuTypeHeader(category_id) {
    var param = {
        category_id: category_id
    };

    window.location.href = "./search.html?" + convertJsonToParameterURL(param);
}