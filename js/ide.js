let editor;

window.onload = function() {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
}

function changeLanguage() {

    let language = $("#languages").val();

    if(language == 'c' || language == 'cpp')editor.session.setMode("ace/mode/c_cpp");
    else if(language == 'python3')editor.session.setMode("ace/mode/python");
}


var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function body (src,lang,input) {
    var raw = JSON.stringify({
        "src": src,
        "stdin": input,
        "lang": lang,
        "timeout": 5
    })
    return raw;
}


run_btn =document.getElementById("myBtn");
selector = document.getElementById("lang");
selector.addEventListener("change",()=> changeLanguage())

run_btn.onclick = async function() {
    document.getElementById("myBtn").disabled = true;
    $(".output").text("Running....");
    src = editor.getValue();
    lang = document.getElementById("lang").value;
    input = document.getElementById("input").value;
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body(src,lang,input),
        redirect: 'follow'
    };
    ans = await fetch("https://rec-server.onrender.com/submit", requestOptions);
    ans = (await ans.json()).data
    poll(ans);
};

async function poll(url)
{
    output = await fetch(url);
    output = await output.json();

    if(output.data == undefined)
    {
        await new Promise(resolve => setTimeout(resolve, 100));
        await poll(url);
    }
    else
    {
        $(".output").text(output.data.output);
        $(".stderr").text(output.data.stderr);
        document.getElementById("myBtn").disabled = false;
    }

}
