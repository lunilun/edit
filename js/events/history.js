var hist, hist_list, svg;

export function setHistory() {
    svg = document.getElementsByTagName("svg");
    hist = document.getElementsByClassName("history");
    if(hist[0].style.display!="block") hist[0].style.display = "block";
    hist_list = hist[0].children[1].children[0];
    // undoHistory();
}

export function pickHistory() {
    hist[0].style.display = "none";
}

export function addHistory(type) {
    var add_history =
        String.format("<li style='text-align:center; height: 30px;line-height: 30px;'><div>{0}</div></li>",type);
    $(add_history).appendTo(hist_list);
}

export function resetHistory() {
    for (var i=0; i <hist_list.childNodes.length; i++){
        svg[0].children[1].removeChild(svg[0].children[1].lastChild);
    }
    while (hist_list.hasChildNodes()) {
        hist_list.removeChild(hist_list.firstChild);
    }
}

export function undoHistory() {
    //수정필요(도형 클릭 할 떄마다, 지워지는 범위가 같이 늘어남)
    document.getElementById("undo").addEventListener('click', () => {
        if (hist_list.childNodes.length - 1 < 0) {
            alert("저장된 히스토리가 없습니다.");
        }else {
            svg[0].children[1].removeChild(svg[0].children[1].lastChild);
            hist_list.removeChild(hist_list.lastChild);
        }
        // if (now_type == "polygon") {
        //     clickPos.length = 0;
        //     clickPos.push(undoSavePOs);
        // }
    });
}