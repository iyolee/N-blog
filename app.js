const express = require('express');
const app = express();
const router = require('./router/router');
const session = require('express-session');


//使用session
app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use('/avatar', express.static('./avatar'));

app.get('/', router.showIndex);
app.get('/register', router.showRegister);
app.post('/doRegister', router.doRegister);
app.get('/login', router.showLogin);
app.get('/logout', router.logout);
app.post('/doLogin', router.doLogin);
app.get('/setavatar', router.showAvatar);
app.post('/doSetavatar', router.doSetavatar);
app.get('/showCut', router.showCut);
app.get('/doCut', router.doCut);
app.get('/allsays', router.showAll);
app.get('/allsay', router.getsays);
app.get('/getcount', router.getcount);
app.post('/post', router.doPost);
app.delete('/delete', router.deletePost);
app.post('/update', router.updatePost);
app.get('/getuserinfo', router.getuserinfo);
app.get('/user/:user', router.showUser);
app.get('post/:oid', router.showUser);
app.get('/userlist', router.showUserList);

app.listen(3000);