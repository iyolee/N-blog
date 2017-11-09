const formidable = require('formidable');
const db = require('../models/db');
const md5 = require('../models/md5');
const path = require('path');
const fs = require('fs');
const gm = require('gm');

//首页
exports.showIndex = (req, res, next) => {
  // if (req.session.login == "1") {
  //     //如果登录
  //     var username = req.session.username;
  //     var login = true;
  //     db.find('users', {
  //         "username": username,
  //     }, (err, result) => {
  //         var avatar = result[0].avatar;
  //         res.render('index', {
  //             "login": login,
  //             "username": username,
  //             "active": '首页',
  //             "avatar": avatar
  //         });
  //     });
  // } else {
  //没有登录
  var username = ''; //生成一个空用户名
  var login = false;
  res.render('index', {
    login: login,
    username: username,
    active: '首页'
    // "avatar": 'previous.jpg'
  });
  //}
};

//注册页面
exports.showRegister = (req, res, next) => {
  res.render('register', {
    login: req.session.login == '1' ? true : false,
    username: req.session.login == '1' ? req.session.username : '',
    active: '注册'
  });
  next();
};

//注册业务
exports.doRegister = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields) => {
    var username = fields.username;
    let password = fields.password;
    var _password = md5(md5(password) + 'leeper');
    var avatar = 'previous.jpg';
    db.find(
      'users',
      {
        username: username
      },
      (err, result) => {
        if (err) {
          res.send('-3'); //服务器错误
          return;
        }
        if (result.length !== 0) {
          res.send('-1'); //用户已经存在
          return;
        }
        db.insertOne(
          'users',
          {
            username: username,
            password: _password,
            avatar: avatar
          },
          (err, result) => {
            if (err) {
              res.send('-3'); //服务器错误
              return;
            }
            req.session.login = '1';
            req.session.username = username;
            res.send('1');
          }
        );
      }
    );
  });
};

//登录界面
exports.showLogin = (req, res, next) => {
  res.render('login', {
    login: false,
    username: '',
    active: '登录'
  });
};

//登录业务
exports.doLogin = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    var username = fields.username;
    let password = fields.password;
    var _password = md5(md5(password) + 'leeper');
    db.find(
      'users',
      {
        username: username
      },
      (err, result) => {
        if (err) {
          res.send('-3'); //服务器错误
          return;
        }
        if (result.length == 0) {
          res.send('-1'); //用户不存在
          return;
        }
        if (_password == result[0].password) {
          req.session.login = '1';
          req.session.username = username;
          res.send('1');
          return;
        } else {
          res.send('-2'); //密码错误
          return;
        }
      }
    );
  });
};

//退出登录
exports.logout = (req, res, next) => {
  req.session.login = false;
  res.redirect('/');
};

//头像上传页面
exports.showAvatar = (req, res, next) => {
  if (req.session.login != '1') {
    res.render('error');
    return;
  }
  db.find(
    'users',
    {
      username: req.session.username
    },
    (err, result) => {
      res.render('setavatar', {
        login: true,
        username: req.session.username,
        active: '修改头像',
        avatar: result[0].avatar
      });
    }
  );
};

//头像设置
exports.doSetavatar = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = path.normalize(__dirname + '/../avatar');
  form.parse(req, (err, fields, files) => {
    let oldpath = files.avatar.path;
    let newpath =
      path.normalize(__dirname + '/../avatar') +
      '/' +
      req.session.username +
      '.jpg';
    fs.rename(oldpath, newpath, err => {
      if (err) {
        res.send('error');
        return;
      }
      req.session.avatar = req.session.username + '.jpg';
      res.redirect('/showCut');
    });
  });
};

//头像切割页面
exports.showCut = (req, res, next) => {
  if (req.session.login != '1') {
    res.end('该页面不存在！');
    return;
  }
  res.render('cutAvatar', {
    avatar: req.session.avatar
  });
};

//执行头像切割
exports.doCut = (req, res, next) => {
  if (req.session.login != '1') {
    res.end('页面不存在');
    return;
  }
  var filename = req.session.avatar;
  let w = req.query.w;
  let h = req.query.h;
  let x = req.query.x;
  let y = req.query.y;

  gm('./avatar/' + filename)
    .crop(w, h, x, y)
    .resize(100, 100, '!')
    .write('./avatar/' + filename, err => {
      if (err) {
        res.send('-1');
        return;
      }
      db.updateMany(
        'users',
        {
          username: req.session.username
        },
        {
          $set: {
            avatar: req.session.avatar
          }
        },
        (err, result) => {
          res.send('1');
        }
      );
    });
};

//发表
exports.doPost = (req, res, next) => {
  if (req.session.login != '1') {
    res.end('not found');
    return;
  }
  var username = req.session.username;
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.hash = false;
  form.parse(req, (err, fields, files) => {
    let content = fields.content;
    console.log(fields.content);
    db.insertOne(
      'posts',
      {
        username: username,
        datetime: new Date().toLocaleDateString(),
        content: content
      },
      (err, result) => {
        if (err) {
          res.send('-3'); // 服务器错误
          return;
        } else {
          res.send('1'); // 发表成功
        }
      }
    );
  });
};

// 删除说说
exports.deletePost = (req, res, next) => {
  var username = req.session.username;
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.hash = false;
  form.parse(req, (err, fields, files) => {
    let content = fields.content;
    console.log(fields.content);
    db.deleteMany(
      'posts',
      {
        username: username,
        content: content
      },
      (err, result) => {
        if (err) {
          res.send('-3'); // 服务器错误
        } else {
          res.send('1'); // 删除成功
        }
      }
    );
  });
};

// 更新说说
exports.updatePost = (req, res, next) => {
  var username = req.session.username;
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.hash = false;
  form.parse(req, (err, fields, files) => {
    let content = fields.content;
    let id = fields.id;
    console.log(fields.content);
    console.log(id);
    db.updateMany(
      'posts',
      {
        id: id
      },
      {
        content: content
      },
      (err, result) => {
        if (err) {
          res.send('-3'); // 服务器错误
        } else {
          res.send('1'); // 更新成功
        }
      }
    );
  });
}

//显示全部
exports.showAll = (req, res, next) => {
  if (req.session.login == '1') {
    db.find(
      'users',
      {
        username: req.session.username
      },
      (err, result) => {
        res.render('allsays', {
          login: true,
          username: req.session.username,
          active: '全部说说',
          avatar: result[0].avatar
        });
      }
    );
  } else if (req.session.login != '1') {
    res.render('error');
  }
};

//返回所有说说
exports.getsays = (req, res, next) => {
  let page = req.query.page;
  db.find(
    'posts',
    {},
    {
      pageamount: 18,
      page: page,
      sort: {
        datetime: -1
      }
    },
    (err, result) => {
      res.json(result);
    }
  );
};

//说说总数
exports.getcount = (req, res, next) => {
  db.getAllCount('posts', count => {
    res.send(count.toString());
  });
};

//获得某个用户信息
exports.getuserinfo = (req, res, next) => {
  let username = req.query.username;
  db.find(
    'users',
    {
      username: username
    },
    (err, result) => {
      if (err || result.length == 0) {
        res.json('');
        return;
      }
      var obj = {
        username: result[0].usesrname,
        avatar: result[0].avatar,
        _id: result[0]._id
      };
      res.json(obj);
    }
  );
};

//显示用户的个人主页
exports.showUser = (req, res, next) => {
  let user = req.params['user'];
  db.find(
    'posts',
    {
      username: user
    },
    (err, result) => {
      db.find(
        'users',
        {
          username: user,
        },
        {
          sort: {
            datetime: 1
          }
        },
        (err, result2) => {
          res.render('user', {
            login: true,
            username: req.session.username,
            user: user,
            active: '我的说说',
            contents: result,
            id: result[0]._id,
            avatar: result2[0].avatar
          });
        }
      );
    }
  );
};

//显示所有注册用户
exports.showUserList = (req, res, next) => {
  db.find('users', {}, (err, result) => {
    db.find(
      'users',
      {
        username: req.session.username
      },
      (err, result1) => {
        res.render('userlist', {
          login: true,
          username: req.session.username,
          active: '成员列表',
          allusers: result,
          avatar1: result1[0].avatar
        });
      }
    );
  });
};
