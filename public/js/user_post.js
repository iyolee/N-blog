/*
 * @Author: leeper
 * @file: user.ejs 
 * @Date: 2017-05-16 16:20:42 
 */

var btn = document.getElementById('deliver');
btn.onclick = function () {
    var content = document.getElementById('content').value;
    var errormsg = document.querySelector('.errormsg');
    var serverErr = document.createTextNode('服务器错误！');

    ajax({
        type: "POST",
        url: "/post",
        dataType: "text",
        async: true,
        data: {
            "content": content,
        },
        
        success: function (result) {
            var success = document.getElementById('success');
            var error = document.getElementById('error');

            function fadeIn(obj) {
                setTimeout(function () {
                    obj.style.display = 'none';
                }, 1000);
            }

            if (result == 1) {
                success.style.display = 'block';
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        },
        error: function (err) {}
    });
}