var INVERT_PAGE_LANGUAGE = "";
var BLOGGER_USER = "";

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
    });

    requestService(URL_INTERSTING_CATEGORYS, "GET", null, function (res) {

        setTimeout(function () {
            // console.log("res.data.categorys", res.data.categorys)
            for (var i = 0; i < res.data.categorys.length; i++) {
                // console.log("res.data.categorys[i].service_name[PAGE_LANGUAGE]", res.data.categorys[i].service_name[PAGE_LANGUAGE])
                DATA_CATEGORYS.push({
                    categoryName: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                    categoryNameDisplay: res.data.categorys[i].service_name[PAGE_LANGUAGE],
                    categoryNameValue: res.data.categorys[i].service_id,
                    categoryUrlImage: res.data.categorys[i].thumbnail,
                    categoryUrlIcon: res.data.categorys[i].icon
                });
            }

            setTimeout(function () {
                console.log("DATA_CATEGORYS", DATA_CATEGORYS)
                var templateCategoryMenu = $("#index-category-menu").html();
                $("#index-category-menu").html(bindDataListToTemplate(templateCategoryMenu, JSON.parse(JSON.stringify(DATA_CATEGORYS))));
                loadMainModalFavorite();

                requestServiceBlogHistory();
            }, 1000);
        }, 1000);
    });
});

function requestServiceBlogHistory() {
    var client_id = guid();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    var author = window.location.href.split("/blog/author/")[1].split("/")[0];

    var param = {
        author: author,
        client: client_id,
        lang: PAGE_LANGUAGE
    }

    var dooSuccess = function (res) {


        var resultData = res.data;
        resultData.blogger.author = author;

        var contentUserBlogger = $("#content-user-blogger").html();
        $("#content-user-blogger").html(bindDataToTemplate(contentUserBlogger, JSON.parse(JSON.stringify(resultData.blogger))));

        var resultDataBlogs = resultData.blogs;

        for (var i = 0; i < resultDataBlogs.length; i++) {
            resultDataBlogs[i].blog_id = resultDataBlogs[i].blog_id[PAGE_LANGUAGE];
            resultDataBlogs[i].service_name = resultDataBlogs[i].service_name[PAGE_LANGUAGE];
            resultDataBlogs[i].slug = resultDataBlogs[i].slug[PAGE_LANGUAGE];
        }

        var contentListBlog = $("#content-list-blog").html();
        $("#content-list-blog").html(bindDataListToTemplate(contentListBlog, JSON.parse(JSON.stringify(resultDataBlogs))));

        if (PAGE_LANGUAGE == "th") {
            INVERT_PAGE_LANGUAGE = "en"
            // sessionStorage.setItem("INVERT_PAGE_LANGUAGE", "en");
        } else {
            INVERT_PAGE_LANGUAGE = "th"
            // sessionStorage.setItem("INVERT_PAGE_LANGUAGE", "th");
        }
        BLOGGER_USER = author;

        closeLoading();
    }

    requestService(URL_BLOG_HISTORY, "GET", param, dooSuccess);
}

function clickViewProfileBlogger(bloggerId) {
    var param = {
        bloggerId: bloggerId
    };
    window.location.href = "./blogger.html?" + convertJsonToParameterURL(param);
}