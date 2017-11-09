/*
 * @Author: leeper
 * @file: register.ejs 
 * @Date: 2017-05-15 16:20:42 
 */

var btn = document.querySelector('.btn');
btn.onclick = function() {
  var username = document.getElementById('username').value;
  var password1 = document.getElementById('password1').value;
  var password2 = document.getElementById('password2').value;

  var pattern = /^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z]).*$/;
  var checkUername = pattern.test(password1);
  if (username == '' || password1 == '') {
    window.alert('请填写用户名或密码！');
  } else {
    if (checkUername) {
      ajax({
        type: 'POST',
        url: '/doRegister',
        dataType: 'json',
        async: true,
        data: {
          username: username,
          password: password1
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function(result) {
          var success = document.getElementById('success');
          var error = document.getElementById('error');

          function fadeIn(obj) {
            setTimeout(function() {
              obj.style.display = 'none';
            }, 2000);
          }

          if (result == 1) {
            // 注册成功
            success.style.display = 'block';
            setTimeout(function() {
              window.location.href = '/allsays';
            }, 2000);
          } else if (result == -1) {
            // 用户名被占用
            error.style.display = 'block';
            fadeIn(error);
          }
        },
        error: function(err) {}
      });
    } else if (password1 !== password2) {
      window.alert('两次输入密码不一致！');
    } else {
      window.alert('请输入正确格式的密码！');
    }
  }
};
