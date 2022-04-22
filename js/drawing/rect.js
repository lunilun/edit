import { setHistory, addHistory } from '../events/history.js';

var centerPos = '';
var rback, rg, rxmlns;
var isDraging = false;
var canvas, context;

export default function drawRect(back, g, xmlns) {
    setHistory();
    rback = back; rg = g; rxmlns = xmlns
    backDrawing();
}

function backDrawing() {
    canvas = document.createElement("canvas");
    rback.appendChild(canvas);
    canvas.id = "canvas";
    canvas.style.position = "absolute";
    canvas.width = rback.offsetWidth; canvas.height = rback.offsetHeight;
    context = canvas.getContext("2d");

    canvas.addEventListener("mousedown",s_rect);
    canvas.addEventListener("mousemove",r_rect);
    canvas.addEventListener("mouseup",e_rect);
}

function s_rect(e) {
    centerPos = { x: e.offsetX, y: e.offsetY };
    isDraging = true;
}
function r_rect(e) {
    if (isDraging) {
        var nowX = e.offsetX ;
        var nowY = e.offsetY ;
        canvasDraw(nowX, nowY);
    }
}
function e_rect(e) {
    var rx,ry;

    var rect = document.createElementNS(rxmlns, "rect");
    if (e.offsetX - centerPos.x < 0) rx = centerPos.x + (e.offsetX - centerPos.x);
    else rx = centerPos.x;

    if (e.offsetY-centerPos.y < 0) ry = centerPos.y + (e.offsetY-centerPos.y);
    else ry = centerPos.y;

    rect.setAttributeNS(null,"x", rx);
    rect.setAttributeNS(null,"y", ry);
    rect.setAttributeNS(null,"width", Math.abs(e.offsetX-centerPos.x));
    rect.setAttributeNS(null,"height", Math.abs(e.offsetY-centerPos.y));
    rect.setAttributeNS(null, "fill", "red");
    rect.setAttributeNS(null, "fill-opacity", "0.1");
    rg.appendChild(rect);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    isDraging = false;
    addHistory("rect");
}

function canvasDraw(currentX,currentY)
{
    context.lineWidth = 1.5;
    context.strokeStyle = "skyblue";

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeRect(centerPos.x, centerPos.y, currentX - centerPos.x, currentY - centerPos.y);
}