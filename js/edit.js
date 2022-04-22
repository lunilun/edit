//drawing
//해상도에 따라 위치
import drawPoly from '../js/drawing/polygon.js';
import rec from '../js/drawing/rect.js';
import cir from '../js/drawing/circle.js';
//event
import save from '../js/events/save.js';
import reset from '../js/events/reset.js';
import cancle from '../js/events/cancle.js';
import { beginDrag, drag, endDrag, zoom } from '../js/events/dragandzoom.js';

var back, set_Img_back, pal, ev;
var svg, defs, g , out_gird_rect,
    out_path, in_path, out_pattern, in_pattern,
    c_boundary;
var xmlns = "http://www.w3.org/2000/svg";

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

window.onload = () => {
    base_setting();
};

function base_setting() {
    set_Img_back = document.getElementById("imgs");
    set_Img_back.addEventListener("change", uploadImg);
    back = document.getElementById("background");
    back.style.position = "relative"
    
    pal = document.getElementById("palette");
    ev = document.getElementById("btns");

    for (var i in btn_list) {
        var i_btn = document.createElement("button");
        var url = String.format("url('../Img/{0}.png') no-repeat center", btn_list[i].id);
        i_btn.id = btn_list[i].id;
        i_btn.style.background = url;
        i_btn.style.backgroundSize = "25px";
        i_btn.addEventListener("click", drawing);
        pal.appendChild(i_btn);
        i_btn.disabled = true;
    }

    for (var i in event_btn_list) {
        var ev_btn = document.createElement("button");
        ev_btn.innerText = event_btn_list[i].id;
        ev_btn.id = event_btn_list[i].id;
        ev_btn.addEventListener("click", event_btn_list[i].ev);
        ev_btn.style.background = "white";
        ev_btn.style.fontSize = "20px";
        ev_btn.style.color = "rgba(0,0,0,.3)";
        ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
        ev_btn.disabled = true;
        ev.appendChild(ev_btn);
    }
}
function svg_setting(res) {
    for (var i in btn_list) {
        document.getElementById(btn_list[i].id).disabled = false;
    }
    //svg 생성
    svg = document.createElementNS(xmlns,"svg");
    svg.setAttributeNS(null,'version', "1.1");
    // svg.setAttributeNS(null,'width', back.offsetWidth);
    // svg.setAttributeNS(null,'height', back.offsetHeight);
    svg.setAttributeNS(null,'width', screen.width);
    svg.setAttributeNS(null,'height',screen.height);
    // svg.style.background = String.format("url('{0}')", res);
    svg.id = "main_svg";
    svg.style.position = "absolute";

    //defs 생성
    defs = document.createElementNS(xmlns, "defs");

    //g태그 생성
    g = document.createElementNS(xmlns,"g");
    g.classList.add("main-container");
    g.setAttributeNS(null,'transform', "matrix(1 0 0 1 0 0)");

    back.appendChild(svg);
    svg.appendChild(defs);
    svg.appendChild(g);
    
    //patten 생성
    create_pattern(in_pattern,10, 10, "smallGrid");
    create_pattern(out_pattern,100, 100, "grid");

    //gird path 생성
    create_path(in_path,"M 0 10 L 0 0 10 0", 1);
    create_path(out_path,"M 0 100 L 0 0 100 0",2);
    create_rect(out_gird_rect, 100, 100, "", "url('#smallGrid')");

    //메인 컨트롤 박스
    create_rect(c_boundary, 3000, 3000, "boundary", "url('#grid')");

    //test
    // <object type="image/svg+xml" data="bblogo.svg"></object>
    //String.format("url('{0}')", res)
    // <image href="svg_image.png" height="200" width="200"/>
    var img = document.createElement("object");
    img.setAttribute("type", "image/svg+xml");
    img.setAttribute("width", "1500");
    img.setAttribute("height", "1500");
    img.setAttribute("data", String.format("url('{0}')", res));
    g.appendChild(img);

    // img.setAttribute("data", "data:image/png;base64,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");
    
    // var img = document.createElementNS(xmlns,"image");
    // img.setAttributeNS(null,'width', screen.width);
    // img.setAttributeNS(null,'height', screen.height);
    //  img.style.width = screen.width;
    // img.style.height = screen.height;
    // img.setAttributeNS(null,'href', "C://Users/jwjeong/Desktop/map.jpg");
    // img.id = "sub_img";
    // img.style.position = "absolute";
    // g.appendChild(img);

    svg.addEventListener('mousedown', beginDrag);
    svg.addEventListener('mousemove', drag);
    // svg.addEventListener('mousewheel', zoom);
    window.addEventListener('mouseup', endDrag);
}

function drawing(e) {
    if (document.getElementById("canvas") != null) {
        document.getElementById("canvas").remove();
    }
    for (var i in btn_list){
        if (btn_list[i].id != e.target.id) document.getElementById(btn_list[i].id).style.backgroundColor = "rgba(128,128,128,0.3)"
        else document.getElementById(e.target.id).style.backgroundColor = "white"
    }
    switch (e.target.id) {
        case "polygon":
            drawPoly(back,g,xmlns); 
            break;
        case "rect":
            rec(back,g,xmlns);
            break;
        case "circle":
            cir(back,g,xmlns);
            break;
        default:
            break;
    }
    for (var i in event_btn_list) {
        var ev_btn = document.getElementById(event_btn_list[i].id);
        ev_btn.style.background = "white";
        ev_btn.style.color = "black";
        ev_btn.style.border= "2px solid black";
        ev_btn.disabled = false;
    }
}

function uploadImg(event) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            svg_setting(e.target.result);
        }
        reader.readAsDataURL(event.target.files[0]);
    }
}

function create_rect(target,width, height, classN,fill) {
    target = document.createElementNS(xmlns, "rect");
    target.setAttributeNS(null,"width", width);
    target.setAttributeNS(null,"height", height);
    target.setAttributeNS(null, "fill", fill);
    if (classN != "") {
        target.classList.add(classN);
        g.appendChild(target);
    } else {
        document.getElementById("grid").appendChild(target);
    }
}

function create_pattern(target,width, height, idN) {
    target = document.createElementNS(xmlns, "pattern");
    target.id= idN;
    target.setAttributeNS(null,"width", width);
    target.setAttributeNS(null,"height", height);
    target.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
    defs.appendChild(target);
}

function create_path(target,d,size) {
    target = document.createElementNS(xmlns, "path");
    target.setAttributeNS(null,"d", d);
    target.setAttributeNS(null,"fill", "none");
    target.setAttributeNS(null, "stroke", "black");
    target.setAttributeNS(null, "stroke-width", size);
    if (size == 1) document.getElementById("smallGrid").appendChild(target);
    else document.getElementById("grid").appendChild(target);
}