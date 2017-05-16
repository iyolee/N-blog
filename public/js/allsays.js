/*
 * @Author: leeper
 * @file: allsays.ejs 
 * @Date: 2017-05-16 16:20:42 
 */

ajax({
    type: "GET",
    url: "/getcount",
    dataType: "json",
    async: true,
    success: function (result) {
        var amount = result; //总数量
        ajax({
            type: "GET",
            url: "/allsay",
            dataType: "json",
            async: true,
            success: function (result) {
                pageamount = Math.ceil(amount / 18);
                let pagenum = document.getElementById('pagenum');
                for (let i = 1; i < pageamount + 1; i++) {
                    let oLi = document.createElement('li');
                    let oA = document.createElement('a');
                    let text = document.createTextNode(i);
                    oA.appendChild(text);
                    oLi.appendChild(oA);
                    pagenum.appendChild(oLi);
                }
                let aLi = document.querySelectorAll('#pagenum li');
                let a = document.querySelectorAll('#pagenum li a');
                aLi[0].setAttribute('class', 'active');
                for (let i = 0; i < pageamount; i++) {
                    a[i].onclick = function () {
                        for (let i = 0; i < pageamount; i++) {
                            aLi[i].removeAttribute('class');
                        }
                        aLi[i].setAttribute('class', 'active');
                        var page = i;
                        getPage(page);
                    }
                };
                let says = document.getElementById('says');
                let compiled = _.template(says.innerHTML);
                getPage(0);

                function getPage(page) {
                    //将现在的页面内容清除
                    var allsays = document.getElementById('allsays');
                    allsays.innerHTML = '';
                    ajax({
                        type: "GET",
                        url: "/allsay?page=" + page,
                        dataType: "json",
                        async: true,
                        success: function (result) {
                            iterator(0);

                            function iterator(i) {
                                if (i == result.length) {
                                    return;
                                }
                                ajax({
                                    type: "GET",
                                    url: "/allsay?page=" + page,
                                    dataType: "json",
                                    success: function (result) {
                                        ajax({
                                            type: "GET",
                                            dataType: "json",
                                            url: "/getuserinfo?username=" + result[i].username,
                                            success: (result2) => {
                                                result[i].avatar = result2.avatar;
                                                var htmlstring = compiled(result[i]);
                                                $("#allsays").append($(htmlstring));
                                                iterator(i + 1);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            },
            error: function (err) {}
        })
    },
    error: function (err) {}
});