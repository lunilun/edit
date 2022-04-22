import { resetHistory,pickHistory} from '../events/history.js';

var btn_list =[
    {id:"polygon"},{id:"rect"},{id:"circle"},{id:"position"},{id:"revise"}, {id:"remove"},
]
var event_btn_list =[
    {id:"save"},{id:"reset"},{id:"cancle"},
]//edit.js 변수.. 중복선언

export default function cancle() {
    resetHistory();
    for(var i=0; i<btn_list.length;i++){
        document.getElementById(btn_list[i].id).style.backgroundColor = "white";
    }

    for (var i in event_btn_list) {
        var ev_btn = document.getElementById(event_btn_list[i].id);
        ev_btn.style.background = "white";
        ev_btn.style.color = "rgba(0,0,0,.3)";
        ev_btn.style.border= "2px solid rgba(0,0,0,.3)";
        ev_btn.disabled = true;
    }
    pickHistory();
}