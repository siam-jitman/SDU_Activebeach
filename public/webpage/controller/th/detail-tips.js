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
                return 'อัพโหลดรูปภาพ';
            },
            feedback: function (options) {
                return 'อัพโหลดรูปภาพ';
            },
            feedback2: function (options) {
                return (options.length > 1 ? 'เลือกรูปภาพแล้ว' : 'เลือกรูปภาพแล้ว') + ' ' + options.length + ' ' + 'รูปภาพ';
            },
            confirm: 'ยืนยัน',
            cancel: 'ยกเลิก',
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
                    categoryUrlImage: res.data.categorys[i].thumbnail,

                    categoryUrlIcon: res.data.categorys[i].icon
                });
            }

            var templateCategoryMenu = $("#index-category-menu").html();
            $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));


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

            company_name: res.data.name[PAGE_LANGUAGE],
            company_id: res.data.id[PAGE_LANGUAGE],
            contact: res.data.contact,
            // description: res.data.description,
            description: res.data.content,
            facebook: res.data.facebook,
            // images: res.data.images,
            images: res.data.images,
            image_main: res.data.images[0],
            line: res.data.line,
            location: res.data.location,
            // location_url: res.data.location_url,
            location: res.data.location,
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


        var templateSlideDetailContent = $("#slide-detail-content").html();
        $("#slide-detail-content").html(bindDataListToTemplateNotMap(templateSlideDetailContent, resulrList.images));
        createSlick("#slide-detail-content");

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
            // resultList[i].client_image = "http://placehold.it/350x233?text=User" + (i + 1);
            resultList[i].client_image = resultList[i].avatar;
            resultList[i].comment_date = moment().format('DD/MM/YYYY');
            resultList[i].comments = resultList[i].content;
            // resultList[i].comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.";
        }

        var templateTempComments = $("#temp-template-comments").html();
        $("#content-detail-comments").html(bindDataListToTemplate(templateTempComments, resultList));

        if (scroll) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#comment-id-" + id).offset().top - 150
            }, 1000);
        }

    }

    requestService(URL_TRIP_AND_EVENT_COMMENTS, "GET", param, dooSuccess);
}

function requestServiceReviewAddedComment() {
    var client_id = new Date().getTime();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    // if ($("#file-image-upload-review")[0].files[0]) {

    //     var param = {
    //         client_id: client_id,
    //         name: $("#name-send-review").val(),
    //         subject: $("#subject-send-review").val(),
    //         comments: $("#comments-send-review").val(),
    //         uploads: $("#file-image-upload-review")[0].files[0],
    //         action: "add",
    //         id: DATA_PARAM_IN_URL["id"],
    //         category: "trip"
    //     }
    // } else {
    //     var param = {
    //         client_id: client_id,
    //         name: $("#name-send-review").val(),
    //         subject: $("#subject-send-review").val(),
    //         comments: $("#comments-send-review").val(),
    //         action: "add",
    //         id: DATA_PARAM_IN_URL["id"],
    //         category: "trip"
    //     }
    // }

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