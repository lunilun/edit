//drawing
//해상도에 따라 위치
import drawPoly from '../drawing/polygon.js';
import rec from '../drawing/rect.js';
import cir from '../drawing/circle.js';
//event
import save from '../events/save.js';
import reset from '../events/reset.js';
import cancle from '../events/cancle.js';
import { beginDrag, drag, endDrag, zoom } from '../events/dragandzoom.js';

var two;
// var svg,g;
var back, set_Img_back, pal, ev;
var svg, defs, out_gird, out_gird_rect,
    in_grid, out_path, in_path, out_pattern, in_pattern,
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
    svgTest2();
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

    // c_svg.addEventListener('mousedown', beginDrag);
    // c_svg.addEventListener('mousemove', drag);
    // c_svg.addEventListener('mousewheel', zoom);
    // window.addEventListener('mouseup', endDrag);
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
            drawPoly(back,two); 
            break;
        case "rect":
            rec(back,two);
            break;
        case "circle":
            cir(back,two);
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
            // svg_setting(e.target.result);
            // svgTest2(e.target.result);
        }
        reader.readAsDataURL(event.target.files[0]);
    }
}

function svgTest2() {
    //svg태그 생성
    var c_svg = document.createElementNS(xmlns,"svg");
    c_svg.setAttributeNS(null,'version', "1.1");
    c_svg.setAttributeNS(null,'width', back.offsetWidth);
    c_svg.setAttributeNS(null,'height', back.offsetHeight);
    c_svg.id = "main_svg";
    c_svg.style.position = "absolute";

    //def 생성
    var c_def = document.createElementNS(xmlns, "defs");
    
    //patten 생성
    //small
    var c_small_pattern = document.createElementNS(xmlns, "pattern");
    c_small_pattern.id = "smallGrid";
    c_small_pattern.setAttributeNS(null, "width",'10')
    c_small_pattern.setAttributeNS(null, "height",'10')
    c_small_pattern.setAttributeNS(null, "patternUnits", 'userSpaceOnUse')
    //big
    var c_big_pattern = document.createElementNS(xmlns, "pattern");
    c_big_pattern.id = "grid";
    c_big_pattern.setAttributeNS(null, "width",'100')
    c_big_pattern.setAttributeNS(null, "height",'100')
    c_big_pattern.setAttributeNS(null, "patternUnits", 'userSpaceOnUse')

    //gird path 생성
    //small
    var c_small_path = document.createElementNS(xmlns, "path");
    c_small_path.setAttributeNS(null, "d", 'M 0 10 L 0 0 10 0');
    c_small_path.setAttributeNS(null, "fill", 'none');
    c_small_path.setAttributeNS(null, "stroke", 'black');
    c_small_path.setAttributeNS(null, "stroke-width", '1');
    //big
    var c_big_rect = document.createElementNS(xmlns,"rect");
    c_big_rect.setAttributeNS(null,"width", "100");
    c_big_rect.setAttributeNS(null,"height", "100");
    c_big_rect.setAttributeNS(null, "fill", "url('#smallGrid')");
    
    var c_big_path = document.createElementNS(xmlns, "path");
    c_big_path.setAttributeNS(null, "d", 'M 0 100 L 0 0 100 0');
    c_big_path.setAttributeNS(null, "fill", 'none');
    c_big_path.setAttributeNS(null, "stroke", 'black');
    c_big_path.setAttributeNS(null, "stroke-width", '2');

    //g태그 생성
    var c_g = document.createElementNS(xmlns,"g");
    c_g.classList.add("main-container");
    c_g.setAttributeNS(null,'transform', "matrix(1 0 0 1 0 0)");

    //메인 컨드롤 박스
    // var c_rect = document.createElementNS(xmlns,"rect");
    // c_rect.classList.add("boundary");
    // c_rect.setAttributeNS(null,"width", "1000");
    // c_rect.setAttributeNS(null,"height", "1000");
    // c_rect.setAttributeNS(null,"fill", "url('#gradient')");
    
    var c_boundary = document.createElementNS(xmlns,"rect");
    c_boundary.classList.add("boundary");
    c_boundary.setAttributeNS(null,"width", "1000");
    c_boundary.setAttributeNS(null,"height", "1000");
    c_boundary.setAttributeNS(null, "fill", "url('#grid')");
  
    // c_rect.style.background = String.format("url('{0}')", res);

    back.appendChild(c_svg);
    c_svg.appendChild(c_def);
    c_def.appendChild(c_small_pattern);
    c_def.appendChild(c_big_pattern);
    
    c_small_pattern.appendChild(c_small_path);
    c_big_pattern.appendChild(c_big_rect);
    c_big_pattern.appendChild(c_big_path);

    c_svg.appendChild(c_g);
    // c_g.appendChild(c_rect);
    c_g.appendChild(c_boundary);

    // c_svg.addEventListener('mousedown', beginDrag);
    // c_svg.addEventListener('mousemove', drag);
    // c_svg.addEventListener('mousewheel', zoom);
    // window.addEventListener('mouseup', endDrag);
}

//.createElementNS(xmlns,"rect"); 3개
//.createElementNS(xmlns, "path"); 2개
//createElementNS(xmlns, "pattern"); 2개

function create_rect(par,width, height, classN, fill) {
    var rect = document.createElementNS(xmlns, "rect");
    if (classN != "") rect.classList.add(classN);
    rect.setAttributeNS(null,"width", width);
    rect.setAttributeNS(null,"height", height);
    rect.setAttributeNS(null, "fill", fill);

    par.appendChild(rect);
}