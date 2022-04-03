var dragPos=[];
var btn_list =[
    {id:"line", svg_link:"", txt:'라인'},
    {id:"polygon", svg_link:"", txt:'다각형'},
    {id:"rect", svg_link:"", txt:'사각형'},
    {id:"circle", svg_link:"", txt:'원'},
    {id:"position", svg_link:"", txt:'위치'},
    {id:"revise", svg_link:"", txt:'수정'},
    {id:"remove", svg_link:"", txt:'삭제'},
]
var back,object;
var draw_type;
var back_w, back_h;
//https://jsfiddle.net/mill01/nwxpyb16/45/ 참고
//https://gahyun-web-diary.tistory.com/109 참고
//https://1-notes.com/javascript-draw-svg-shapes-with-createelementns/ 참고
//https://codepen.io/yochans/pen/poNoaVd 참고
//https://jsfiddle.net/mill01/nwxpyb16/45/ 참고
////https://jundol.me/47 참고

//공통 항목 묶어야됨
window.onload=()=>{
    var pal = document.getElementById("palette");
    for (var i in btn_list) {
        var i_btn = document.createElement("button");
        i_btn.innerHTML = btn_list[i].txt;
        i_btn.id = btn_list[i].id;
        i_btn.addEventListener("click",ready_drawing)
        pal.appendChild(i_btn);
    }

    var btn_save = document.getElementById("save");
    btn_save.addEventListener("click",save);
    var btn_save = document.getElementById("reset");
    btn_save.addEventListener("click",reset);
};

function ready_drawing(e) {
    draw_type = e.target.id;
    back = document.getElementById("background");
    back.addEventListener("mousedown",m_down);
    back.addEventListener("mouseup",m_up);

    //svg canvas?
    object = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    object.setAttribute("width", back.offsetWidth);
    object.setAttribute("height", back.offsetHeight);
    object.setAttribute("viewbox",String.format("0 0 {0} {1}", back.offsetWidth,back.offsetHeight));
    object.style.position="absolute";
    back.appendChild(object);
}
function go_drawing(id) {
    var svgs = document.createElementNS('http://www.w3.org/2000/svg', id);
    var w = dragPos[1].x2 - dragPos[0].x1;
    var h = dragPos[1].y2 - dragPos[0].y1;
    var rx = (dragPos[1].x2 + dragPos[0].x1)/2;
    var ry = (dragPos[1].y2 + dragPos[0].y1)/2;
    var l = Math.round(Math.sqrt(Math.pow(parseInt(w),2)+Math.pow(parseInt(h),2)));
    switch (id) {
        case "rect":
            svgs.setAttribute('x', dragPos[0].x1);
            svgs.setAttribute('y', dragPos[0].y1);
            svgs.setAttribute('width', w);
            svgs.setAttribute('height', h);
            svgs.setAttribute('fill', 'none');
            break;
        case "circle":
            svgs.setAttribute('cx', rx);
            svgs.setAttribute('cy', ry);
            svgs.setAttribute('r', l/2);
            svgs.setAttribute('fill', 'none');
            break;
        default:
            break;
    }
    svgs.setAttribute('stroke', 'black');
    svgs.setAttribute('stroke-width', 1);
    object.appendChild(svgs);
    dragPos.length=0;
}

function m_down() {
    dragPos.push({x1:event.offsetX,y1:event.offsetY});
}
function m_up() {
    dragPos.push({x2:event.offsetX,y2:event.offsetY});
    go_drawing(draw_type);
}

//svg 저장방식 찾아보기 + 사이즈 조절(라이브러리 참고해서 해보기)
function save() {
    back.removeEventListener("mousedown",m_down);
    back.removeEventListener("mouseup",m_up);
    html2canvas(back).then((canvas)=>{ 
        document.body.appendChild(canvas);
        canvas.style.display="none";
        var a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = "capture.png";
        document.body.appendChild(a);
        a.click();
    });
}

function reset() {
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
