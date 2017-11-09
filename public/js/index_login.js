/*
 * @Author: leeper
 * @file: index.ejs 
 * @Date: 2017-05-16 16:20:42 
 */

var btn = document.querySelector('.btn-success');
btn.onclick = function() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(username);
  var errormsg = document.querySelector('.errormsg');
  var userNull = document.createTextNode('用户不存在！');
  var passwordErr = document.createTextNode('密码错误！');
  var serverErr = document.createTextNode('服务器错误！');

  if (username == '' || password == '') {
    window.alert('密码或用户名不能为空！');
  } else {
    ajax({
      type: 'POST',
      url: '/doLogin',
      dataType: 'json',
      async: true,
      data: {
        username: username,
        password: password
      },
      success: function(result) {
        var success = document.getElementById('success');
        var error = document.getElementById('error');

        function fadeIn(obj) {
          setTimeout(function() {
            obj.style.display = 'none';
          }, 1000);
        }

        // 登录成功
        if (result == 1) {
          success.style.display = 'block';
          setTimeout(function() {
            window.location.href = '/allsays';
          }, 1000);
        } else if (result == -1) {
          // 用户不存在
          errormsg.textContent = '';
          errormsg.appendChild(userNull);
          error.style.display = 'block';
          fadeIn(error);
        } else if (result == -2) {
          // 密码错误
          errormsg.textContent = '';
          errormsg.appendChild(passwordErr);
          error.style.display = 'block';
          fadeIn(error);
        }
      },
      error: function(err) {
        if (result == -1) {
          errormsg.appendChild(serverErr);
          error.style.display = 'block';
        }
      }
    });
  }
};
