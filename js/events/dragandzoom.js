const maxScale = 5,
      minScale = 0.15;

var selected,
    scale = 1,
    svg = document.getElementsByTagName("svg");

export function beginDrag(e) {
    e.stopPropagation();
    let target = e.target;

    if (target.classList.contains('draggable')) {
        selected = target;
    } else {
        selected = document.querySelector('.main-container');
    }
    selected.dataset.startMouseX = e.clientX;
    selected.dataset.startMouseY = e.clientY;
}

export function drag(e) {
    if (!selected) return;
    e.stopPropagation();

    let startX = parseFloat(selected.dataset.startMouseX),
        startY = parseFloat(selected.dataset.startMouseY),
        dx = (e.clientX - startX),
        dy = (e.clientY - startY);
    //"x": 22, "y": 19,"width": 3000, "height": 3000,"top": 19,"right": 3022, "bottom": 3019,"left": 22
    // "x": 1, "y": 1, "width": 1536, "height": 864, "top": 1, "right": 1537, "bottom": 865, "left": 1
    if (selected.classList.contains('draggable')) {
    let selectedBox = selected.getBoundingClientRect(),
        boundaryBox = selected.parentElement.getBoundingClientRect();

        if (selectedBox.right + dx > boundaryBox.right) {
            dx = (boundaryBox.right - selectedBox.right);
        } else if (selectedBox.left + dx < boundaryBox.left) {
            dx = (boundaryBox.left - selectedBox.left);
        }

        if (selectedBox.bottom + dy > boundaryBox.bottom) {
            dy = (boundaryBox.bottom - selectedBox.bottom);
        }
        else if (selectedBox.top + dy < boundaryBox.top) {
            dy = (boundaryBox.top - selectedBox.top);
        }
    } //드래그 움직임 제한부분?!
    
    // if (selected.getBoundingClientRect().left < 0) console.log("왼쪽 제한");
    // if (selected.getBoundingClientRect().right > selected.getBoundingClientRect().width) console.log("왼쪽 제한");
    // if (selected.getBoundingClientRect().top < 0) console.log("위쪽 제한");
    // if (selected.getBoundingClientRect().bottom < 0) console.log("왼쪽 제한");
    
    let currentMatrix = selected.transform.baseVal.consolidate().matrix,
        newMatrix = currentMatrix.translate(dx / scale, dy / scale),
        transform = svg[0].createSVGTransformFromMatrix(newMatrix);
        
    selected.transform.baseVal.initialize(transform);
    selected.dataset.startMouseX = dx + startX;
    selected.dataset.startMouseY = dy + startY;
}

export function endDrag(e) {
    console.log("end-drag");
    e.stopPropagation();

    if (selected) {
    selected = undefined;
    }
}


export function zoom(e) {
  e.stopPropagation();
  e.preventDefault();

  let delta = e.wheelDelta,
    //   container = document.querySelector('.main-container'),
      container = document.querySelector('#main_svg'),
      scaleStep = delta > 0 ? 1.25 : 0.8;

  if (scale * scaleStep > maxScale) {
    scaleStep = maxScale / scale;
  }
  
  if (scale * scaleStep < minScale) {
    scaleStep = minScale / scale;
  }
  
  scale *= scaleStep;
  
  let box = svg[0].getBoundingClientRect();
  let point = svg.createSVGPoint();
	point.x = e.clientX - box.left;
	point.y = e.clientY - box.top;
  
  let currentZoomMatrix = container.getCTM();
  
  point = point.matrixTransform(currentZoomMatrix.inverse());
  
  let matrix = svg[0].createSVGMatrix()
    .translate(point.x, point.y)
    .scale(scaleStep)
    .translate(-point.x, -point.y);
  
  
  let newZoomMatrix = currentZoomMatrix.multiply(matrix);
  container.transform.baseVal.initialize(svg[0].createSVGTransformFromMatrix(newZoomMatrix));
  
  let t = newZoomMatrix;
}

// document.querySelector('svg .main-container').addEventListener('mousedown', beginDrag);
// document.querySelector('svg .main-container').addEventListener('mousewheel', zoom);
// svg.addEventListener('mousemove', drag);
// window.addEventListener('mouseup', endDrag);
