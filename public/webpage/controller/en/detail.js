var DATA_CATEGORYS = [];
var meta_id = null;

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

        requestService(URL_INTERSTING_CATEGORYS, "GET", {
            "lang": window.location.href.split(window.location.hostname + (window.location.port != "" ? ":" + window.location.port : "") + "/")[1].split("/")[0]
        }, function (res) {

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

function requestServiceTrackingDetail(param) {

    var dooSuccess = function (res) {

    }

    requestService(URL_TRACKING_DETAIL, "GET", param, dooSuccess);
}

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
            contact: res.data.contact,
            description: res.data.description,
            facebook: res.data.facebook,
            images: res.data.images,
            image_main: res.data.thumbnail,
            line: res.data.line,
            location: res.data.location,
            location_url: res.data.location_url,
            // location: res.data.location,
            max_rating: res.data.max_rating,
            meta_id: res.data.meta_id,
            opend: res.data.opend,
            ratings: res.data.ratings,
            reviews: res.data.reviews,
            service_id: res.data.service_id,
            service_name: res.data.service_name[PAGE_LANGUAGE],
            video: res.data.video,
            // video: res.data.video,
            website: res.data.website,
            location_url: res.data.location_url ? res.data.location_url : "",
            location_latitude: res.data.location_latitude ? res.data.location_latitude : "13.736717",
            location_longitude: res.data.location_longitude ? res.data.location_longitude : "100.523186",
            map_exsist: res.data.map_exsist ? res.data.map_exsist : true,
            API_KEY: GOOGLE_API_KEY,
        };

        if (!resulrList.map_exsist) {
            document.getElementById("main-map-detail-content").setAttribute("style", "display: none")
        } else {
            var templateMapDetailContent = $("#map-detail-content").html();
            $("#map-detail-content").html(bindDataToTemplate(templateMapDetailContent, resulrList));
        }

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


        if (res.data.images.length === 0) {

            document.getElementById("galleryImage").setAttribute('style', 'display: none');
        } else {

            var templateSlideDetailContent = $("#slide-detail-content").html();
            $("#slide-detail-content").html(bindDataListToTemplateNotMap(templateSlideDetailContent, resulrList.images));
            createSlick("#slide-detail-content");
        }

        if (res.data.video.length === 0) {

            document.getElementById("galleryVideo").setAttribute('style', 'display: none');
        } else {

            var templateVideoDetailContent = $("#video-detail-content").html();
            $("#video-detail-content").html(bindDataListToTemplateNotMap(templateVideoDetailContent, resulrList.video));
            createSlick("#video-detail-content");
        }

        var templateDescriptionDetailContent = $("#description-detail-content").html();
        $("#description-detail-content").html(bindDataToTemplate(templateDescriptionDetailContent, resulrList));

        var templateLocationDetailContent = $("#location-detail-content").html();
        $("#location-detail-content").html(bindDataToTemplate(templateLocationDetailContent, resulrList));

        var templateContactDetailContent = $("#contact-detail-content").html();
        $("#contact-detail-content").html(bindDataListToTemplateNotMap(templateContactDetailContent, resulrList.contact));

        var templateOpendDetailContent = $("#opend-detail-content").html();
        $("#opend-detail-content").html(bindDataListToTemplate(templateOpendDetailContent, resulrList.opend));


        $('.portfolio-item').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });


        meta_id = res.data.meta_id;

        var oldScore = JSON.parse(localStorage.getItem("score_company"));
        if (oldScore) {
            for (var i = 0; i < oldScore.length; i++) {
                if (oldScore[i].meta_id === meta_id) {
                    overSelectRatings(oldScore[i].score);
                }
            }
        }

        var paramTracking = {
            client_id: localStorage.getItem("client_id") === undefined ? new Date().getTime() : localStorage.getItem("client_id"),
            company_id: res.data.company_id[PAGE_LANGUAGE],
            meta_id: res.data.meta_id,
        }
        requestServiceTrackingDetail(paramTracking)
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

                resultList[i].thumbnail = resultList[i].thumbnail;
                resultList[i].icon = resultList[i].icon;
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews");
                resultList[i].company_id = resultList[i].company_id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].title[PAGE_LANGUAGE] != undefined ? resultList[i].title[PAGE_LANGUAGE] : resultList[i].title;
                resultList[i].service_name = resultList[i].service_name[PAGE_LANGUAGE] != undefined ? resultList[i].service_name[PAGE_LANGUAGE] : resultList[i].service_name;
                datalist.push(resultList[i])
            }

        }

        if (datalist.length <= 0) {
            document.getElementById("main-content-recommend-attactions").setAttribute("style", "display: none")
        } else {
            if (resultList.length == 1) {
                CONFIG_SLIDE.slidesToShow = 1;
            } else if (resultList.length == 2) {
                CONFIG_SLIDE.slidesToShow = 2;
            } else {
                CONFIG_SLIDE.slidesToShow = 3;
            }
            var templateContentRecommendAttactions = $("#content-recommend-attactions").html();
            $("#content-recommend-attactions").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
            createSlick("#content-recommend-attactions", CONFIG_SLIDE);

            for (var i = 0; i < datalist.length; i++) {
                var templateScore = $(".content-recommend-attactions-ratings-" + (datalist[i].meta_id == undefined ? datalist[i].id[PAGE_LANGUAGE] : datalist[i].meta_id));
                // var templateScore = $(".content-recommend-attactions-ratings-" + datalist[i].company_id[PAGE_LANGUAGE]);
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

    }

    requestService(URL_REVIEW_NEAR_BY_ATTACTION, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendAttactions(meta_id, company_id, title, category_id, category_name) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    var param = {
        category_name: category_name,
        company_name: title,
        meta_id: meta_id,
        company_id: company_id,
        category_id: category_id,
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
        var resultList = res.data.trips;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].id[PAGE_LANGUAGE] != undefined) {


                resultList[i].icon = resultList[i].icon;
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews");
                resultList[i].ratings = resultList[i].ratings;
                resultList[i].company_id = resultList[i].id[PAGE_LANGUAGE];
                resultList[i].meta_id = resultList[i].id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].name[PAGE_LANGUAGE] != undefined ? resultList[i].name[PAGE_LANGUAGE] : resultList[i].name;
                resultList[i].service_name = resultList[i].service_name[PAGE_LANGUAGE];
                datalist.push(resultList[i])
            }

        }


        if (datalist.length <= 0) {
            document.getElementById("main-content-recommend-tips").setAttribute("style", "display: none")
        } else {

            if (resultList.length == 1) {
                CONFIG_SLIDE.slidesToShow = 1;
            } else if (resultList.length == 2) {
                CONFIG_SLIDE.slidesToShow = 2;
            } else {
                CONFIG_SLIDE.slidesToShow = 3;
            }
            var templateContentRecommendAttactions = $("#content-recommend-tips").html();
            $("#content-recommend-tips").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
            createSlick("#content-recommend-tips", CONFIG_SLIDE);

            for (var i = 0; i < datalist.length; i++) {
                // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
                var templateScore = $(".content-recommend-tips-ratings-" + datalist[i].id[PAGE_LANGUAGE]);
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
    }

    requestService(URL_REVIEW_TIPS, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendTips(meta_id, company_id, title, service_id, service_name) {
    // for (var i = 0; i < SEARCH_RESULT_LIST.length; i++) {
    //     if (SEARCH_RESULT_LIST[i].meta_id == id) {
    // var param = {
    //     category_name: service_name,
    //     company_name: title,
    //     meta_id: meta_id,
    //     company_id: company_id,
    //     category_id: service_id,
    //     lang: PAGE_LANGUAGE
    // };
    // window.location.href = "./detail.html?" + convertJsonToParameterURL(param);

    var param = {
        id: company_id,
        name: title
    };
    window.location.href = "./detail-tips.html?" + convertJsonToParameterURL(param);

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
        var resultList = res.data.events;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].id[PAGE_LANGUAGE] != undefined) {


                resultList[i].icon = resultList[i].icon;
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews");
                resultList[i].ratings = resultList[i].ratings;
                resultList[i].company_id = resultList[i].id[PAGE_LANGUAGE];
                resultList[i].meta_id = resultList[i].id[PAGE_LANGUAGE];
                resultList[i].title = resultList[i].name[PAGE_LANGUAGE] != undefined ? resultList[i].name[PAGE_LANGUAGE] : resultList[i].name;
                resultList[i].service_name = resultList[i].service_name[PAGE_LANGUAGE];
                datalist.push(resultList[i])
            }

        }

        if (datalist.length <= 0) {
            document.getElementById("main-content-recommend-events").setAttribute("style", "display: none")
        } else {

            if (resultList.length == 1) {
                CONFIG_SLIDE.slidesToShow = 1;
            } else if (resultList.length == 2) {
                CONFIG_SLIDE.slidesToShow = 2;
            } else {
                CONFIG_SLIDE.slidesToShow = 3;
            }
            var templateContentRecommendAttactions = $("#content-recommend-events").html();
            $("#content-recommend-events").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
            createSlick("#content-recommend-events", CONFIG_SLIDE);

            for (var i = 0; i < datalist.length; i++) {
                // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
                var templateScore = $(".content-recommend-events-ratings-" + datalist[i].id[PAGE_LANGUAGE]);
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
    }

    requestService(URL_REVIEW_EVENTS, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendEvents(meta_id, company_id, title, service_id, service_name) {
    var param = {
        id: company_id,
        name: title
    };
    window.location.href = "./detail-event.html?" + convertJsonToParameterURL(param);
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
        var resultList = res.data.blogs == null ? [] : res.data.blogs;
        for (var i = 0; i < resultList.length; i++) {
            // console.log(i)
            if (resultList[i].blog_id[PAGE_LANGUAGE] != undefined) {


                resultList[i].icon = resultList[i].icon;
                resultList[i].reviews = resultList[i].reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews");
                resultList[i].ratings = resultList[i].ratings;
                resultList[i].company_id = resultList[i].blog_id[PAGE_LANGUAGE];
                resultList[i].meta_id = resultList[i].blog_id[PAGE_LANGUAGE];
                resultList[i].updated_at = moment(resultList[i].updated_at).format('DD/MM/YYYY HH:MM');
                resultList[i].title = resultList[i].subject[PAGE_LANGUAGE] != undefined ? resultList[i].subject[PAGE_LANGUAGE] : resultList[i].subject;
                resultList[i].service_name = resultList[i].service_name[PAGE_LANGUAGE];
                resultList[i].slug = resultList[i].slug[PAGE_LANGUAGE];
                datalist.push(resultList[i])
            }

        }
        if (datalist.length <= 0) {
            document.getElementById("main-content-recommend-articles").setAttribute("style", "display: none")
        } else {

            if (resultList.length == 1) {
                CONFIG_SLIDE.slidesToShow = 1;
            } else if (resultList.length == 2) {
                CONFIG_SLIDE.slidesToShow = 2;
            } else {
                CONFIG_SLIDE.slidesToShow = 3;
            }
            var templateContentRecommendAttactions = $("#content-recommend-articles").html();
            $("#content-recommend-articles").html(bindDataListToTemplate(templateContentRecommendAttactions, datalist));
            createSlick("#content-recommend-articles", CONFIG_SLIDE);

            for (var i = 0; i < datalist.length; i++) {
                // var templateScore = $(".content-recommend-attactions-ratings-" + resultList[i].meta_id);
                var templateScore = $(".content-recommend-articles-ratings-" + datalist[i].blog_id[PAGE_LANGUAGE]);
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
    }

    requestService(URL_REVIEW_ARTICLES, "GET", param, dooSuccess);
}

function clickBtnToDetailRecommendArticles(id, slug) {
    if (typeof slug === "object") {
        slug = slug[PAGE_LANGUAGE];
    } else {
        slug = slug;
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/blog/post/" + id + "/" + slug + "/";
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
        var resultList = res.data.comments;
        for (var i = 0; i < resultList.length; i++) {
            // resultList[i].client_image = "http://placehold.it/350x233?text=User" + (i + 1);
            resultList[i].comment_date = moment(resultList[i].created_at).format('DD/MM/YYYY');
            // resultList[i].comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.";
        }


        var templateHeaderReviewContentDetail = $("#header-review-content-detail").html();
        $("#header-review-content-detail").html(bindDataToTemplate(templateHeaderReviewContentDetail, {
            count_review: resultList.length
        }));

        var templateTempComments = $("#temp-template-comments").html();
        $("#content-detail-comments").html(bindDataListToTemplate(templateTempComments, resultList));

        for (var i = 0; i < resultList.length; i++) {
            if (!resultList[i].client_image) {
                document.getElementById("client_comment_image_" + resultList[i].comment_id).setAttribute("style", "display: none")
                document.getElementById("client_comment_icon_" + resultList[i].comment_id).removeAttribute("style")
                document.getElementById("client_comment_icon_" + resultList[i].comment_id).setAttribute("style", "font-size: 40px");
                // document.getElementById("client_comment_icon_" + resultList[i].comment_id).setAttribute("style", "display: block")
            }

        }

        if (scroll) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#comment-id-" + id).offset().top - 150
            }, 1000);
        }

    }

    requestService(URL_REVIEW_CONMENTS_RESULT, "GET", param, dooSuccess);
}

function requestServiceReviewAddedComment() {
    var client_id = guid();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }


    if ($("#file-image-upload-review")[0].files[0]) {

        var param = {
            client: client_id,
            name: $("#name-send-review").val(),
            subject: $("#subject-send-review").val(),
            comments: $("#comments-send-review").val(),
            uploads: $("#file-image-upload-review")[0].files[0],
            action: "add",
            meta_id: meta_id
        }
    } else {

        var param = {
            client: client_id,
            name: $("#name-send-review").val(),
            subject: $("#subject-send-review").val(),
            comments: $("#comments-send-review").val(),
            action: "add",
            meta_id: meta_id
        }
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

function requestServiceVoteCompany(score) {
    openLoading();
    var param = {
        meta_id: meta_id,
        score: score,
        lang: PAGE_LANGUAGE,
        action: "add"
    }
    var dooSuccess = function (res) {
        var oldScore = JSON.parse(localStorage.getItem("score_company"));
        if (oldScore) {
            oldScore.push({
                meta_id: meta_id,
                score: score
            });
        } else {
            oldScore = []
            oldScore.push({
                meta_id: meta_id,
                score: score
            });
        }

        localStorage.setItem("score_company", JSON.stringify(oldScore))

        closeLoading();
        overSelectRatings(score);
    }

    requestFormDataService(URL_VOTE_COMPANY, "POST", param, dooSuccess, function () {
        closeLoading();
    });
}

function linkToGoogleMap(lat, long) {
    if ($(window).width() > 992) {
        window.open('https://www.google.com/maps?q=' + lat + ',' + long, '_blank');
    } else {
        window.location.href = 'https://www.google.com/maps?q=' + lat + ',' + long
    }
}

function overSelectRatings(score) {
    for (var i = 0; i < score; i++) {
        document.getElementById("select-ratings-" + (i + 1)).setAttribute("style", "color: #ffc12b");
    }
}

function leaveSelectRatings(score) {

    var oldScore = JSON.parse(localStorage.getItem("score_company"));
    if (oldScore) {


        for (var i = 0; i < score; i++) {
            document.getElementById("select-ratings-" + (i + 1)).removeAttribute("style");
        }

        for (var i = 0; i < oldScore.length; i++) {
            if (oldScore[i].meta_id === meta_id) {
                overSelectRatings(oldScore[i].score);
            }
        }

    } else {
        for (var i = 0; i < score; i++) {
            document.getElementById("select-ratings-" + (i + 1)).removeAttribute("style");
        }
    }
}

function clickSelectRatings(score) {
    requestServiceVoteCompany(score)
}