var clickPos = [];
var startPos, endPos;
var checkFirstPos = true;

var btn_list =[
    {id:"line", txt:'라인'},
    {id:"polygon", txt:'다각형'},
    {id:"rect", txt:'사각형'},
    {id:"circle", txt:'원'},
    {id:"position", txt:'위치'},
    {id:"revise", txt:'수정'},
    {id:"remove", txt:'삭제'},
]
var back, two, params;
var now_type;

window.onload=()=>{
    var pal = document.getElementById("palette");
    back = document.getElementById("background");
    for (var i in btn_list) {
        var i_btn = document.createElement("button");
        i_btn.innerHTML = btn_list[i].txt;
        i_btn.id = btn_list[i].id;
        i_btn.addEventListener("click",drawing);
        pal.appendChild(i_btn);
    }
    params = { width: back.offsetWidth, height: back.offsetHeight};
    two = new Two(params).appendTo(back);

    var btn_save = document.getElementById("save");
    btn_save.addEventListener("click",save);
    var btn_save = document.getElementById("reset");
    btn_save.addEventListener("click",reset);
};

function drawing(e) {
    for(var i=0; i<btn_list.length;i++){
        if(btn_list[i].id != e.target.id) document.getElementById(btn_list[i].id).disabled ="true";
    }
    now_type = e.target.id;
    back.addEventListener("click",checkType);
}
function checkType() {
    clickPos.push({x:event.offsetX,y:event.offsetY});
    if(clickPos.length!=1){
        switch (now_type) {
            case "line":
                drawLine();
                break;
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

function save() {
    if (now_type == "polygon") {
        var line = two.makeLine(endPos.x, endPos.y, startPos.x, startPos.y);
        line.linewidth = 1;
        line.fill = "black";
        two.update();
    }
    clickPos.length=0;
    for(var i=0; i<btn_list.length;i++){
        document.getElementById(btn_list[i].id).removeAttribute("disabled");
    }
    startPos = ""; endPos = "";
    checkFirstPos = true;

    now_type = "";
    back.removeEventListener("click",checkType);
}

function reset() {
    //이번에 생성된 dom만 제거해야됨
    console.log("초기화");
}


//문자열 포맷팅
String.format = function() { 
    let args = arguments; 
    return args[0].replace(/{(\d+)}/g, function(match, num) { 
        num = Number(num) + 1; 
        return typeof(args[num]) != undefined ? args[num] : match; 
    }); 
}