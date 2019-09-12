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


        closeLoading();
    });

    requestServiceReviewComments();
});

function requestServiceReviewComments(scroll, id) {

    var param = {
        // category_name: DATA_PARAM_IN_URL["category_name"],
        // company_name: DATA_PARAM_IN_URL["company_name"],
        // meta_id: DATA_PARAM_IN_URL["meta_id"],
        // company_id: DATA_PARAM_IN_URL["company_id"],
        // category_id: DATA_PARAM_IN_URL["category_id"],
        // lang: PAGE_LANGUAGE,

    }

    var dooSuccess = function (res) {
        var resultList = res.data.review_comments;
        for (var i = 0; i < resultList.length; i++) {
            resultList[i].client_image = "http://placehold.it/350x233?text=User" + (i + 1);
            resultList[i].comment_date = moment().format('DD/MM/YYYY');
            // resultList[i].comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque.";
        }

        var templateTempComments = $("#temp-template-comments").html();
        console.log("templateTempComments", templateTempComments);
        $("#content-detail-comments").html(bindDataListToTemplate(templateTempComments, resultList));

        if (scroll) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#comment-id-" + id).offset().top - 150
            }, 1000);
        }

    }

    requestService(URL_REVIEW_CONMENTS_RESULT, "GET", param, dooSuccess);
}

function clickMenuTypeHeader(category_id) {
    var param = {
        category_id: category_id
    };

    window.location.href = "./search.html?" + convertJsonToParameterURL(param);
}

function clickViewProfileBlogger(bloggerId) {
    var param = {
        bloggerId: bloggerId
    };

    window.location.href = "./blogger.html?" + convertJsonToParameterURL(param);
}