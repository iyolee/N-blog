/*
 * @Author: leeper
 * @file: user.ejs 
 * @Date: 2017-05-16 16:20:42 
 */

var errormsg = document.querySelector('.errormsg');
var deletemsg = document.querySelector('.deletemsg');
var serverErr = document.createTextNode('服务器错误！');

// 发表说说
var btn = document.getElementById('deliver');
btn.onclick = function() {
  var content = document.getElementById('content').value;
  if (content == '') {
    window.alert('说说内容不能为空！');
  } else {
    $.ajax({
      type: 'POST',
      url: '/post',
      contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
      async: true,
      data: {
        content: content
      },
      dataType: 'text',
      success: function(result) {
        var success = document.getElementById('success');
        var error = document.getElementById('error');

        function fadeIn(obj) {
          setTimeout(function() {
            obj.style.display = 'none';
          }, 1000);
        }

        if (result == 1) {
          success.style.display = 'block';
          setTimeout(function() {
            window.location.reload();
          }, 1000);
        }
      },
      error: function(err) {}
    });
  }
};

// 删除说说
var content = document.getElementById('content').value;
var deleteBtn = document.querySelectorAll('.delete');
for (var i = 0; i < deleteBtn.length; i++) {
  deleteBtn[i].addEventListener('click', delePost);
}

function delePost(event) {
  var contentVal = document.querySelector('.contentVal').textContent.trim();
  $.ajax({
    type: 'DELETE',
    url: '/delete',
    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    async: true,
    data: {
      content: contentVal
    },
    dataType: 'text',
    success: function(result) {
      var delete_success = document.getElementById('delete-success');
      var error = document.getElementById('error');

      function fadeIn(obj) {
        setTimeout(function() {
          obj.style.display = 'none';
        }, 1000);
      }

      if (result == 1) {
        delete_success.style.display = 'block';
        setTimeout(function() {
          window.location.reload();
        }, 1000);
      }
    },
    error: function(err) {}
  });
}

// 更改说说
var contentArray = [];
var updateBtn = document.querySelectorAll('.update');

for (var j = 0; j < updateBtn.length; j++) {
  var contentVal = document
    .querySelectorAll('.contentVal')
    [j].textContent.trim();
  contentArray[j] = contentVal;
  (function(j) {
    updateBtn[j].onclick = function() {
      var update_content = document.getElementById('update-content');
      update_content.innerText = contentArray[j];
      var update_background = document.querySelector('#update-background');
      var updatePost = document.getElementById('updatePost');
      var update_deliver = document.getElementById('update-deliver');
      var update_content = document.getElementById('update-content');

      // var contentVal = document.querySelector('.contentVal').textContent.trim();
      // update_content.innerText = contentVal;

      update_background.setAttribute('class', 'background-opacity');
      updatePost.classList.remove('updateHidden');
      updatePost.classList.add('updateDisplay');

      update_deliver.onclick = function() {
        var update_content = document.getElementById('update-content').value;
        var id = document.querySelector('.one span').textContent.trim();
        console.log(id);
        console.log(update_content);
        if (update_content == '') {
          window.alert('说说内容不能为空！');
        } else {
          $.ajax({
            type: 'POST',
            url: '/update',
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            async: true,
            data: {
              id: id,
              content: update_content
            },
            dataType: 'text',
            success: function(result) {
              var success = document.getElementById('success');
              var error = document.getElementById('error');

              function fadeIn(obj) {
                setTimeout(function() {
                  obj.style.display = 'none';
                }, 1000);
              }

              if (result == 1) {
                success.style.display = 'block';
                setTimeout(function() {
                  window.location.reload();
                }, 1000);
              }
            },
            error: function(err) {}
          });
        }
      };
    };
  })(j);
  // addEventListener('click', updatePost(i));
  // update_content.innerText = contentArray[i];
}

// function updatePost(j) {
// var update_content = document.getElementById('update-content');

//   update_content.innerText = contentArray[j];
//   var update_background = document.querySelector('#update-background');
//   var updatePost = document.getElementById('updatePost');
//   var update_deliver = document.getElementById('update-deliver');
//   var update_content = document.getElementById('update-content');

//   // var contentVal = document.querySelector('.contentVal').textContent.trim();
//   // update_content.innerText = contentVal;

//   update_background.setAttribute('class', 'background-opacity');
//   updatePost.classList.remove('updateHidden');
//   updatePost.classList.add('updateDisplay');

//   update_deliver.onclick = function() {
//     var update_content = document.getElementById('update-content').value;
//     var id = document.querySelector('.one span').textContent.trim();
//     console.log(id);
//     console.log(update_content);
//     if (update_content == '') {
//       window.alert('说说内容不能为空！');
//     } else {
//       $.ajax({
//         type: 'POST',
//         url: '/update',
//         contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
//         async: true,
//         data: {
//           id: id,
//           content: update_content
//         },
//         dataType: 'text',
//         success: function(result) {
//           var success = document.getElementById('success');
//           var error = document.getElementById('error');

//           function fadeIn(obj) {
//             setTimeout(function() {
//               obj.style.display = 'none';
//             }, 1000);
//           }

//           if (result == 1) {
//             success.style.display = 'block';
//             setTimeout(function() {
//               window.location.reload();
//             }, 1000);
//           }
//         },
//         error: function(err) {}
//       });
//     }
//   };
// }
