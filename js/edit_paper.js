paper.install(window);

var clickPos=[];

var btn_list =[
    {id:"line", svg_link:"", txt:'라인'},
    {id:"polygon", svg_link:"", txt:'다각형'},
    {id:"rect", svg_link:"", txt:'사각형'},
    {id:"circle", svg_link:"", txt:'원'},
    {id:"position", svg_link:"", txt:'위치'},
    {id:"revise", svg_link:"", txt:'수정'},
    {id:"remove", svg_link:"", txt:'삭제'},
]
var back;

window.onload=()=>{
    var pal = document.getElementById("palette");
    back = document.getElementById("background");
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

    paper.setup(back);
};

function ready_drawing(e){
    console.log(e.target.id);
    back.addEventListener("click",()=>{
        clickPos.push({x:event.offsetX,y:event.offsetY});
        if(clickPos.length!=1){
            drawLine();
        }
    });
}

function drawLine() {
    var myPath = new Path();
    myPath.strokeColor = 'black';
    for(var i=1;i<clickPos.length;i++){
        myPath.add(new Point(clickPos[i-1].x, clickPos[i-1].y));
        myPath.add(new Point(clickPos[i].x, clickPos[i].y));
    }
    
}

function save() {
    console.log("저장");
}

function reset() {
    console.log("초기화");
}

