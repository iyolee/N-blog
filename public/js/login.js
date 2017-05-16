/*
 * @Author: leeper
 * @file: login.ejs 
 * @Date: 2017-05-15 16:20:42 
 */

var btn = document.querySelector('.btn');
btn.onclick = function () {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var errormsg = document.querySelector('.errormsg');
    var userNull = document.createTextNode('用户不存在！');
    var passwordErr = document.createTextNode('密码错误！');
    var serverErr = document.createTextNode('服务器错误！');

    ajax({
        type: "POST",
        url: "/doLogin",
        dataType: "json",
        async: true,
        data: {
            "username": username,
            "password": password
        },
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
                errormsg.appendChild(userNull);
                error.style.display = 'block';
                fadeIn(error);
            } else if (result == -2) {
                errormsg.appendChild(passwordErr);
                error.style.display = 'block';
                fadeIn(error);
            }
        },
        error: function (err) {
            if (result == -1) {
                errormsg.appendChild(serverErr);
                error.style.display = 'block';
            }
        }
    });
}