import { setHistory, addHistory } from '../events/history.js';

var Poses = [], point, count;
var rback, rg, rxmlns;
var canvas, context;

//폴리곤 클릭(수정모드) 드래그 곡선(추가 기능)
export default function drawRect(back, g, xmlns) {
  setHistory();
  Poses.length = 0; point = -1;
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

  canvas.addEventListener("mousedown", s_polygon);
  canvas.addEventListener("dblclick",d_polygon);
}

function s_polygon(e) {
  count = document.getElementsByClassName("polygon").length;
  Poses.push({ x: e.offsetX, y: e.offsetY });
  canvasDraw()
}

function d_polygon() {
  var paths='', state=''; 
  var dist = Math.sqrt(Math.pow((Poses[point].x - Poses[0].x), 2) + Math.pow((Poses[point].y - Poses[0].y), 2));
  if (dist <= 50) {
    state = "close";
    close();
    for (var i = 0; i < Poses.length; i++) {
      if (i == 0) paths += "M" + Poses[i].x + " " + Poses[i].y + " "
      else if (i == Poses.length - 1) paths += "Z";
      else paths += "L" + Poses[i].x + " " + Poses[i].y + " "
    }
  }
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  createPath(paths,state);
  Poses.length = 0; point = -1;
}

function canvasDraw()
{
  point++;
  if(Poses.length == 1) {
    create_point("first");
  }
  else {
    create_line(Poses[point-1],Poses[point]);
    create_point("back");
  }
}

function create_point(t) {
  context.lineWidth = 1.5;
  context.strokeStyle = "rgba(0,0,255,0.4)";
  context.fillStyle = "black";
  if (t == "first") {
    context.fillRect(Poses[0].x-5, Poses[0].y-5, 10, 10);
  }
  else if (t == "back") {
    context.fillRect(Poses[point-1].x-5, Poses[point-1].y-5, 10, 10);
    context.fillRect(Poses[point].x-5, Poses[point].y-5, 10, 10);
  }
}

function createPath(p, s) {
  if(s == "close"){
    var path = document.createElementNS(rxmlns, "path");
    path.setAttributeNS(null, "d", p);
    path.setAttributeNS(null, "fill", "yellow");
    path.setAttributeNS(null, "fill-opacity", "0.1");
    path.setAttributeNS(null, "stroke", "blue");
    path.setAttributeNS(null, "stroke-width", "1.5");
    rg.appendChild(path);
    addHistory("polygon");
  }
}

function create_line(s,e) {
  context.beginPath();
  context.moveTo(s.x, s.y);
  context.lineTo(e.x, e.y);
  context.stroke();
}

function close() {
  context.beginPath();
  context.moveTo(Poses[point].x,Poses[point].y);
  context.lineTo(Poses[0].x, Poses[0].y);
  context.stroke();
}