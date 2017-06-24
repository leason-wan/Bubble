//初始化常量
function init() {
    Box = document.getElementById('inner');
    T_bound = 0;
    L_bound = 0;
    R_bound = Box.clientWidth;
    B_bound = Box.clientHeight;
    bubbles = new Array();
}

//创建红泡泡
function redBubble(){
    var bubble = document.createElement('div');
    bubble.className = 'bubble_red';
    bubble.radius = 100;
    bubble.diameter = 200;
    bubble.style.left = (Math.random() * (R_bound - bubble.diameter)) + 'px';
    bubble.style.top = (Math.random() * (B_bound - bubble.diameter)) + 'px';
    Box.appendChild(bubble);
}

//创建蓝泡泡
function blueBubble(num){
    var clss = ['bubble_one', 'bubble_two', 'bubble_three'];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < num; i++) {
        var bubble = document.createElement('div');
        bubble.className = clss[Math.floor(Math.random() * (clss.length - 1))];
        switch (bubble.className) {
            case 'bubble_one':
                bubble.radius = 60;
                bubble.diameter = 120;
                break;
            case 'bubble_two':
                bubble.radius = 80;
                bubble.diameter = 160;
                break;
            case 'bubble_three':
                bubble.radius = 100;
                bubble.diameter = 200;
                break;
        }
        bubble.style.left = (Math.random() * (R_bound - bubble.diameter)) + 'px';
        bubble.style.top = (Math.random() * (B_bound - bubble.diameter)) + 'px';
        bubble.vx = Math.random() * 6 - 3;
        bubble.vy = Math.random() * 6 - 3;
        frag.appendChild(bubble);
        bubbles[i] = bubble;
    }
    Box.appendChild(frag);
}

//蓝色气泡运动
function blueMove(bubble) {
    var BL = bubble.offsetLeft;
    var BT = bubble.offsetTop;
    bounce = 0.8;
    bubble.style.left = (BL + bubble.vx) + 'px';
    bubble.style.top = (BT + bubble.vy) + 'px';
    // 边界检测
    if (BL + bubble.radius > R_bound) {
        bubble.style.left = '0px';
        bubble.vx *= bounce;
    } else if (BL < L_bound) {
        bubble.style.left = R_bound - bubble.radius + 'px';
        bubble.vx *= bounce;
    }
    if (BT + bubble.radius > B_bound) {
        bubble.style.top = '0px';
        bubble.vy *= bounce;
    } else if (BT < T_bound) {
        bubble.style.top = B_bound - bubble.radius + 'px';
        bubble.vy *= bounce;
    }
}

//红色气泡移动
function redMove() {
    var red = document.getElementsByClassName('bubble_red')[0];
    var inner = document.getElementById('inner');
    inner.addEventListener('mousemove', function (event) {
        red.style.left = mousePosition(event)[0];
        red.style.top = mousePosition(event)[1];
        var BL = red.offsetLeft;
        var BT = red.offsetTop;
        red_bound(red, BL, BT);
    }, false);
}

function mousePosition(event) {
    var objTop = getOffsetTop(document.getElementById("screen"));
    var objLeft = getOffsetLeft(document.getElementById("screen"));
    var mouseX = event.clientX + document.body.scrollLeft;
    var mouseY = event.clientY + document.body.scrollTop;
    var objX = mouseX - objLeft;
    var objY = mouseY - objTop;
    var P = [objX, objY];
    return P;
}

function getOffsetTop(obj) {
    var tmp = obj.offsetTop;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetTop;
        val = val.offsetParent;
    }
    return tmp;
}

function getOffsetLeft(obj) {
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

//红色气泡边界
function red_bound(bubble, BL, BT) {
    if (BL + bubble.radius > R_bound) {
        bubble.style.left = R_bound - bubble.radius + 'px';
    } else if (BL < L_bound) {
        bubble.style.left = '0px';
    }
    if (BT + bubble.radius > B_bound) {
        bubble.style.top = B_bound - bubble.radius + 'px';
    } else if (BT < T_bound) {
        bubble.style.top = '0px';
    }
}

//蓝色泡泡碰撞检测
function hitBlue() {
    var spring = 0.05;
    for (var i = 0; i < bubbles.length; i++) {
        var b1 = bubbles[i];
        b1.x = b1.offsetLeft;
        b1.y = b1.offsetTop;
        for (var j = i + 1; j < bubbles.length; j++) {
            var b2 = bubbles[j];
            b2.x = b2.offsetLeft;
            b2.y = b2.offsetTop;
            var dx = b2.x - b1.x;
            var dy = b2.y - b1.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var beeline = (b1.radius + b2.radius) / 2;
            if (dist < beeline) {
                var ax = ((b1.x + dx / dist * beeline) - b2.x) * spring;
                var ay = ((b1.y + dy / dist * beeline) - b2.y) * spring;
                b1.vx -= ax;
                b1.vy -= ay;
                b2.vx += ax;
                b2.vy += ay;
            }
        }
    }
}

//红色泡泡碰撞检测
function hitRed(){
    var spring = 0.05;
    var red = document.getElementsByClassName('bubble_red')[0];
    red.x = red.offsetLeft;
    red.y = red.offsetTop;
    for (var j = 0; j < bubbles.length; j++) {
        var b2 = bubbles[j];
        b2.x = b2.offsetLeft;
        b2.y = b2.offsetTop;
        var dx = b2.x - red.x;
        var dy = b2.y - red.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var beeline = (red.radius + b2.radius) / 2;
        if (dist < beeline) {
            var ax = ((red.x + dx / dist * beeline) - b2.x) * spring;
            var ay = ((red.y + dy / dist * beeline) - b2.y) * spring;
            b2.vx += ax;
            b2.vy += ay;
        }
    }
}

//加载
function run(){
    hitBlue();
    hitRed();
    for(b in bubbles){
        blueMove(bubbles[b]);
    }
}

window.onload = function () {
    init();
    blueBubble(8);
    redBubble();
    setInterval('run()',32);
    redMove();
}