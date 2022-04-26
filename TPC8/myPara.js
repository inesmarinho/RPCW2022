$(function(){
    $.get('http://localhost:7700/paras', function(data){
        data.forEach(p => {
            s("#paraList").append("<li>" + p.para + "</li>")
        });
    })
    $("#addPara").click(function(){
        $("#paraList").append("<li>" + $("#paraText".val()) + "</li>");
        $.post("http://localhost:7700/paras", $("#myParaForm").serialize())
        alert('Record inserted: ' + JSON.stringify($("#myParaForm").serialize()))
        $("#paraText").val("");
    })
})