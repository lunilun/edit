import Two from 'https://cdn.skypack.dev/two.js@latest';
//drawing
import drawPoly from '../drawing/polygon.js';
import rec from '../drawing/rect.js';
import cir from '../drawing/circle.js';
//event
import save from '../events/save.js';
import reset from '../events/reset.js';
import cancle from '../events/cancle.js';
import {beginDrag, drag, endDrag, zoom} from '../events/dragandzoom.js';

var two, params;
var svg,g;
var back,set_Img_back,pal,ev;

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
    back.style.position="relative"

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
    params = { width: back.offsetWidth, height: back.offsetHeight};
    two = new Two(params).appendTo(back);
    svg = document.getElementsByTagName("svg");
    svg[0].style.position = "absolute";
    // svg[0].style.background = String.format("url('{0}')", res); 
    two.update();
    g = document.getElementsByTagName("g")[0];
    g.classList.add("main-container");
    controllBack();

    svg[0].addEventListener('mousedown', beginDrag);
    svg[0].addEventListener('mousemove', drag);
    svg[0].addEventListener('mousewheel', zoom);
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
            svg_setting(e.target.result);
        }
        reader.readAsDataURL(event.target.files[0]);
    }
}

//https://mdbootstrap.com/snippets/jquery/ascensus/531639#html-tab-view 참고
function controllBack() {
    var rect = two.makeRectangle(0,0, 5000,5000);
    rect.fill = "url('#gradient')";
    rect.stroke = "none";
    two.update();
}
