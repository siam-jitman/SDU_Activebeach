var GOOGLE_API_KEY = "AIzaSyA2YAL6f4MU41XbgBwPaX2TbTaZF1azGk4";
var CONFIG_SLIDE = {
    'centerMode': true,
    'slidesToShow': 3,
    'slidesToScroll': 3,
    'responsive': [{
        'breakpoint': 1024,
        'settings': {
            'slidesToShow': 2
        }
    }, {
        'breakpoint': 768,
        'settings': {
            'slidesToShow': 1
        }
    }]
};

$(function () {

    'use strict';

    // jQuery
    // script is now loaded and executed.
    // put your dependent JS here.

    // Showing page loader
    $(window).on('load', function () {
        // setTimeout(function () {
        //     $(".page_loader").fadeOut("fast");
        // }, 100);

        if ($("#name-send-review") && localStorage.getItem("first_name") && localStorage.getItem("last_name")) {
            $("#name-send-review").val(localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"));
        }

        if (!checkLogin() && document.getElementById("main-content-add-review")) {
            document.getElementById("main-content-add-review").setAttribute("style", "display: none");
            document.getElementById("login-for-review").removeAttribute("style");
        }
        $("#common-header").load("../template/th/common/header.html", function () {
            adjustHeader();
            doSticky();
        });


        $("#mainModalLogin").load("../template/th/madal/login.html", function () {
            // $('#alert-error')..alert('close')

            $('#alert-error').hide();
            $('#alert-error-blank').hide();
            if (localStorage.getItem("client_id") && localStorage.getItem("client_id") != "") {
                $("#menu-login-group").hide();
                $("#menu-profile-group").css("display", "flex");;
            } else {
                $("#menu-login-group").show();
                $("#menu-profile-group").hide();
            }
            if (localStorage.getItem("first_name")) {
                if (localStorage.getItem("first_name") == "") {
                    var templateHeaderNameMember = $("#header-name-member").html();
                    $("#header-name-member").html(bindDataToTemplate(templateHeaderNameMember, {
                        name_member: "ข้อมูลสมาชิก"
                    }));
                } else {
                    var templateHeaderNameMember = $("#header-name-member").html();
                    $("#header-name-member").html(bindDataToTemplate(templateHeaderNameMember, {
                        name_member: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name")
                    }));
                }
            }
        });

        $("#mainModalRegister").load("../template/th/madal/register.html", function () {
            $('#alert-error-register').hide();
            $('#alert-error-blank-register').hide();
            $('#alert-error-confirm-password').hide();
        });

        // $("#mainModalFavorite").load("../template/th/madal/favorite.html", function () {
        //     $('#alert-error-favorite').hide();
        // });

        if ($('body .filter-portfolio').length > 0) {
            $(function () {
                $('.filter-portfolio').filterizr({
                    delay: 0
                });
            });
            $('.filteriz-navigation li').on('click', function () {
                $('.filteriz-navigation .filtr').removeClass('active');
                $(this).addClass('active');
            });
        }

        PAGE_LANGUAGE = window.location.href.split(window.location.hostname + (window.location.port != "" ? ":" + window.location.port : "") + "/")[1].split("/")[0];
        DATA_PARAM_IN_URL = convertParameterURLToJson();
        DATA_PARAM_IN_URL["lang"] = PAGE_LANGUAGE;

    });



    // Made the left sidebar's min-height to window's height
    var winHeight = $(window).height();
    $('.dashboard-nav').css('min-height', winHeight);


    // Magnify activation
    $('.portfolio-item').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true
        }
    });


    // Header shrink while page scroll
    adjustHeader();
    doSticky();
    placedDashboard();
    $(window).on('scroll', function () {
        adjustHeader();
        doSticky();
        placedDashboard();
    });

    // Header shrink while page resize
    $(window).on('resize', function () {
        adjustHeader();
        doSticky();
        placedDashboard();
    });

    function adjustHeader() {
        var windowWidth = $(window).width();
        if (windowWidth > 992 && (window.location.href.indexOf("index.html") >= 0 || (window.location.href.endsWith("/th/")) || (window.location.href.endsWith("/en/")) || window.location.href.indexOf("detail-") >= 0 || window.location.href.indexOf("detail") >= 0)) {
            if ($(document).scrollTop() >= 100) {
                if ($('.header-shrink').length < 1) {
                    $('.sticky-header').addClass('header-shrink');
                }
                if ($('.do-sticky').length < 1) {
                    $('.logo img').attr('src', '../img/logos/black-logo.png');
                }
            } else {
                $('.sticky-header').removeClass('header-shrink');
                if ($('.do-sticky').length < 1 && $('.fixed-header').length == 0 && $('.fixed-header2').length == 0) {
                    $('.logo img').attr('src', '../img/logos/logo.png');
                } else {
                    $('.logo img').attr('src', '../img/logos/black-logo.png');
                }
            }
        } else {
            $('.sticky-header').addClass('header-shrink');
            $('.logo img').attr('src', '../img/logos/black-logo.png');
        }
        if ((window.location.href.indexOf("index.html") >= 0) || (window.location.href.endsWith("/th/")) || (window.location.href.endsWith("/en/"))) {
            $('#label-page-main').css("font-weight", "bold");
            $('#label-page-main').css("color", "rgb(240, 24, 34)");
            $('.btn-back-page').css("display", "none");
        } else if ((window.location.href.indexOf("more-first.html")) >= 0 || (window.location.href.indexOf("more.html")) >= 0 || (window.location.href.indexOf("search.html?text=")) >= 0 || (window.location.href.indexOf("detail.html")) >= 0) {
            $('#label-page-tourism').css("font-weight", "bold");
            $('#label-page-tourism').css("color", "rgb(240, 24, 34)");


            $('#one-label-page-tourism').css("font-weight", "bold");
            $('#one-label-page-tourism').css("color", "rgb(240, 24, 34)");

        } else if ((window.location.href.indexOf("more-event")) >= 0 || (window.location.href.indexOf("search-event.html")) >= 0 || (window.location.href.indexOf("detail-event.html")) >= 0) {
            $('#label-page-tourism').css("font-weight", "bold");
            $('#label-page-tourism').css("color", "rgb(240, 24, 34)");


            $('#two-label-page-tourism').css("font-weight", "bold");
            $('#two-label-page-tourism').css("color", "rgb(240, 24, 34)");

        } else if ((window.location.href.indexOf("more-tips")) >= 0 || (window.location.href.indexOf("search-tips.html")) >= 0 || (window.location.href.indexOf("detail-tips.html")) >= 0) {
            $('#label-page-tourism').css("font-weight", "bold");
            $('#label-page-tourism').css("color", "rgb(240, 24, 34)");


            $('#three-label-page-tourism').css("font-weight", "bold");
            $('#three-label-page-tourism').css("color", "rgb(240, 24, 34)");

        } else if ((window.location.href.indexOf("search.html?category_id")) >= 0) {
            $('#label-page-tourism').css("font-weight", "bold");
            $('#label-page-tourism').css("color", "rgb(240, 24, 34)");


            $('#one-label-page-tourism').css("font-weight", "bold");
            $('#one-label-page-tourism').css("color", "rgb(240, 24, 34)");
        } else if ((window.location.href.indexOf("search-article.html") >= 0) || ((window.location.href.indexOf("/blog/")) >= 0)) {
            $('#label-page-article').css("font-weight", "bold");
            $('#label-page-article').css("color", "rgb(240, 24, 34)");
        } else if ((window.location.href.indexOf("issue.html")) >= 0) {
            $('#label-page-qa').css("font-weight", "bold");
            $('#label-page-qa').css("color", "rgb(240, 24, 34)");
        }
    }

    function doSticky() {
        if ($(document).scrollTop() > 40) {
            $('.do-sticky').addClass('sticky-header');
            //$('.do-sticky').addClass('header-shrink');
        } else {
            $('.do-sticky').removeClass('sticky-header');
            //$('.do-sticky').removeClass('header-shrink');
        }
    }

    function placedDashboard() {
        var headerHeight = parseInt($('.main-header').height(), 10);
        $('.dashboard').css('top', headerHeight);
    }


    // Banner slider
    (function ($) {
        //Function to animate slider captions
        function doAnimations(elems) {
            //Cache the animationend event in a variable
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function () {
                    $this.removeClass($animationType);
                });
            });
        }

        //Variables on page load
        var $myCarousel = $('#carousel-example-generic')
        var $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        //Initialize carousel
        $myCarousel.carousel();

        //Animate captions in first slide on page load
        doAnimations($firstAnimatingElems);
        //Pause carousel
        $myCarousel.carousel('pause');
        //Other slides to be animated on carousel slide event
        $myCarousel.on('slide.bs.carousel', function (e) {
            var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
            doAnimations($animatingElems);
        });
        $('#carousel-example-generic').carousel({
            interval: 3000,
            pause: "false"
        });
    })(jQuery);

    // Page scroller initialization.
    $.scrollUp({
        scrollName: 'page_scroller',
        scrollDistance: 300,
        scrollFrom: 'top',
        scrollSpeed: 500,
        easingType: 'linear',
        animation: 'fade',
        animationSpeed: 200,
        scrollTrigger: false,
        scrollTarget: false,
        scrollText: '<i class="fa fa-chevron-up"></i>',
        scrollTitle: false,
        scrollImg: false,
        activeOverlay: false,
        zIndex: 2147483647
    });

    // Counter
    function isCounterElementVisible($elementToBeChecked) {
        var TopView = $(window).scrollTop();
        var BotView = TopView + $(window).height();
        var TopElement = $elementToBeChecked.offset().top;
        var BotElement = TopElement + $elementToBeChecked.height();
        return ((BotElement <= BotView) && (TopElement >= TopView));
    }

    $(window).on('scroll', function () {
        $(".counter").each(function () {
            var isOnView = isCounterElementVisible($(this));
            if (isOnView && !$(this).hasClass('Starting')) {
                $(this).addClass('Starting');
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 3000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            }
        });
    });


    // Countdown activation
    $(function () {
        // Add background image
        //$.backstretch('../img/nature.jpg');
        var endDate = "December  27, 2019 15:03:25";
        $('.countdown.simple').countdown({
            date: endDate
        });
        $('.countdown.styled').countdown({
            date: endDate,
            render: function (data) {
                $(this.el).html("<div>" + this.leadingZeros(data.days, 3) + " <span>Days</span></div><div>" + this.leadingZeros(data.hours, 2) + " <span>Hours</span></div><div>" + this.leadingZeros(data.min, 2) + " <span>Minutes</span></div><div>" + this.leadingZeros(data.sec, 2) + " <span>Seconds</span></div>");
            }
        });
        $('.countdown.callback').countdown({
            date: +(new Date) + 10000,
            render: function (data) {
                $(this.el).text(this.leadingZeros(data.sec, 2) + " sec");
            },
            onEnd: function () {
                $(this.el).addClass('ended');
            }
        }).on("click", function () {
            $(this).removeClass('ended').data('countdown').update(+(new Date) + 10000).start();
        });

    });

    $(".range-slider-ui").each(function () {
        var minRangeValue = $(this).attr('data-min');
        var maxRangeValue = $(this).attr('data-max');
        var minName = $(this).attr('data-min-name');
        var maxName = $(this).attr('data-max-name');
        var unit = $(this).attr('data-unit');

        $(this).append("" +
            "<span class='min-value'></span> " +
            "<span class='max-value'></span>" +
            "<input class='current-min' type='hidden' name='" + minName + "'>" +
            "<input class='current-max' type='hidden' name='" + maxName + "'>"
        );
        $(this).slider({
            range: true,
            min: minRangeValue,
            max: maxRangeValue,
            values: [minRangeValue, maxRangeValue],
            slide: function (event, ui) {
                event = event;
                var currentMin = parseInt(ui.values[0], 10);
                var currentMax = parseInt(ui.values[1], 10);
                $(this).children(".min-value").text(currentMin + " " + unit);
                $(this).children(".max-value").text(currentMax + " " + unit);
                $(this).children(".current-min").val(currentMin);
                $(this).children(".current-max").val(currentMax);
            }
        });

        var currentMin = parseInt($(this).slider("values", 0), 10);
        var currentMax = parseInt($(this).slider("values", 1), 10);
        $(this).children(".min-value").text(currentMin + " " + unit);
        $(this).children(".max-value").text(currentMax + " " + unit);
        $(this).children(".current-min").val(currentMin);
        $(this).children(".current-max").val(currentMax);
    });

    // Select picket
    $('.selectpicker').selectpicker();

    // Search option's icon toggle
    $('.search-options-btn').on('click', function () {
        $('.search-section').toggleClass('show-search-area');
        $('.search-options-btn .fa').toggleClass('fa-chevron-down');
    });

    // Carousel with partner initialization
    (function () {
        $('#ourPartners').carousel({
            interval: 3600
        });
    }());

    (function () {
        $('.our-partners .item').each(function () {
            var itemToClone = $(this);
            for (var i = 1; i < 4; i++) {
                itemToClone = itemToClone.next();
                if (!itemToClone.length) {
                    itemToClone = $(this).siblings(':first');
                }
                itemToClone.children(':first-child').clone()
                    .addClass("cloneditem-" + (i))
                    .appendTo($(this));
            }
        });
    }());

    // Background video playing script
    $(document).ready(function () {
        $(".player").mb_YTPlayer({
            mobileFallbackImage: '../img/banner/banner-1.jpg'
        });
    });

    // Multilevel menuus
    $('[data-submenu]').submenupicker();

    // Expending/Collapsing advance search content
    $('.show-more-options').on('click', function () {
        if ($(this).find('.fa').hasClass('fa-minus-circle')) {
            $(this).find('.fa').removeClass('fa-minus-circle');
            $(this).find('.fa').addClass('fa-plus-circle');
        } else {
            $(this).find('.fa').removeClass('fa-plus-circle');
            $(this).find('.fa').addClass('fa-minus-circle');
        }
    });

    var videoWidth = $('.sidebar-widget').width();
    var videoHeight = videoWidth * .61;
    $('.sidebar-widget iframe').css('height', videoHeight);


    // Megamenu activation
    $(".megamenu").on("click", function (e) {
        e.stopPropagation();
    });

    // Dropdown activation
    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');


        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-submenu .show').removeClass("show");
        });

        return false;
    });

    // Datetimepicker init
    $('.datetimes').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $('.datetimes-left').daterangepicker({
        opens: 'left',
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
    $('.datetimes-left, .datetimes').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });
    $('.datetimes-left, .datetimes').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });


    // Full  Page Search Activation
    $(function () {
        $('a[href="#full-page-search"]').on('click', function (event) {
            event.preventDefault();
            $('#full-page-search').addClass('open');
            $('#full-page-search > form > input[type="search"]').focus();
        });

        $('#full-page-search, #full-page-search button.close').on('click keyup', function (event) {
            if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
                $(this).removeClass('open');
            }
        });
    });


    // Slick Sliders
    $('.slick-carousel').each(function () {
        var slider = $(this);
        $(this).slick({
            infinite: true,
            dots: false,
            arrows: false,
            centerMode: true,
            centerPadding: '0'
        });

        $(this).closest('.slick-slider-area').find('.slick-prev').on("click", function () {
            slider.slick('slickPrev');
        });
        $(this).closest('.slick-slider-area').find('.slick-next').on("click", function () {
            slider.slick('slickNext');
        });
    });


    $(".dropdown.btns .dropdown-toggle").on('click', function () {
        $(this).dropdown("toggle");
        return false;
    });



    // Dropzone initialization
    Dropzone.autoDiscover = false;
    $(function () {
        $("div#myDropZone").dropzone({
            url: "/file-upload"
        });
    });

    // Filterizr initialization
    $(function () {
        //$('.filtr-container').filterizr();
    });

    function toggleChevron(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".fa")
            .toggleClass('fa-minus fa-plus');
    }

    $('.panel-group').on('shown.bs.collapse', toggleChevron);
    $('.panel-group').on('hidden.bs.collapse', toggleChevron);

    // Switching Color schema
    function populateColorPlates() {
        var plateStings = '<div class="option-panel option-panel-collased">\n' +
            '    <h2>Change Color</h2>\n' +
            '    <div class="color-plate default-plate" data-color="default"></div>\n' +
            '    <div class="color-plate midnight-blue-plate" data-color="midnight-blue"></div>\n' +
            '    <div class="color-plate yellow-plate" data-color="yellow"></div>\n' +
            '    <div class="color-plate blue-plate" data-color="blue"></div>\n' +
            '    <div class="color-plate green-light-plate" data-color="green-light"></div>\n' +
            '    <div class="color-plate yellow-light-plate" data-color="yellow-light"></div>\n' +
            '    <div class="color-plate green-plate" data-color="green"></div>\n' +
            '    <div class="color-plate green-light-2-plate" data-color="green-light-2"></div>\n' +
            '    <div class="color-plate red-plate" data-color="red"></div>\n' +
            '    <div class="color-plate purple-plate" data-color="purple"></div>\n' +
            '    <div class="color-plate brown-plate" data-color="brown"></div>\n' +
            '    <div class="color-plate olive-plate" data-color="olive"></div>\n' +
            '    <div class="setting-button">\n' +
            '        <i class="fa fa-gear"></i>\n' +
            '    </div>\n' +
            '</div>';
        $('body').append(plateStings);
    }
    $(document).on('click', '.color-plate', function () {
        var name = $(this).attr('data-color');
        $('link[id="style_sheet"]').attr('href', 'css/skins/' + name + '.css');
    });

    $(document).on('click', '.setting-button', function () {
        $('.option-panel').toggleClass('option-panel-collased');
    });
});

// mCustomScrollbar initialization
(function ($) {
    $(window).resize(function () {
        $('#map').css('height', $(this).height() - 110);
        if ($(this).width() > 768) {
            $(".map-content-sidebar").mCustomScrollbar({
                theme: "minimal-dark"
            });
            $('.map-content-sidebar').css('height', $(this).height() - 110);
        } else {
            $('.map-content-sidebar').mCustomScrollbar("destroy"); //destroy scrollbar
            $('.map-content-sidebar').css('height', '100%');
        }
    }).trigger("resize");
})(jQuery);

function loadMainModalFavorite() {
    $("#mainModalFavorite").load("../template/th/madal/favorite.html", function () {
        $('#alert-error-favorite').hide();

        var templateformFavoriteCheckbox = $("#template-form-favorite-checkbox").html();
        $("#template-form-favorite-checkbox").html(bindDataListToTemplate(templateformFavoriteCheckbox, JSON.parse(JSON.stringify(DATA_CATEGORYS))));

    });
}

function clickBtnLogin() {

    $('#alert-error').hide();
    $('#alert-error-blank').hide();
    openLoading();

    var form = $('#form-login').serialize();
    var jsonForm = convertParameterURLToJsonDecode(form);

    if (jsonForm.username === "" || jsonForm.password === "") {
        setTimeout(function () {
            $('#alert-error-blank').show();
            closeLoading();
        }, 500);
    } else {
        setTimeout(function () {
            requestServiceAuthToken(form);
        }, 500);
    }
}

function clickBtnLogout() {
    openLoading();
    requestServiceInvokeToken();
}

function clickBtnRegister() {

    openLoading();
    $('#alert-error-register').hide();
    $('#alert-error-blank-register').hide();
    $('#alert-error-confirm-password').hide();

    var form = $('#form-register').serialize();
    var jsonForm = convertParameterURLToJsonDecode(form);

    console.log("clickBtnRegister", jsonForm)

    if (jsonForm.username === "" || jsonForm.password === "" || jsonForm.confirmPassword === "" || jsonForm.firstName === "" || jsonForm.lastName === "" || (jsonForm.gender != "Male" && jsonForm.gender != "Female")) {

        console.log("jsonForm.username === ", jsonForm.username === "")
        console.log("jsonForm.password === ", jsonForm.password === "")
        console.log("jsonForm.confirmPassword === ", jsonForm.confirmPassword === "")
        console.log("jsonForm.firstName === ", jsonForm.firstName === "")
        console.log("jsonForm.lastName === ", jsonForm.lastName === "")
        console.log('(jsonForm.gender != "Male" && jsonForm.gender != "Female")', (jsonForm.gender != "Male" && jsonForm.gender != "Female"))
        setTimeout(function () {
            $('#alert-error-blank-register').show();
            closeLoading();
        }, 500);
    } else {

        if (jsonForm.confirmPassword != jsonForm.password) {
            setTimeout(function () {
                console.log("confirm-password")
                $('#alert-error-confirm-password').show();
                closeLoading();
            }, 500);
        } else {

            setTimeout(function () {
                requestServiceAccountRegister(jsonForm);
            }, 500);
        }

    }
}

function clickBtnFavorite() {
    openLoading();
    var paramJSON = (convertParameterURLToJsonNotDecodeSupportArray($('#form-favorite').serialize()))
    paramJSON.birthday = moment(paramJSON.birthday).format("DD/MM/YYYY");
    var param = convertJsonToParameterURLNotEncodeSupportArray(paramJSON)
    requestServiceAccountFavorite(param);
}

function requestServiceInvokeToken() {
    // var dooSuccess = function (res) {

    // if (res && res.data.success) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expire");
    localStorage.removeItem("client_id");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");

    // $("#menu-login-group").show();
    // $("#menu-profile-group").hide();

    // closeLoading();
    location.reload();
    // } else {

    // closeLoading();
    // }
    // }

    // requestFormBodyService(URL_AUTH_INVOKE_TOKEN, "POST", "", dooSuccess);
}

function requestServiceAuthToken(param) {
    var dooSuccess = function (res) {
        if (res && res.data) {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("client_id", res.data.client_id);
            localStorage.setItem("expire", res.data.expire);
            if (document.getElementById("main-content-add-review")) {
                document.getElementById("main-content-add-review").removeAttribute("style");
                document.getElementById("login-for-review").setAttribute("style", "display: none");
            }
            requestServiceGetToken();
        } else {
            closeLoading();
            $('#alert-error').show();
        }
    }

    requestFormBodyService(URL_AUTH_TOKEN, "POST", param, dooSuccess);
}

function requestServiceGetToken() {
    var dooSuccess = function (res) {
        if (res && res.data.success) {
            console.log("requestServiceGetToken", res.data.user)
            localStorage.setItem("first_name", res.data.user.authFirstName);
            localStorage.setItem("last_name", res.data.user.authLastName);
            var templateHeaderNameMember = $("#header-name-member").html();
            $("#header-name-member").html(bindDataToTemplate(templateHeaderNameMember, {
                name_member: res.data.user.authFullName
            }));
            $("#menu-login-group").hide();
            $("#menu-profile-group").css("display", "flex");;
            closeLoading();
            $('#modalLogin').modal('hide');
        } else {
            localStorage.setItem("first_name", "");
            localStorage.setItem("last_name", "");
            var templateHeaderNameMember = $("#header-name-member").html();
            $("#header-name-member").html(bindDataToTemplate(templateHeaderNameMember, {
                name_member: "Member"
            }));
            $("#menu-login-group").hide();
            $("#menu-profile-group").css("display", "flex");;
            closeLoading();
            $('#modalLogin').modal('hide');
        }


        if (!res.data.user.isFavorite) {

            $('#modalFavorite').modal('show');
        } else {

            $('#modalFavorite').modal('hide');
        }



    }

    requestService(URL_AUTH_GET_TOKEN, "GET", "", dooSuccess);
}


function requestServiceAccountFavorite(param) {
    var dooSuccess = function (res) {
        $('#modalFavorite').modal('hide');
        closeLoading();
    }
    requestFormBodyService(URL_ACCOUNT_FAVORITE, "POST", param, dooSuccess);
}

function requestServiceAccountRegister(param) {

    var paramJson = param;

    var dooSuccess = function (res) {
        if (res && res.data) {
            if (res.data.success) {
                $('#modalRegister').modal('hide');

                $('#alert-error').hide();
                $('#alert-error-blank').hide();
                requestServiceAuthToken(convertJsonToParameterURLNotEncode({
                    username: paramJson.username,
                    password: paramJson.password,
                    client: "web",
                    grantType: "password",
                }));
            } else {
                $('#alert-error-register').show();
                var templateAlerteErrorRegister = $('#template-alert-error-register').html();
                $('#alert-error-register').html(bindDataToTemplate(templateAlerteErrorRegister, {
                    message: res.data.message
                }));
                closeLoading();
            }
        } else {
            $('#alert-error-register').show();
            var templateAlerteErrorRegister = $('#template-alert-error-register').html();
            $('#alert-error-register').html(bindDataToTemplate(templateAlerteErrorRegister, {
                message: "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง"
            }));
            closeLoading();
        }
    }

    requestFormBodyService(URL_ACCOUNT_REGISTER, "POST", convertJsonToParameterURLNotEncode(param), dooSuccess);
}

function clickMenuHeader(toPage) {
    window.location.href = "/" + PAGE_LANGUAGE + toPage
}

function clickMenuTypeHeader(category_id) {
    var param = {
        category_id: category_id
    };

    window.location.href = "/" + PAGE_LANGUAGE + "/search.html?" + convertJsonToParameterURL(param);
}

function clickChangeLanguage(lang) {
    if (window.location.href.indexOf("/blog/post/") > -1) {
        window.location.replace(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + "/" + INVERT_PAGE_LANGUAGE + "/blog/post/" + (typeof BLOG_AFTER_CHENGE_LANGUAGE.blog_id == "object" ? BLOG_AFTER_CHENGE_LANGUAGE.blog_id[INVERT_PAGE_LANGUAGE] : BLOG_AFTER_CHENGE_LANGUAGE.blog_id) + "/" + BLOG_AFTER_CHENGE_LANGUAGE.slug[INVERT_PAGE_LANGUAGE] + "/");
    } else if (window.location.href.indexOf("/blog/author/") > -1) {
        window.location.replace(window.location.protocol + '//' + window.location.hostname + ":" + window.location.port + "/" + INVERT_PAGE_LANGUAGE + "/blog/author/" + BLOGGER_USER.author + "/" + BLOGGER_USER.client_id + "/");
    } else {
        let page = window.location.href.split("/")[window.location.href.split("/").length - 1];
        // var paramInUrl = convertParameterURLToJson();
        // window.location.href = "../" + lang + "/" + page + "?" + convertJsonToParameterURL(paramInUrl);
        window.location.href = "../" + lang + "/" + page;
    }
}

function clickToSearehByType(id) {

    var param = {
        category_id: id
    };
    window.location.href = "./search.html?text=&" + convertJsonToParameterURL(param);
}

function clickToSearehEventByType(id) {

    var param = {
        category_id: id
    };
    window.location.href = "./search-event.html?text=&" + convertJsonToParameterURL(param);
}

function clickToSearehTipsByType(id) {

    var param = {
        category_id: id
    };
    window.location.href = "./search-tips.html?text=&" + convertJsonToParameterURL(param);
}

function clickToSearehArticleByType() {

    var param = {
        category_id: id
    };
    window.location.href = "./search-article.html?text=&" + convertJsonToParameterURL(param);
}

function clickToDetailEvent(id, name) {

    var param = {
        id: id,
        name: name
    };
    window.location.href = "./detail-event.html?" + convertJsonToParameterURL(param);
}

function clickToDetailTips(id, name) {

    var param = {
        id: id,
        name: name
    };
    window.location.href = "./detail-tips.html?" + convertJsonToParameterURL(param);
}

function clickToBlogDetail(id, slug) {
    if (typeof slug === "object") {
        slug = slug[PAGE_LANGUAGE];
    } else {
        slug = slug;
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/blog/post/" + id + "/" + slug + "/";
}

function clickToDetail(category_name, company_name, meta_id, company_id, category_id, lang) {
    var param = {
        category_name: category_name,
        company_name: company_name,
        meta_id: meta_id,
        company_id: company_id,
        category_id: category_id,
        lang: lang
    }

    if (typeof param.category_name === "object") {
        param.category_name = param.category_name[PAGE_LANGUAGE];
    } else {
        param.category_name = param.category_name;
    }

    window.location.href = "./detail.html?" + convertJsonToParameterURL(param);
}

function clickMorePage(endpoint, apiName) {
    var paramInUrl = convertParameterURLToJson();
    var param = {
        ...paramInUrl,
        endpoint: endpoint,
        apiName: apiName,
        text: ""
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more.html?" + convertJsonToParameterURL(param);
}

function clickMorePageTrip(endpoint, apiName) {
    var paramInUrl = convertParameterURLToJson();
    var param = {
        ...paramInUrl,
        endpoint: endpoint,
        apiName: apiName,
        text: ""
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-tips.html?" + convertJsonToParameterURL(param);
}

function clickMorePageEvent(endpoint, apiName) {
    var paramInUrl = convertParameterURLToJson();
    var param = {
        ...paramInUrl,
        endpoint: endpoint,
        apiName: apiName,
        text: ""
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-event.html?" + convertJsonToParameterURL(param);
}

function clickMorePageArticle(endpoint, apiName) {
    var paramInUrl = convertParameterURLToJson();
    var param = {
        ...paramInUrl,
        endpoint: endpoint,
        apiName: apiName,
        text: ""
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-article.html?" + convertJsonToParameterURL(param);
}

function onClickMorePageType(endpoint, apiName) {
    var paramInUrl = convertParameterURLToJson();
    var param = {
        ...paramInUrl,
        endpoint: endpoint,
        apiName: apiName,
        text: ""
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-type.html?" + convertJsonToParameterURL(param);
}

function clickMoreFirstPage(endpoint, apiName) {
    var param = {
        endpoint: endpoint,
        apiName: apiName,
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-first.html?" + convertJsonToParameterURL(param);
}

function clickMoreFirstPageEvent(endpoint, apiName) {
    var param = {
        endpoint: endpoint,
        apiName: apiName,
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-event-first.html?" + convertJsonToParameterURL(param);
}



function clickMoreFirstPageTips(endpoint, apiName) {
    var param = {
        endpoint: endpoint,
        apiName: apiName,
    }
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/more-tips-first.html?" + convertJsonToParameterURL(param);
}

function clickMenuFooter(page) {
    window.location.href = "/" + PAGE_LANGUAGE.toLowerCase() + "/" + page;
}