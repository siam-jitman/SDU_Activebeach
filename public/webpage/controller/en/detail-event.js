var DATA_CATEGORYS = [];

$(function () {
    'use strict';
    $(window).on('load', function () {

        var captionsEN = {
            button: function (options) {
                return 'Browse ' + (options.limit == 1 ? 'file' : 'files');
            },
            feedback: function (options) {
                return 'Choose ' + (options.limit == 1 ? 'file' : 'files') + ' to upload';
            },
            feedback2: function (options) {
                return options.length + ' ' + (options.length > 1 ? ' files were' : ' file was') + ' chosen';
            },
            confirm: 'Confirm',
            cancel: 'Cancel',
            name: 'Name',
            type: 'Type',
            size: 'Size',
            dimensions: 'Dimensions',
            duration: 'Duration',
            crop: 'Crop',
            rotate: 'Rotate',
            sort: 'Sort',
            download: 'Download',
            remove: 'Remove',
            drop: 'Drop the files here to Upload',
            paste: '<div class="fileuploader-pending-loader"></div> Pasting a file, click here to cancel.',
            removeConfirmation: 'Are you sure you want to remove this file?',
            errors: {
                filesLimit: 'Only ${limit} files are allowed to be uploaded.',
                filesType: 'Only ${extensions} files are allowed to be uploaded.',
                fileSize: '${name} is too large! Please choose a file up to ${fileMaxSize}MB.',
                filesSizeAll: 'Files that you chose are too large! Please upload files up to ${maxSize} MB.',
                fileName: 'File with the name ${name} is already selected.',
                folderUpload: 'You are not allowed to upload folders.'
            }
        }
        var captionsTH = {
            button: function (options) {
                return 'Upload image';
            },
            feedback: function (options) {
                return 'Upload image';
            },
            feedback2: function (options) {
                return (options.length > 1 ? 'เลือกรูปภาพแล้ว' : 'เลือกรูปภาพแล้ว') + ' ' + options.length + ' ' + 'รูปภาพ';
            },
            confirm: 'confirm',
            cancel: 'cancel',
            name: 'Name',
            type: 'Type',
            size: 'Size',
            dimensions: 'Dimensions',
            duration: 'Duration',
            crop: 'Crop',
            rotate: 'Rotate',
            sort: 'Sort',
            download: 'Download',
            remove: 'Remove',
            drop: 'Drop the files here to Upload',
            paste: '<div class="fileuploader-pending-loader"></div> Pasting a file, click here to cancel.',
            removeConfirmation: 'ต้องการลบรูปภาพจริงหรือไม่ ?',
            errors: {
                filesLimit: 'อัพโหลดได้เพียง ${limit} รูปภาพเท่านั้น',
                filesType: 'อัพโหลดได้เฉพาะไฟล์ประเภท ${extensions} เท่านั้น',
                fileSize: '${name} is too large! Please choose a file up to ${fileMaxSize}MB.',
                filesSizeAll: 'Files that you chose are too large! Please upload files up to ${maxSize} MB.',
                fileName: 'File with the name ${name} is already selected.',
                folderUpload: 'You are not allowed to upload folders.'
            }
        }

        $('input[name="file-image-upload-review"]').fileuploader({
            captions: captionsTH
        });

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
        });

        requestServiceReviewNearbyAttactions();
        requestServiceReviewTips();
        requestServiceReviewEvents();
        requestServiceReviewArticles();
        requestServiceReviewDetail();
        requestServiceReviewComments();

        $("#btn-submit-send-review").on('click', function (e) {
            requestServiceReviewAddedComment();
        });
    });
});

function requestServiceReviewDetail() {

    var param = {
        category_name: DATA_PARAM_IN_URL["category_name"],
        company_name: DATA_PARAM_IN_URL["company_name"],
        meta_id: DATA_PARAM_IN_URL["meta_id"],
        company_id: DATA_PARAM_IN_URL["company_id"],
        category_id: DATA_PARAM_IN_URL["category_id"],
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {

        var resulrList = {

            company_name: res.data.company_name[PAGE_LANGUAGE],
            company_id: res.data.company_id[PAGE_LANGUAGE],
            // contact: res.data.contact,
            contact: ["123 456 789", "123 456 789", "123 456 789"],
            // description: res.data.description,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.",
            facebook: res.data.facebook,
            // images: res.data.images,
            images: ["http://placehold.it/350x233?text=1", "http://placehold.it/350x233?text=2", "http://placehold.it/350x233?text=3", "http://placehold.it/350x233?text=4"],
            image_main: "http://placehold.it/350x233?text=1",
            line: res.data.line,
            location: res.data.location,
            // location_url: res.data.location_url,
            location_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.003394446572!2d100.90275441482068!3d12.843056890940304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310293f1ce9d35ff%3A0x7cc9a3fe926c7a64!2sSea+Blue+Restaurant+Pattaya!5e0!3m2!1sth!2sth!4v1562773965550!5m2!1sth!2sth",
            max_rating: res.data.max_rating,
            meta_id: res.data.meta_id,
            opend: res.data.opend,
            ratings: res.data.ratings,
            reviews: res.data.reviews,
            service_id: res.data.service_id,
            service_name: res.data.service_name[PAGE_LANGUAGE],
            // video: res.data.video,
            video: ["https://www.youtube.com/embed/5e0LxrLSzok", "https://www.youtube.com/embed/5e0LxrLSzok", "https://www.youtube.com/embed/5e0LxrLSzok"],
            website: res.data.website
        };

        // for (var i = 0; i < res.data.length; i++) {
        //     resulrList.push({
        //     });
        // }
        var templateHeadContentMain = $("#head-content-main").html();
        $("#head-content-main").html(bindDataToTemplate(templateHeadContentMain, JSON.parse(JSON.stringify(resulrList))));

        var templateScore = $(".content-main-ratings-" + res.data.meta_id);
        templateScore.prepend('<span> (' + res.data.reviews + (PAGE_LANGUAGE == "en" ? " Reviews" : " Reviews") + ') </span>');

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

        templateScore.prepend('<span class="ratings-box">' + res.data.ratings + '/' + res.data.max_rating + '</span>');


        var templateSlideDetailContent = $("#slide-detail-content").html();
        $("#slide-detail-content").html(bindDataListToTemplateNotMap(templateSlideDetailContent, resulrList.images));
        createSlick("#slide-detail-content");

        var templateVideoDetailContent = $("#video-detail-content").html();
        $("#video-detail-content").html(bindDataListToTemplateNotMap(templateVideoDetailContent, resulrList.video));
        createSlick("#video-detail-content");

        var templateDescriptionDetailContent = $("#description-detail-content").html();
        $("#description-detail-content").html(bindDataToTemplate(templateDescriptionDetailContent, resulrList));

        // var templateLocationDetailContent = $("#location-detail-content").html();
        // $("#location-detail-content").html(bindDataToTemplate(templateLocationDetailContent, resulrList));

        // var templateMapDetailContent = $("#map-detail-content").html();
        // $("#map-detail-content").html(bindDataToTemplate(templateMapDetailContent, resulrList));

        // var templateContactDetailContent = $("#contact-detail-content").html();
        // $("#contact-detail-content").html(bindDataListToTemplateNotMap(templateContactDetailContent, resulrList.contact));

        // var templateOpendDetailContent = $("#opend-detail-content").html();
        // $("#opend-detail-content").html(bindDataListToTemplate(templateOpendDetailContent, resulrList.opend));


        $('.portfolio-item').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });


        closeLoading();
    }

    requestService(URL_REVIEW_DETAIL_RESULT, "GET", param, dooSuccess);
}

function requestServiceReviewNearbyAttactions() {

    var param = {
        category_name: DATA_PARAM_IN_URL["category_name"],
        company_name: DATA_PARAM_IN_URL["company_name"],
        meta_id: DATA_PARAM_IN_URL["meta_id"],
        company_id: DATA_PARAM_IN_URL["company_id"],
        category_id: DATA_PARAM_IN_URL["category_id"],
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var datalist = [];
        var resultList = res.data.attactions;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].company_id != undefined) {

                resultList[i].thumbnail = "http://placehold.it/350x233?text=Near " + (i + 1);
                resultList[i].icon = "http://placehold.it/30";
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "en" ? " Reviews" : "");
                resultList[i].company_id = resultList[i].company_id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].title[PAGE_LANGUAGE] != undefined ? resultList[i].title[PAGE_LANGUAGE] : resultList[i].title;
                datalist.push(resultList[i])
            }

        }

        var templateContentRecommendAttactions = $("#content-recommend-attactions").html();
        $("#content-recommend-attactions").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
        createSlick("#content-recommend-attactions");

        for (var i = 0; i < datalist.length; i++) {
            // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
            var templateScore = $(".content-recommend-attactions-ratings-" + i);
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
    }

    requestService(URL_REVIEW_NEAR_BY_ATTACTION, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendAttactions(meta_id, company_id, title) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    var param = {
        category_name: "ตอนเรียก ReviewNearbyAttactions ไม่มีค่านี้มาให้",
        company_name: title,
        meta_id: meta_id,
        company_id: company_id,
        category_id: "ตอนเรียก ReviewNearbyAttactions ไม่มีค่านี้มาให้",
        lang: PAGE_LANGUAGE
    };
    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
    //     }
    // }
}

function requestServiceReviewTips() {

    var param = {
        category_name: DATA_PARAM_IN_URL["category_name"],
        company_name: DATA_PARAM_IN_URL["company_name"],
        meta_id: DATA_PARAM_IN_URL["meta_id"],
        company_id: DATA_PARAM_IN_URL["company_id"],
        category_id: DATA_PARAM_IN_URL["category_id"],
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var datalist = [];
        var resultList = res.data.attactions;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].company_id != undefined) {

                resultList[i].thumbnail = "http://placehold.it/350x233?text=Tip " + (i + 1);
                resultList[i].icon = "http://placehold.it/30";
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "en" ? " Reviews" : "");
                resultList[i].company_id = resultList[i].company_id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].title[PAGE_LANGUAGE] != undefined ? resultList[i].title[PAGE_LANGUAGE] : resultList[i].title;
                datalist.push(resultList[i])
            }

        }

        var templateContentRecommendAttactions = $("#content-recommend-tips").html();
        $("#content-recommend-tips").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
        createSlick("#content-recommend-tips");

        for (var i = 0; i < datalist.length; i++) {
            // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
            var templateScore = $(".content-recommend-tips-ratings-" + i);
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
    }

    requestService(URL_REVIEW_TIPS, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendTips(meta_id, company_id, title) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    var param = {
        category_name: "ตอนเรียก ReviewTips ไม่มีค่านี้มาให้",
        company_name: title,
        meta_id: meta_id,
        company_id: company_id,
        category_id: "ตอนเรียก ReviewTips ไม่มีค่านี้มาให้",
        lang: PAGE_LANGUAGE
    };
    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
    //     }
    // }
}

function requestServiceReviewEvents() {

    var param = {
        category_name: DATA_PARAM_IN_URL["category_name"],
        company_name: DATA_PARAM_IN_URL["company_name"],
        meta_id: DATA_PARAM_IN_URL["meta_id"],
        company_id: DATA_PARAM_IN_URL["company_id"],
        category_id: DATA_PARAM_IN_URL["category_id"],
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var datalist = [];
        var resultList = res.data.attactions;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].company_id != undefined) {

                resultList[i].thumbnail = "http://placehold.it/350x233?text=Event " + (i + 1);
                resultList[i].icon = "http://placehold.it/30";
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "en" ? " Reviews" : "");
                resultList[i].company_id = resultList[i].company_id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].title[PAGE_LANGUAGE] != undefined ? resultList[i].title[PAGE_LANGUAGE] : resultList[i].title;
                datalist.push(resultList[i])
            }

        }

        var templateContentRecommendAttactions = $("#content-recommend-events").html();
        $("#content-recommend-events").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
        createSlick("#content-recommend-events");

        for (var i = 0; i < datalist.length; i++) {
            // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
            var templateScore = $(".content-recommend-events-ratings-" + i);
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
    }

    requestService(URL_REVIEW_EVENTS, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendEvents(meta_id, company_id, title) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    var param = {
        category_name: "ตอนเรียก ReviewEvents ไม่มีค่านี้มาให้",
        company_name: title,
        meta_id: meta_id,
        company_id: company_id,
        category_id: "ตอนเรียก ReviewEvents ไม่มีค่านี้มาให้",
        lang: PAGE_LANGUAGE
    };
    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
    //     }
    // }
}

function requestServiceReviewArticles() {

    var param = {
        category_name: DATA_PARAM_IN_URL["category_name"],
        company_name: DATA_PARAM_IN_URL["company_name"],
        meta_id: DATA_PARAM_IN_URL["meta_id"],
        company_id: DATA_PARAM_IN_URL["company_id"],
        category_id: DATA_PARAM_IN_URL["category_id"],
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var datalist = [];
        var resultList = res.data.attactions;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].company_id != undefined) {

                resultList[i].thumbnail = "http://placehold.it/350x233?text=Article " + (i + 1);
                resultList[i].icon = "http://placehold.it/30";
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "en" ? " Reviews" : "");
                resultList[i].company_id = resultList[i].company_id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].title[PAGE_LANGUAGE] != undefined ? resultList[i].title[PAGE_LANGUAGE] : resultList[i].title;
                datalist.push(resultList[i])
            }

        }

        var templateContentRecommendAttactions = $("#content-recommend-articles").html();
        $("#content-recommend-articles").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
        createSlick("#content-recommend-articles");

        for (var i = 0; i < datalist.length; i++) {
            // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
            var templateScore = $(".content-recommend-articles-ratings-" + i);
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
    }

    requestService(URL_REVIEW_ARTICLES, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendArticles(meta_id, company_id, title) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    var param = {
        category_name: "ตอนเรียก ReviewArticles ไม่มีค่านี้มาให้",
        company_name: title,
        meta_id: meta_id,
        company_id: company_id,
        category_id: "ตอนเรียก ReviewArticles ไม่มีค่านี้มาให้",
        lang: PAGE_LANGUAGE
    };
    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
    //     }
    // }
}

function requestServiceReviewComments(scroll, id) {

    var param = {
        category_name: DATA_PARAM_IN_URL["category_name"],
        company_name: DATA_PARAM_IN_URL["company_name"],
        meta_id: DATA_PARAM_IN_URL["meta_id"],
        company_id: DATA_PARAM_IN_URL["company_id"],
        category_id: DATA_PARAM_IN_URL["category_id"],
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var resultList = res.data.review_comments;
        for (var i = 0; i < resultList.length; i++) {
            resultList[i].client_image = "http://placehold.it/350x233?text=User" + (i + 1);
            resultList[i].comment_date = moment().format('DD/MM/YYYY');
            // resultList[i].comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.";
        }


        // var templateHeaderReviewContentDetail = $("#header-review-content-detail").html();
        // $("#header-review-content-detail").html(bindDataToTemplate(templateHeaderReviewContentDetail, {
        //     count_review: resultList.length
        // }));

        var templateTempComments = $("#temp-template-comments").html();
        $("#content-detail-comments").html(bindDataListToTemplate(templateTempComments, resultList));

        if (scroll) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#comment-id-" + id).offset().top - 150
            }, 1000);
        }

    }

    requestService(URL_REVIEW_CONMENTS_RESULT, "GET", param, dooSuccess);
}

function requestServiceReviewAddedComment() {
    if (localStorage.getItem("client_id") == undefined) {
        localStorage.setItem("client_id", new Date().getTime());
    }
    var client_id = localStorage.getItem("client_id");

    var param = {
        client_id: client_id,
        name: $("#name-send-review").val(),
        subject: $("#subject-send-review").val(),
        comments: $("#comments-send-review").val(),
        uploads: $("#file-image-upload-review")[0].files[0],
        action: "add"

    }

    var dooSuccess = function (res) {
        if (res.data.success) {
            $("#name-send-review").val("");
            $("#subject-send-review").val("");
            $("#comments-send-review").val("");
            $("#file-image-upload-review").val("");
            $("#sub-header-content-detail").removeClass("active");
            $("#sub-header-content-detail").removeClass("show");
            $("#content-detail").removeClass("active");
            $("#content-detail").removeClass("show");
            $("#sub-header-review-content-detail").addClass("active");
            $("#sub-header-review-content-detail").addClass("show");
            $("#content-detail-comments").addClass("active");
            $("#content-detail-comments").addClass("show");
            requestServiceReviewComments(true, res.data.comment_id);
        } else {
            alert("An error occurred. Please try again.");
        }
    }

    requestFormDataService(URL_REVIEW_ADDED_COMMENT, "POST", param, dooSuccess);
}

function clickMenuTypeHeader(category_id) {
    var param = {
        category_id: category_id
    };

    window.location.href = "./search.html?" + convertJsonToParameterURL(param);
}