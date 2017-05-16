$("input").click(function () {
    var w = parseInt($(".jcrop-holder>div:first").css("width"));
    var h = parseInt($(".jcrop-holder>div:first").css("height"));
    var x = parseInt($(".jcrop-holder>div:first").css("left"));
    var y = parseInt($(".jcrop-holder>div:first").css("top"));

    $.get("/doCut", {
        "w": w,
        "h": h,
        "x": x,
        "y": y
    }, function (result) {
        if (result == '1') {
            window.location.href = '/allsays';
        }
    });
});