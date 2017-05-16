/*
 * @Author: leeper
 * @file: register.ejs 
 * @Date: 2017-05-15 16:20:42 
 */

var btn = document.querySelector('.btn');
btn.onclick = function () {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    ajax({
        type: "POST",
        url: "/doRegister",
        dataType: "json",
        async: true,
        data: {
            "username": username,
            "password": password
        },
        contentType: "application/x-www-form-urlencoded",
        success: function (result) {
            var success = document.getElementById('success');
            var error = document.getElementById('error');

            function fadeIn(obj) {
                setTimeout(function () {
                    obj.style.display = 'none';
                }, 2000);
            }
            
            if (result == 1) {
                success.style.display = 'block';
                setTimeout(function () {
                    window.location.href = '/allsays';
                }, 2000);
            } else if (result == -1) {
                error.style.display = 'block';
                fadeIn(error);
            }
        },
        error: function (err) {
        }
    });
}