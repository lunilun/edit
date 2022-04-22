import { setHistory, addHistory } from '../events/history.js';

var centerPos = '';
var rback, rg, rxmlns;
var isDraging = false;
var canvas, context;
var radius;

export default function drawCir(back, g, xmlns) {
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
    
    canvas.addEventListener("mousedown",s_circle);
    canvas.addEventListener("mousemove",r_circle);
    canvas.addEventListener("mouseup",e_circle);
}

function s_circle(e) {
    centerPos = { x: e.offsetX, y: e.offsetY };
    isDraging = true;
}
function r_circle(e) {
    if (isDraging) {
        var nowX = e.offsetX;
        var nowY = e.offsetY;
        radius = Math.sqrt(Math.abs(Math.pow(nowX - centerPos.x,2)) + Math.abs(Math.pow(nowY - centerPos.y,2)));
        canvasDraw(radius);
    }
}
function e_circle() {
    var circle = document.createElementNS(rxmlns, "circle");
    circle.setAttributeNS(null, "cx", centerPos.x);
    circle.setAttributeNS(null, "cy", centerPos.y);
    circle.setAttributeNS(null, "r", radius);
    circle.setAttributeNS(null, "fill", "green");
    circle.setAttributeNS(null, "fill-opacity", "0.1");
    rg.appendChild(circle);
    
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    isDraging = false;
    addHistory("circle");
}

function canvasDraw(radius)
{
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    context.arc(centerPos.x, centerPos.y,radius,0, Math.PI * 2, true);
    context.lineWidth = 1.5;
    context.strokeStyle = "skyblue";
    context.stroke();
}