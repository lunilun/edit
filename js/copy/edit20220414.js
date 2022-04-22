//2022.04.14
import Two from 'https://cdn.skypack.dev/two.js@latest';
import drawPoly from '../js/drawing/polygon.js';
import rec from '../js/drawing/rect.js';
import cir from '../js/drawing/circle.js';

var clickPos = [];
var startPos, endPos, undoSavePOs;

var btn_list =[
    {id:"polygon", txt:'다각형'},
    {id:"rect", txt:'사각형'},
    {id:"circle", txt:'원'},
    {id:"position", txt: '위치'},
    {id:"revise", txt:'수정'},
    {id:"remove", txt:'삭제'},
]
var event_btn_list =[
    {id:"save",ev:''},
    {id:"reset",ev:''},
    {id:"cancle",ev:''},
]
var two, params;
var svg;
var back, hist, hist_li, undo, canvas; 
var now_type, before_type;

window.onload = () => {
    btn_setting();
    svg_setting();
};

function btn_setting() {
    var pal = document.getElementById("palette");
    var ev = document.getElementById("btns");

    for (var i in btn_list) {
        var i_btn = document.createElement("button");
        var url = String.format("url('../Img/{0}.png') no-repeat center", btn_list[i].id);
        i_btn.id = btn_list[i].id;
        i_btn.style.background = url;
        i_btn.style.backgroundSize = "25px";
        i_btn.addEventListener("click", drawing);
        pal.appendChild(i_btn);

        if (i>=3) i_btn.disabled = true;
    }

    for (var i in event_btn_list) {
        var ev_btn = document.createElement("button");
        ev_btn.innerText = event_btn_list[i].id;
        // ev_btn.addEventListener("click", event_btn_list[i].ev);
        ev_btn.style.background = "white";
        ev_btn.style.fontSize = "20px";
        ev_btn.style.color = "rgba(0,0,0,.3)";
        ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
        ev_btn.disabled = true;
        ev.appendChild(ev_btn);
    }
}

function svg_setting() {
    back = document.getElementById("background");
    back.style.position="relative"

    params = { width: back.offsetWidth, height: back.offsetHeight};
    two = new Two(params).appendTo(back);
    svg = document.getElementsByTagName("svg");
    svg[0].style.position = "absolute";
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
    // connect_end_start("ready");
    
    // for(var i=0; i<btn_list.length;i++){
    //     if (btn_list[i].id == e.target.id) {
    //         document.getElementById(btn_list[i].id).style.backgroundColor = "rgba(128,128,128,.3)";
    //     } else {
    //         document.getElementById(btn_list[i].id).style.backgroundColor = "white";
    //     }
    // }
    
    // for (var i in event_btn_list) {
    //     var ev_btn = document.getElementById(event_btn_list[i].id);
    //     ev_btn.style.background = "white";
    //     ev_btn.style.color = "black";
    //     ev_btn.style.border= "2px solid black";
    //     ev_btn.disabled = false;
    // }

    // now_type = e.target.id;
    // hist.style.display = "block";
    // back.addEventListener("click",checkType);
}

// function checkType() {
//     clickPos.push({x:event.offsetX,y:event.offsetY});
//     if(clickPos.length!=1){
//         switch (now_type) {
//             case "polygon":
//                 drawPoly();
//                 break;
//             case "rect":
//                 drawRect();
//                 break;
//             case "circle":
//                 drawCir();
//                 break;
//             default:
//                 break;
//         }
//         var add_hist =
//             String.format("<li style='text-align:center; height: 30px;line-height: 30px;'><div>{0}</div></li>",now_type);
//         $(add_hist).appendTo(hist_li);
//     }
// }

// //@@@@@drawing@@@@@


// //@@@@@etc event(save, cancle, reset, undo)@@@@@
// function undos() {
//     if (hist_li.childNodes.length - 1 < 0) {
//         alert("저장된 히스토리가 없습니다.");
//     } else {
//         svg[0].children[1].removeChild(svg[0].children[1].lastChild);
//         hist_li.removeChild(hist_li.lastChild);
//     }

//     if (now_type == "polygon") {
//         clickPos.length = 0;
//         clickPos.push(undoSavePOs);
//     }
// }
// function save() {
//     connect_end_start("save");
//     off_draw();
//     var name = new Date().getFullYear()+""+new Date().getMonth()+""+new Date().getDate()+""+new Date().getHours()+""+new Date().getMinutes();
//     var save_form =
//         String.format(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><g id="two-0" transform="matrix(1 0 0 1 0 0)" opacity="1">{0}</g></svg>`, $( 'svg' ).html());
//     axios.post('http://127.0.0.1:3000/save', {title:name, content:save_form})
//         .then((response) => {
//             if (response.data == "save") {
//                 alert("저장완료되었습니다.");
//                 window.location.reload();
//             }
//             console.log(response); 
//     });
     
// }
// function cancle() {
//     off_draw();
// }
// function reset() {
//     clickPos.length = 0;
//     checkFirstPos = true;
//     for (var i=0; i <hist_li.childNodes.length; i++){
//         svg[0].children[1].removeChild(svg[0].children[1].lastChild);
//     }
//     while (hist_li.hasChildNodes()) {
//         hist_li.removeChild(hist_li.firstChild);
//     }
// }
// function connect_end_start(ch) {
//     if (now_type == "polygon" && endPos != undefined && startPos != undefined) {
//             var line = two.makeLine(endPos.x, endPos.y, startPos.x, startPos.y);
//             line.linewidth = 1;
//             line.fill = "black";
//             two.update();
//         if (ch == "ready") {
//             clickPos.length = 0;
//             startPos = undefined; endPos = undefined;
//             checkFirstPos = true;

//             var add_hist = "<li style='text-align:center; height: 30px;line-height: 30px;'><div>polygon</div></li>";
//             $(add_hist).appendTo(hist_li);
//         }
//     }
// }
// function off_draw() {
//     for(var i=0; i<btn_list.length;i++){
//         document.getElementById(btn_list[i].id).style.backgroundColor = "white";
//     }

//     for (var i in event_btn_list) {
//         var ev_btn = document.getElementById(event_btn_list[i].id);
//         ev_btn.style.background = "white";
//         ev_btn.style.color = "rgba(0,0,0,.3)";
//         ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
//         ev_btn.disabled = true;
//     }

//     while (hist_li.hasChildNodes()) {
//         hist_li.removeChild(hist_li.firstChild);
//     }
//     clickPos.length=0;

//     hist.style.display = "none";
//     startPos = undefined; endPos = undefined;
//     checkFirstPos = true;
//     now_type = "";
//     back.removeEventListener("click", checkType);
//     back.removeChild(document.getElementById("canvas"));
// }
