(function() {
    window.number = 0;
    window.h = !1;
    window.f = !1;
    window.fan = !1;
    window.op = !1;
    var num = 0,
        ws, yu = 200,
        hookmessage, hooksend, xxx = 60,
        yyy = 60,
        me = [],
        ren = [];
    var hook = window.WebSocket;
    window.WebSocket = function(protocols) {

        ws = new hook(protocols);

        hooksend = ws.send;

        ws.send = function(data) {
            var datas = jie(data)
            let s = ce3(datas)
            if (s == 0) {
                hooksend.call(ws, data);
            } else {
                return
            }
        };

        ws.addEventListener('message', function(event) {
            if (window.number < 2) {
                window.number++
            }
            if (window.number == 1) {
                hookmessage = ws.onmessage
            }
            ws.onmessage = function(e) {
                var datas = jie(e.data)
                ce4(datas, e)
            }
        });

        ws.addEventListener('close', function(event) {
            alert("断开连接")
        });

        return ws;
    };

    const button = document.createElement('button');
    button.textContent = '验证';
    button.className = 'floating-button';

    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', function() {
        button.style.display = 'none';
        huo()
    });

    document.body.appendChild(button);

    function fa(message) {
        let data = jia(message)
        hooksend.call(ws, data);
    }

    function zuo(e) {
        if (window.op) {
            if (e.includes('move')) {
                let arr = ce(e)
                if (arr[0].uuid !== me[0].uuid) {
                    let ji = 0
                    for (let t = 0; t < ren.length; t++) {
                        if (ren[t].uuid == arr[0].uuid) {
                            ren[t].x = arr[0].x
                            ren[t].y = arr[0].y
                        } else {
                            ji++
                        }
                    }
                    if (ji == ren.length) {
                        ren = [...ren, ...arr]
                    }
                }
            } else if (e.includes('$leave')) {
                let arr = ce2(e)
                ren = ren.filter(obj => obj.uuid !== arr);
            } else if (e.includes('$playerdata')) {
                ren = [];
                let arr = ce1(e)
                if (arr[0].uuid !== me[0].uuid) {
                    let ji = 0
                    for (let t = 0; t < ren.length; t++) {
                        if (ren[t].uuid == arr[0].uuid) {
                            ren[t].x = arr[0].x
                            ren[t].y = arr[0].y
                        } else {
                            ji++
                        }
                    }
                    if (ji == ren.length) {
                        ren = [...ren, ...arr]
                    }
                }
            } else if (e.includes('$newplayer')) {
                const Data = JSON.parse(e);
                const arr = [{
                    name: Data.v.name,
                    uuid: Data.v.uuid,
                    x: Data.v.x,
                    y: Data.v.y
                }];
                ren = [...ren, ...arr]
            } else {
                return;
            }
        }
    }

    function ce(jsonData) {
        const Data = JSON.parse(jsonData);
        const arr = [{
            name: me[0].name,
            uuid: Data.v.uuid,
            x: Data.v.x,
            y: Data.v.y
        }];
        return arr;
    }

    function ce1(jsonData) {
        const Data = JSON.parse(jsonData);
        var arr = Data.v.map(item => {
            return {
                name: item.name,
                uuid: item.uuid,
                x: item.x,
                y: item.y
            };
        });
        return arr;
    }

    function ce2(jsonData) {
        const Data = JSON.parse(jsonData);
        const arr = Data.v.uuid;
        return arr;
    }

    function ce3(datas) {
        if (datas.includes('move')) {
            window.op = !0
            me = ce(datas)
            if (datas.includes('pick') || datas.includes('throw')) {
                if (window.fan) {
                    for (let o = 0; o < ren.length; o++) {
                        if (ren[o].x >= me[0].x - xxx && ren[o].x < me[0].x && ren[o].y <= me[0].y + yyy && ren[o].y >= me[0].y - yyy) {
                            fa(`{"k":"move","v":{"t":"throw","uuid":${me[0].uuid},"dir":0,"target":${ren[o].uuid},"x":${me[0].x},"y":${me[0].y}}}`)
                        } else if (ren[o].x <= me[0].x + xxx && ren[o].x > me[0].x && ren[o].y <= me[0].y + yyy && ren[o].y >= me[0].y - yyy) {
                            fa(`{"k":"move","v":{"t":"throw","uuid":${me[0].uuid},"dir":1,"target":${ren[o].uuid},"x":${me[0].x},"y":${me[0].y}}}`)
                        }
                    }
                    return 0;
                }
            } else if (datas.includes('warp')) {
                return 1;
            }
        } else if (datas.includes('login')) {
            const Data = JSON.parse(datas);
            me = [{
                name: Data.v.name,
                uuid: 0,
                x: 0,
                y: 0
            }]
        }
        return 0;
    }

    function ce4(datas, e) {
        zuo(datas)
        if (datas.includes('throw')) {
            if (window.f) {
                hookmessage('d2po')
            } else {
                hookmessage(e)
            }
        } else if (datas.includes('$flash')) {
            if (window.h) {
                hookmessage('d2po')
            } else {
                hookmessage(e)
            }
        } else {
            hookmessage(e)
        }
    }

    function ti(message, duration) {
        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(function() {
            notification.style.opacity = 0;
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 1000);
        }, duration);
    }

    function god() {
        let e = {
            data: `eyJrIjoiJGdvZCJ9`
        }
        hookmessage(e)
    }

    function title(str) {
        let e = {
            data: `{"k":"$title","v":{"title":"${str}","uuid":"${me[0].uuid}"}}`
        }
        e.data = jia(e.data)
        hookmessage(e)
    }

    // 加密函数
    function jia(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // 解密函数
    function jie(encodedStr) {
        return decodeURIComponent(escape(atob(encodedStr)));
    }

    function huo() {
        let box = document.createElement('div');
        box.id = "1";
        box.style.left = "0px"
        box.style.top = "0px"
        box.style.position = "fixed"
        box.style['z-index'] = "999999"
        box.innerHTML = `
        <div class="web_notice">
    <div>
        <h3>辅助公告</h3>
        <div style="text-align:center;color:#000;">间隔是速度间隔越小速度越快</div>
        <a onclick="javascript:document.querySelector('.web_notice').remove()" style="color:#ffffff;">我知道了</a>
    </div>
</div>
 
<style>
.web_notice {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 999999999999;
    display: flex;
    align-items: center;
    justify-content: center;
}
 
.web_notice > div {
    width: 550px;
    background: #FFF;
    border-radius: 40px;
    padding: 50px 40px;
}
 
.web_notice h3 {
    font-weight: bold;
    text-align: center;
    font-size: 30px;
}
 
.web_notice div {
    font-size: 16px;
    margin-top: 26px;
    line-height: 30px;
    color: #999;
}
 
.web_notice a {
    display: block;
    background: #ff3300;
    color: #FFF;
    text-align: center;
    font-weight: bold;
    font-size: 19px;
    line-height: 60px;
    margin: 0 auto;
    margin-top: 45px;
    border-radius: 32px;
    width: 80%;
}
 
@media (max-width: 768px) {
    .web_notice > div {
        width: 80%;
    }
}
</style>

     <style>
        /* 添加样式 */
        #xuanfu {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 250px;
            height: 250px;
            background: lightblue;
            z-index: 99999;
            /* global 94%+ browsers support */
background: linear-gradient(0deg,#EEEE07 0%,#9BE15D 45.25%,#00E3AE 90.34%); 

/* safari 5.1+,chrome 10+ */
background: -webkit-linear-gradient(0deg,#EEEE07 0%,#9BE15D 45.25%,#00E3AE 90.34%);

/* ff 3.6+ */
background: -moz-linear-gradient(0deg,#EEEE07 0%,#9BE15D 45.25%,#00E3AE 90.34%);

/* opera 11.10+ */ 
background: -o-linear-gradient(0deg,#EEEE07 0%,#9BE15D 45.25%,#00E3AE 90.34%);

/* ie 10+ */
background: -ms-linear-gradient(0deg,#EEEE07 0%,#9BE15D 45.25%,#00E3AE 90.34%);
        }
        #xuanfu2 {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 250px;
            height: 20px;
            background: lightblue;
            background-color: #FFFFFF;
            z-index: 999999;
        }
        .button {background-color: #00FFFF;}  
        
        .notification {
            position: fixed;
            top: 5%;
            left: 2%;
            padding: 15px;
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 9999999;
            opacity: 1;
            transition: opacity 0.3s ease-in-out;
        }
 
        .notification:hover {
            opacity: 0.8;
        }  
        
.switch {
  position: relative;
  display: inline-block;
  width: 40px; /* 设置开关的宽度 */
  height: 20px; /* 设置开关的高度 */
  margin-right: 15px; /* 设置开关之间的水平间距 */
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .2s;
  border-radius: 20px; /* 将滑块改为椭圆形 */
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  transition: .1s;
  border-radius: 50%; /* 将滑块拇指改为椭圆形 */
}
input:checked +.slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

    </style>
        <div id="xuanfu">
            <br>
                <label class="switch">
                    <input type="checkbox" id="switch1">
                        <span class="slider"></span>
                </label>
                <label class="switch">
                    <input type="checkbox" id="switch2">
                        <span class="slider"></span>
                </label>
                <label class="switch">
                    <input type="checkbox" id="switch3">
                        <span class="slider"></span>
                </label>
                <label class="switch">
                    <input type="checkbox" id="switch4">
                        <span class="slider"></span>
                </label>
            <br>
            <p3>防红光&nbsp;&nbsp;&nbsp;防推&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;瞬移&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称号</p3>
            <br>        
    <input id="input2" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" size="5" placeholder="输入横向">
    <button id="inputButton" class="button">范围x</button>
    <input id="input3" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" size="5" placeholder="输入纵向">
    <button id="inputButton1" class="button">范围y</button>
    <br>
    <input id="input1" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" size="5" placeholder="输入间隔">
    <button id="gua4" class="button">全图</button> 
    <button id="guan1" class="button">关闭范围</button>
    <br>    
    <input id="input4" type="text" placeholder="输入uuid">
    <button id="gua5" class="button">精准打人</button>
    <button id="gua6" class="button">瞬移过去</button>
    <button id="gua7" class="button">查看</button>
    <br>
    <button id="gua3" class="button">隐身</button>
    <br>
    <input id="x2" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" size="5" placeholder="输入半径">
    <input id="x3" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" size="5" placeholder="输入间隔">
    <input id="x4" type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4)" size="5" placeholder="输入角度">
    <label class="switch">
           <input type="checkbox" id="switch5">
                 <span class="slider"></span>
    </label>   
    <p3>旋转</p3>
    </div>
    <div id="xuanfu2">
    <p1>WTFgame 国庆版1.8.0</p1>
    <button id="three" style="position: absolute; right:0; ">-</button>
    </div>
 `

        document.body.appendChild(box);

        var xuanfu = document.getElementById('xuanfu');
        var three = document.getElementById('three');
        var input = document.getElementById('input2');
        var input1 = document.getElementById('input3');
        var input3 = document.getElementById('input1');
        var input4 = document.getElementById('input4');
        var xuanfu2 = document.getElementById('xuanfu2');

        let isDragging = false;
        let offsetX, offsetY;

        box.onclick = function(event) {
            if (event.target.id == "three") {
                if (num == 0) {
                    xuanfu.style.visibility = 'hidden';
                    three.textContent = '+'
                    num = 1
                } else {
                    xuanfu.style.visibility = 'visible';
                    three.textContent = '-'
                    num = 0
                }
            } else if (event.target.id == "inputButton") {
                ti('修改成功', 2000)
                var value = input.value;
                xxx = parseInt(value, 10)
                window.fan = !0
            } else if (event.target.id == "inputButton1") {
                ti('修改成功', 2000)
                var value = input1.value;
                yyy = parseInt(value, 10)
                window.fan = !0
            } else if (event.target.id == "guan1") {
                ti('关闭成功', 2000)
                window.fan = !1
            } else if (event.target.id == "gua3") {
                fa(`{"k":"move","v":{"t":"flag","uuid":${me[0].uuid},"x":${me[0].x},"y":${me[0].y}}}`)
            } else if (event.target.id == "gua4") {
                var value = input3.value;
                yu = parseInt(value, 10)
                for (let o = 0; o < ren.length; o++) {
                    setTimeout(function() {
                        fa(`{"k":"move","v":{"t":"throw","uuid":${me[0].uuid},"dir":1,"target":${ren[o].uuid},"x":480,"y":-700}}`)
                    }, yu * o)
                }
            } else if (event.target.id == "gua6") {
                var value = input4.value;
                var p = parseInt(value, 10)
                for (let o = 0; o < ren.length; o++) {
                    if (ren[o].uuid == p) {
                        fa(`{"k":"move","v":{"t":"throw","uuid":${me[0].uuid},"dir":1,"x":${ren[o].x},"y":${ren[o].y}}}`)
                    }
                }
            } else if (event.target.id == "gua5") {
                var value = input4.value;
                var p = parseInt(value, 10)
                fa(`{"k":"move","v":{"t":"throw","uuid":${me[0].uuid},"dir":1,"target":${p},"x":${me[0].x},"y":${me[0].y}}}`)
            } else if (event.target.id == "gua7") {
                let a = "";
                for (let o = 0; o < ren.length; o++) {
                    a += "\n名字:" + ren[o].name + "      uuid:" + ren[o].uuid
                }
                alert(a)
            }
        }

        xuanfu.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - xuanfu.getBoundingClientRect()
                .left;
            offsetY = e.clientY - xuanfu.getBoundingClientRect()
                .top;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                xuanfu.style.left = e.clientX - offsetX + 'px';
                xuanfu.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        xuanfu2.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - xuanfu.getBoundingClientRect()
                .left;
            offsetY = e.clientY - xuanfu.getBoundingClientRect()
                .top;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                xuanfu2.style.left = e.clientX - offsetX + 'px';
                xuanfu2.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        var switch1 = document.getElementById('switch1');
        var switch2 = document.getElementById('switch2');
        var switch3 = document.getElementById('switch3');
        var switch4 = document.getElementById('switch4');
        var switch5 = document.getElementById('switch5');

        switch1.addEventListener('change', function() {
            if (this.checked) {
                ti('修改成功', 2000)
                window.h = !0
            } else {
                ti('关闭成功', 2000)
                window.h = !1
            }
        });

        switch2.addEventListener('change', function() {
            if (this.checked) {
                ti('修改成功', 2000)
                window.f = !0
            } else {
                ti('关闭成功', 2000)
                window.f = !1
            }
        });

        switch3.addEventListener('change', function() {
            if (this.checked) {
                ti('修改成功', 2000)
                god()
            } else {
                ti('关闭成功', 2000)
                god()
            }
        });
        switch4.addEventListener('change', function() {
            if (this.checked) {
                ti('修改成功', 2000)
                let e = prompt("输入自定义称号")
                title(e)
            } else {
                ti('关闭成功', 2000)
                title('')
            }
        });

        switch5.addEventListener('change', function() {
            if (this.checked) {
                ti('开启成功', 2000)
                start()
            } else {
                ti('关闭成功', 2000)
                stop()
            }
        });

        let timer;

        function start() {
            var x2 = document.getElementById('x2');
            var x3 = document.getElementById('x3');
            var x4 = document.getElementById('x4');
            let angle = 0;
            const centerX = me[0].x;
            const centerY = me[0].y;
            const radius = parseInt(x2.value, 10);
            timer = setInterval(function() {
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                me[0].x = x;
                me[0].y = y;
                let e = {
                    data: `{"k":"$move","v":{"t":"throw","uuid":${me[0].uuid},"target":0,"dir":1,"x":${me[0].x},"y":${me[0].y}}}`
                }
                e.data = jia(e.data)
                hookmessage(e)
                fa(`{"k":"move","v":{"t":"pos","uuid":${me[0].uuid},"x":${me[0].x},"y":${me[0].y}}}`)
                angle += parseInt(x4.value, 10);
            }, parseInt(x3.value, 10));
        }

        function stop() {
            clearInterval(timer);
        }

    }

})();
