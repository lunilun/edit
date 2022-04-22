export default function save() {
    var name = new Date().getFullYear() + "" + new Date().getMonth() + "" + new Date().getDate() + "" + new Date().getHours() + "" + new Date().getMinutes();
    var save_form =
        String.format(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><g id="two-0" transform="matrix(1 0 0 1 0 0)" opacity="1">{0}</g></svg>`, $('svg').html());
    axios.post('http://127.0.0.1:3000/save', { title: name, content: save_form })
        .then((response) => {
            if (response.data == "save") {
                alert("저장완료되었습니다.");
                window.location.reload();
            }
            console.log(response);
        });
}