var INVERT_PAGE_LANGUAGE = "";
var BLOG_AFTER_CHENGE_LANGUAGE = {};

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

                requestServiceBlogDetail();
                requestServiceReviewComments();
            }, 1000);
        }, 1000);
    });

    $("#btn-submit-send-review").on('click', function (e) {
        requestServiceBlogAddedComment();
    });

});

function requestServiceBlogDetail() {

    var client_id = new Date().getTime();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    var blogId = window.location.href.split("/blog/post/")[1].split("/")[0];

    var param = {
        blog_id: blogId,
        client: client_id,
        lang: PAGE_LANGUAGE
    }

    var dooSuccess = function (res) {
        // alert("success");

        var resultData = res.data;

        resultData.updated_at = moment(resultData.updated_at).format("DD/MM/YYYY HH:mm");

        var mainContentBlogDetail = $("#main-content-blog-detail").html();
        $("#main-content-blog-detail").html(bindDataToTemplate(mainContentBlogDetail, JSON.parse(JSON.stringify(resultData))));

        var contentBlogDetail = $("#content-blog-detail").html();
        $("#content-blog-detail").html(bindDataToTemplate(contentBlogDetail, JSON.parse(JSON.stringify(resultData))));

        var contentAdminMenu = $("#content-admin-menu").html();
        $("#content-admin-menu").html(bindDataToTemplate(contentAdminMenu, JSON.parse(JSON.stringify(resultData))));

        var btnMoreContentAdminMenu = $("#btn-more-content-admin-menu").html();
        $("#btn-more-content-admin-menu").html(bindDataToTemplate(btnMoreContentAdminMenu, JSON.parse(JSON.stringify(resultData))));

        if (PAGE_LANGUAGE == "th") {
            INVERT_PAGE_LANGUAGE = "en"
            // sessionStorage.setItem("INVERT_PAGE_LANGUAGE", "en");
        } else {
            INVERT_PAGE_LANGUAGE = "th"
            // sessionStorage.setItem("INVERT_PAGE_LANGUAGE", "th");
        }

        BLOG_AFTER_CHENGE_LANGUAGE = {
            blog_id: resultData.blog_id,
            slug: resultData.slug,
            service_name: resultData.service_name
        };

        // sessionStorage.setItem("BLOG_AFTER_CHENGE_LANGUAGE", JSON.stringify(BLOG_AFTER_CHENGE_LANGUAGE));

        requestServiceBlogArticleResult(resultData.author);
    }

    requestService(URL_BLOG_DETAIL, "GET", param, dooSuccess);
}

function requestServiceBlogArticleResult(author) {
    var client_id = new Date().getTime();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    var param = {
        author: author,
        client: client_id,
        lang: PAGE_LANGUAGE,
        pageSize: 3
    }

    var dooSuccess = function (res) {
        // alert("success");

        var resultData = res.data.blogs;

        for (var i = 0; i < resultData.length; i++) {
            resultData[i].blog_id = resultData[i].blog_id[PAGE_LANGUAGE];
            resultData[i].service_name = resultData[i].service_name[PAGE_LANGUAGE];
            resultData[i].slug = resultData[i].slug[PAGE_LANGUAGE];
        }

        var contentBlogRecommend = $("#content-blog-recommend").html();
        $("#content-blog-recommend").html(bindDataListToTemplate(contentBlogRecommend, JSON.parse(JSON.stringify(resultData))));


        closeLoading();
    }

    requestService(URL_BLOG_ARTICLE_RESULT, "GET", param, dooSuccess);
}

function requestServiceReviewComments(scroll, id) {

    var client_id = new Date().getTime();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    var blogId = window.location.href.split("/blog/post/")[1].split("/")[0];

    var param = {
        blog_id: blogId,
        client: client_id,
        lang: PAGE_LANGUAGE
    }

    var dooSuccess = function (res) {
        var resultList = res.data.comments;
        for (var i = 0; i < resultList.length; i++) {
            resultList[i].client_image = resultList[i].avatar;
            resultList[i].comment_date = moment(resultList[i].created_at).format('DD/MM/YYYY HH:mm');
            resultList[i].name = resultList[i].author;
            resultList[i].comments = resultList[i].content;
            resultList[i].comment_id = resultList[i].blog_comment_id;
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

    requestService(URL_BLOG_COMMENTS, "GET", param, dooSuccess);
}

function requestServiceBlogAddedComment() {

    var client_id = new Date().getTime();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    var blogId = window.location.href.split("/blog/post/")[1].split("/")[0];

    var param = {
        client_id: client_id,
        name: $("#name-send-review").val(),
        subject: $("#subject-send-review").val(),
        comments: $("#comments-send-review").val(),
        uploads: $("#file-image-upload-review")[0].files[0],
        action: "add",
        blogId: blogId

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
            requestServiceReviewComments(true, res.data.blog_comment_id);
        } else {
            alert("An error occurred. Please try again.");
        }
    }

    requestFormDataService(URL_BLOG_ADDED_COMMENTS, "POST", param, dooSuccess);
}

function clickMenuTypeHeader(category_id) {
    var param = {
        category_id: category_id
    };

    window.location.href = "./search.html?" + convertJsonToParameterURL(param);
}

function clickViewProfileBlogger(username) {

    var client_id = new Date().getTime();
    if (localStorage.getItem("client_id") != undefined) {
        client_id = localStorage.getItem("client_id");
    }

    window.location.href = "/" + PAGE_LANGUAGE + "/blog/author/" + username + "/" + client_id + "/";
}

function clickToBlogDetail(id, slug) {
    // console.log('clickToBlogDetail(id, slug)', id, slug);
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/blog/post/" + id + "/" + slug + "/";
    // window.location.replace(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + "/blog/post/" + id + "/" + slug + "/");
}

function clickChangeLanguage(lang) {
    window.location.replace(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + "/" + INVERT_PAGE_LANGUAGE + "/blog/post/" + (typeof BLOG_AFTER_CHENGE_LANGUAGE.blog_id == "object" ? BLOG_AFTER_CHENGE_LANGUAGE.blog_id[INVERT_PAGE_LANGUAGE] : BLOG_AFTER_CHENGE_LANGUAGE.blog_id) + "/" + BLOG_AFTER_CHENGE_LANGUAGE.slug[INVERT_PAGE_LANGUAGE] + "/");
}