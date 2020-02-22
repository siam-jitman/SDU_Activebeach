var DATA_CATEGORYS = [];
var scoped_id = null;

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

                if ((window.location.href.indexOf("search.html?category_id")) >= 0) {
                    $('#label-page-categories').css("font-weight", "bold");
                    $('#label-page-categories').css("color", "rgb(240, 24, 34)");
        
        
                    $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("font-weight", "bold");
                    $('#' + window.location.href.split("search.html?category_id=")[1].split("&")[0] + '-label-page-categories').css("color", "rgb(240, 24, 34)");
                }


            loadMainModalFavorite();
        });
        requestServiceTripAndEventDetail();
        requestServiceReviewComments();

        $("#btn-submit-send-review").on('click', function (e) {
            requestServiceReviewAddedComment();
        });
    });
});

function requestServiceTripAndEventDetail() {

    var param = {
        // id: DATA_PARAM_IN_URL["category_name"],
        // category_name: DATA_PARAM_IN_URL["category_name"],
        // company_name: DATA_PARAM_IN_URL["company_name"],
        // meta_id: DATA_PARAM_IN_URL["meta_id"],
        // company_id: DATA_PARAM_IN_URL["company_id"],
        // category_id: DATA_PARAM_IN_URL["category_id"],
        // lang: PAGE_LANGUAGE,

        id: DATA_PARAM_IN_URL["id"],
        name: DATA_PARAM_IN_URL["name"],
        category: "trip",
        province: '',
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {

        var resulrList = {

            company_name: checkFieldForLanguageNull(res.data.name),
            company_id: res.data.id[PAGE_LANGUAGE],
            contact: res.data.contact,
            // description: res.data.description,
            description: res.data.content,
            facebook: res.data.facebook,
            // images: res.data.images,
            images: res.data.images,
            image_main: res.data.thumbnail,
            line: res.data.line,
            // location: res.data.location,

            location_latitude: res.data.location_latitude ? res.data.location_latitude : "13.736717",
            location_longitude: res.data.location_longitude ? res.data.location_longitude : "100.523186",
            map_exsist: res.data.map_exsist,
            API_KEY: GOOGLE_API_KEY,


            location: res.data.address,
            max_rating: res.data.max_rating,
            meta_id: res.data.meta_id,
            opend: res.data.opend,
            ratings: res.data.ratings,
            reviews: res.data.reviews,
            service_id: res.data.service_id,
            service_name: res.data.service_name[PAGE_LANGUAGE],
            // video: res.data.video,
            // video: res.data.video,
            website: res.data.website
        };


        if (!resulrList.map_exsist) {
            document.getElementById("main-map-detail-content").setAttribute("style", "display: none")
        } else {
            var templateMapDetailContent = $("#map-detail-content").html();
            $("#map-detail-content").html(bindDataToTemplate(templateMapDetailContent, resulrList));
        }

        var templateHeadContentMain = $("#head-content-main").html();
        $("#head-content-main").html(bindDataToTemplate(templateHeadContentMain, JSON.parse(JSON.stringify(resulrList))));

        var templateScore = $(".content-main-ratings-" + res.data.meta_id);
        templateScore.prepend('<span> (' + res.data.reviews + (PAGE_LANGUAGE == "th" ? " รีวิว" : " Reviews") + ') </span>');

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


        if (resulrList.images === null || resulrList.images === undefined || resulrList.images.length <= 0) {

            document.getElementById("galleryImage").setAttribute('style', 'display: none');
        } else {
            var templateSlideDetailContent = $("#slide-detail-content").html();
            $("#slide-detail-content").html(bindDataListToTemplateNotMap(templateSlideDetailContent, resulrList.images));
            createSlick("#slide-detail-content");
        }

        // var templateVideoDetailContent = $("#video-detail-content").html();
        // $("#video-detail-content").html(bindDataListToTemplateNotMap(templateVideoDetailContent, resulrList.video));
        // createSlick("#video-detail-content");

        var templateDescriptionDetailContent = $("#description-detail-content").html();
        $("#description-detail-content").html(bindDataToTemplate(templateDescriptionDetailContent, resulrList));

        $('.portfolio-item').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });

        scoped_id = res.data.scope_id;

        var oldScore = JSON.parse(localStorage.getItem("score_trip"));
        if (oldScore) {
            for (var i = 0; i < oldScore.length; i++) {
                if (oldScore[i].scoped_id === scoped_id) {
                    overSelectRatings(oldScore[i].score);
                }
            }
        }

        closeLoading();
    }

    requestService(URL_TRIP_AND_EVENT_DETAIL, "GET", param, dooSuccess);
}

function requestServiceReviewComments(scroll, id) {

    var param = {
        id: DATA_PARAM_IN_URL["id"],
        name: DATA_PARAM_IN_URL["name"],
        category: "trip",
        province: '',
        lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var resultList = res.data.comments;
        for (var i = 0; i < resultList.length; i++) {
            resultList[i].id = PAGE_LANGUAGE;
            resultList[i].client_image = resultList[i].avatar;
            resultList[i].comment_date = moment().format('DD/MM/YYYY');
            resultList[i].comments = resultList[i].content;
        }

        if (resultList.length <= 0) {
            document.getElementById("content-detail-comments").setAttribute("style", "display:none");
            document.getElementById("blank-content-detail-comments").setAttribute("style", "display:block");
        } else {
            document.getElementById("blank-content-detail-comments").setAttribute("style", "display:none");
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

    }

    requestService(URL_TRIP_AND_EVENT_COMMENTS, "GET", param, dooSuccess);
}

function requestServiceReviewAddedComment() {
    var client_id = guid();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    var param = {
        client_id: client_id,
        name: $("#name-send-review").val(),
        subject: $("#subject-send-review").val(),
        comments: $("#comments-send-review").val(),
        uploads: $("#file-image-upload-review")[0].files[0],
        action: "add",
        id: DATA_PARAM_IN_URL["id"],
        category: "trip"
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
            alert("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง");
        }
    }

    requestFormDataService(URL_TRIP_AND_EVENT_ADDED_COMMENTS, "POST", param, dooSuccess);
}

function overSelectRatings(score) {
    for (var i = 0; i < score; i++) {
        document.getElementById("select-ratings-" + (i + 1)).setAttribute("style", "color: #ffc12b");
    }
}

function leaveSelectRatings(score) {

    var oldScore = JSON.parse(localStorage.getItem("score_trip"));
    if (oldScore) {


        for (var i = 0; i < score; i++) {
            document.getElementById("select-ratings-" + (i + 1)).removeAttribute("style");
        }

        for (var i = 0; i < oldScore.length; i++) {
            if (oldScore[i].scoped_id === scoped_id) {
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
    requestServiceVoteTripAndEvent(score)
}

function requestServiceVoteTripAndEvent(score) {
    openLoading();
    var param = {
        scoped_id: scoped_id,
        score: score,
        lang: PAGE_LANGUAGE,
        action: "add"
    }
    var dooSuccess = function (res) {
        var oldScore = JSON.parse(localStorage.getItem("score_trip"));
        if (oldScore) {
            oldScore.push({
                scoped_id: scoped_id,
                score: score
            });
        } else {
            oldScore = []
            oldScore.push({
                scoped_id: scoped_id,
                score: score
            });
        }

        localStorage.setItem("score_trip", JSON.stringify(oldScore))

        closeLoading();
        overSelectRatings(score);
    }

    requestFormDataService(URL_VOTE_TRIP, "POST", param, dooSuccess, function () {
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