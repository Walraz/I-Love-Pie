$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".nav-trigger").addClass("bg-color");
    } else {
        $(".nav-trigger").removeClass("bg-color");
    }
});