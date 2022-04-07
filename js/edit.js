//2022.04.07
var clickPos = [];
var startPos, endPos, undoSavePOs;
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
var two;
var params, svg;
var back, hist, hist_li, undo, canvas; 
var now_type, before_type;

//@@@@@initw@@@@@
window.onload = () => {
    var pal = document.getElementById("palette");
    back = document.getElementById("background");
    back.style.position="relative"
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
        //이벤트 미설정(제거 예정)
        if (i == 4 || i == 5) i_btn.disabled = true;
        
    }
    params = { width: back.offsetWidth, height: back.offsetHeight};
    two = new Two(params).appendTo(back);
    svg = document.getElementsByTagName("svg");

    for (var i in event_btn_list) {
        var ev_btn = document.getElementById(event_btn_list[i].id);
        ev_btn.addEventListener("click", event_btn_list[i].ev);
        ev_btn.style.background = "white";
        ev_btn.style.color = "rgba(0,0,0,.3)";
        ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
        ev_btn.disabled = true;
    }
};

//@@@@@set draw@@@@@
function drawing(e) {
    before_type = now_type;
    connect_end_start("ready");

    canvas = document.createElement("img");
    canvas.style.width = "inherit";
    canvas.style.height = "inherit";
    canvas.style.position = "absolute";
    canvas.id = "canvas";
    canvas.style.top = "0";
    canvas.style.left = "0";
    back.appendChild(canvas);
    
    for(var i=0; i<btn_list.length;i++){
        if (btn_list[i].id == e.target.id) {
            document.getElementById(btn_list[i].id).style.backgroundColor = "rgba(128,128,128,.3)";
        } else {
            document.getElementById(btn_list[i].id).style.backgroundColor = "white";
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
            String.format("<li style='text-align:center; height: 30px;line-height: 30px;'><div>{0}</div></li>",now_type);
        $(add_hist).appendTo(hist_li);
    }
}

//@@@@@drawing@@@@@
function drawPoly() {
    if (checkFirstPos) startPos = clickPos[0];

    var line = two.makeLine(clickPos[0].x, clickPos[0].y, clickPos[1].x, clickPos[1].y);
    line.linewidth = 1;
    line.fill = "black";
    two.update();
    endPos = clickPos[1];
    undoSavePOs = clickPos[0];
    clickPos.length = 0;
    clickPos.push(endPos);
    checkFirstPos = false;
}
function drawRect() {
    var rx = (clickPos[0].x + clickPos[1].x)/2;
    var ry = (clickPos[0].y + clickPos[1].y)/2;
    var rect = two.makeRectangle(rx, ry, clickPos[1].x - clickPos[0].x, clickPos[1].y - clickPos[0].y);
    rect.fill = "rgba(255,0,0,.1)";
    rect.stroke = "rgba(0, 0, 0, 0.1)";
    two.update();
    clickPos.length=0;
}
function drawCir() {
    var rx = (clickPos[0].x + clickPos[1].x)/2;
    var ry = (clickPos[0].y + clickPos[1].y)/2;
    var l = Math.round(Math.sqrt(Math.pow(parseInt(clickPos[1].x-clickPos[0].x),2)+Math.pow(parseInt(clickPos[1].y-clickPos[0].y),2)));
    var circle = two.makeCircle(rx, ry, l/2);
    circle.fill = "rgba(0,255,0,.1)";
    circle.stroke = "rgba(0, 0, 0, .1)";
    two.update();
    clickPos.length=0;
}

//@@@@@etc event(save, cancle, reset, undo)@@@@@
function undos() {
    if (hist_li.childNodes.length - 1 < 0) {
        alert("저장된 히스토리가 없습니다.");
    } else {
        svg[0].children[1].removeChild(svg[0].children[1].lastChild);
        hist_li.removeChild(hist_li.lastChild);
    }

    if (now_type == "polygon") {
        clickPos.length = 0;
        clickPos.push(undoSavePOs);
    }
}
function save() {
    connect_end_start("save");
    off_draw();
    var name = new Date().getFullYear()+""+new Date().getMonth()+""+new Date().getDate()+""+new Date().getHours()+""+new Date().getMinutes();
    var save_form =
        String.format(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><g id="two-0" transform="matrix(1 0 0 1 0 0)" opacity="1">{0}</g></svg>`, $( 'svg' ).html());
    axios.post('http://127.0.0.1:3000/save', {title:name, content:save_form})
        .then((response) => {
            if (response.data == "save") {
                alert("저장완료되었습니다.");
                window.location.reload();
            }
            console.log(response); 
    });
     
}
function cancle() {
    off_draw();
}
function reset() {
    clickPos.length = 0;
    checkFirstPos = true;
    for (var i=0; i <hist_li.childNodes.length; i++){
        svg[0].children[1].removeChild(svg[0].children[1].lastChild);
    }
    while (hist_li.hasChildNodes()) {
        hist_li.removeChild(hist_li.firstChild);
    }
}
function connect_end_start(ch) {
    if (now_type == "polygon" && endPos != undefined && startPos != undefined) {
            var line = two.makeLine(endPos.x, endPos.y, startPos.x, startPos.y);
            line.linewidth = 1;
            line.fill = "black";
            two.update();
        if (ch == "ready") {
            clickPos.length = 0;
            startPos = undefined; endPos = undefined;
            checkFirstPos = true;

            var add_hist = "<li style='text-align:center; height: 30px;line-height: 30px;'><div>polygon</div></li>";
            $(add_hist).appendTo(hist_li);
        }
    }
}
function off_draw() {
    for(var i=0; i<btn_list.length;i++){
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
    clickPos.length=0;

    hist.style.display = "none";
    startPos = undefined; endPos = undefined;
    checkFirstPos = true;
    now_type = "";
    back.removeEventListener("click", checkType);
    back.removeChild(document.getElementById("canvas"));
}
