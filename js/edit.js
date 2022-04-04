var clickPos = [];
var startPos, endPos;
var checkFirstPos = true;

var btn_list =[
    {id:"polygon", txt:'다각형'},
    {id:"rect", txt:'사각형'},
    {id:"circle", txt:'원'},
    {id:"position", txt: '위치'},
    {id:"revise", txt:'수정'},
    {id:"remove", txt:'삭제'},
]
var event_btn_list =[
    {id:"save",ev:save},
    {id:"reset",ev:reset},
    {id:"cancle",ev:cancle},
]
var two, params, svg;
var back, hist, hist_li, undo; 
var now_type;

window.onload = () => {
    var pal = document.getElementById("palette");
    back = document.getElementById("background");
    hist_li = document.getElementById("his_List");
    undo = document.getElementById("undo");

    undo.addEventListener("click", undos)
    hist = hist_li.parentNode.parentNode;
    hist_li.parentNode.parentNode.style.display = "none";

    for (var i in btn_list) {
        var i_btn = document.createElement("button");
        var url = String.format("url('../Img/{0}.png') no-repeat center", btn_list[i].id);
        i_btn.id = btn_list[i].id;
        i_btn.style.background = url;
        i_btn.style.backgroundSize = "25px";
        i_btn.addEventListener("click", drawing);
        pal.appendChild(i_btn);
    }
    params = { width: back.offsetWidth, height: back.offsetHeight };

    for (var i in event_btn_list) {
        var ev_btn = document.getElementById(event_btn_list[i].id);
        ev_btn.addEventListener("click", event_btn_list[i].ev);
        ev_btn.style.background = "white";
        ev_btn.style.color = "rgba(0,0,0,.3)";
        ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
        ev_btn.disabled = true;
    }
};

function drawing(e) {
    two = new Two(params).appendTo(back);
    svg = document.getElementsByTagName("svg");
    svg[svg.length - 1].style.position = "absolute";
    svg[svg.length - 1].id = String.format("svg{0}", svg.length - 1);

    for(var i=0; i<btn_list.length;i++){
        if (btn_list[i].id != e.target.id) {
            document.getElementById(btn_list[i].id).disabled = "true";
            document.getElementById(btn_list[i].id).style.backgroundColor = "rgba(128,128,128,.1)";
        }
    }
    
    for (var i in event_btn_list) {
        var ev_btn = document.getElementById(event_btn_list[i].id);
        ev_btn.style.background = "white";
        ev_btn.style.color = "black";
        ev_btn.style.border= "2px solid black";
        ev_btn.disabled = false;
    }

    now_type = e.target.id;
    hist.style.display = "block";
    back.addEventListener("click",checkType);
}

function checkType() {
    clickPos.push({x:event.offsetX,y:event.offsetY});
    if(clickPos.length!=1){
        switch (now_type) {
            case "polygon":
                drawPoly();
                break;
            case "rect":
                drawRect();
                break;
            case "circle":
                drawCir();
                break;
            default:
                break;
        }
        var add_hist =
            String.format("<li id='li{0}' style='display:flex;justify-content: space-evenly; height: 30px;line-height: 30px;'><div>{1}</div><div>{2}</div></li>",
            svg[svg.length - 1].children[1].childNodes.length - 1, svg[svg.length - 1].children[1].childNodes.length, now_type);
        $(add_hist).appendTo(hist_li);
    }
}
function drawLine() {
    var line = two.makeLine(clickPos[1].x, clickPos[1].y, clickPos[0].x, clickPos[0].y);
    line.linewidth = 1;
    line.fill = "black";
    two.update();
    clickPos.length = 0;
}
function drawPoly() {
    if (checkFirstPos) startPos = clickPos[0];

    var line = two.makeLine(clickPos[1].x, clickPos[1].y, clickPos[0].x, clickPos[0].y);
    line.linewidth = 1;
    line.fill = "black";
    two.update();
    endPos = clickPos[1];
    clickPos.length = 0;
    clickPos.push(endPos);
    checkFirstPos = false;
}
function drawRect() {
    var rx = (clickPos[0].x + clickPos[1].x)/2;
    var ry = (clickPos[0].y + clickPos[1].y)/2;
    var rect = two.makeRectangle(rx, ry, clickPos[1].x - clickPos[0].x, clickPos[1].y - clickPos[0].y);
    rect.fill = "none";
    rect.stroke = "rgba(0, 0, 0, 1)";
    two.update();
    clickPos.length=0;
}
function drawCir() {
    var rx = (clickPos[0].x + clickPos[1].x)/2;
    var ry = (clickPos[0].y + clickPos[1].y)/2;
    var l = Math.round(Math.sqrt(Math.pow(parseInt(clickPos[1].x-clickPos[0].x),2)+Math.pow(parseInt(clickPos[1].y-clickPos[0].y),2)));
    var circle = two.makeCircle(rx, ry, l/2);
    circle.fill = "none";
    circle.stroke = "rgba(0, 0, 0, 1)";
    two.update();
    clickPos.length=0;
}

function undos() {
    console.log(svg[svg.length - 1].children[1].children[svg[svg.length - 1].children[1].childNodes.length - 1]);
    if (now_type == "polygon") {
        console.log("폴리곤");
    }
}

//@@@@@res button event(save, cancle, reset)@@@@@
function save() {
    if (svg[svg.length - 1].children[1] == undefined || svg[svg.length - 1].children[1].childNodes.length == 0) {
        alert("Save Error")
    } else {
        if (now_type == "polygon") {
            var line = two.makeLine(endPos.x, endPos.y, startPos.x, startPos.y);
            line.linewidth = 1;
            line.fill = "black";
            two.update();
        }
        clickPos.length=0;
        off_draw();
    }
}
function cancle() {
    var id = String.format("svg{0}", svg.length - 1)
    var d_svg = document.getElementById(id);
    d_svg.remove();
    off_draw();
}
function reset() {
    clickPos.length = 0;
    checkFirstPos = true;
    while (svg[svg.length - 1].children[1].hasChildNodes()) {
        svg[svg.length - 1].children[1].removeChild(svg[svg.length - 1].children[1].firstChild);
    }

    while (hist_li.hasChildNodes()) {
        hist_li.removeChild(hist_li.firstChild);
    }
}
function off_draw() {
    for(var i=0; i<btn_list.length;i++){
        document.getElementById(btn_list[i].id).removeAttribute("disabled");
        document.getElementById(btn_list[i].id).style.backgroundColor = "white";
    }

    for (var i in event_btn_list) {
        var ev_btn = document.getElementById(event_btn_list[i].id);
        ev_btn.style.background = "white";
        ev_btn.style.color = "rgba(0,0,0,.3)";
        ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
        ev_btn.disabled = true;
    }

    while (hist_li.hasChildNodes()) {
        hist_li.removeChild(hist_li.firstChild);
    }
    hist.style.display = "none";
    startPos = undefined; endPos = undefined;
    checkFirstPos = true;
    now_type = "";
    back.removeEventListener("click",checkType);
}

//문자열 포맷팅
String.format = function() { 
    let args = arguments; 
    return args[0].replace(/{(\d+)}/g, function(match, num) { 
        num = Number(num) + 1; 
        return typeof(args[num]) != undefined ? args[num] : match; 
    }); 
}