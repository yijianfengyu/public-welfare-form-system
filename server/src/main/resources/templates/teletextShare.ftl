<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="Generator" content="公益">
    <title>${title}:表单</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Expires" content="0" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-control" content="no-cache" />
    <meta http-equiv="Cache" content="no-cache" />
    <meta name="Author" content="公益"/>
    <meta name="Keywords" content=""/>
    <meta name="Description" content="表单填写:${title}"/>
    <meta itemprop="name" content="表单填写:${title}"/>
    <meta itemprop="description" content="表单填写:${title}"/>
</head>
<body>
<script type="text/javascript">

    window.addEventListener('message',function(event){
        //此处执行事件

        if(event.data.type=='type02'){
            document.getElementById("myframe").height=2300;
        }else if(event.data.type=='type01'){
            document.getElementById("myframe").height=400;
        }

    })

</script>

<iframe id="myframe" name="myframe"  style='width:100%;border:none;' height="3000" src='${url}' allowTransparency='true' scrolling='no' seamless='seamless' frameborder='0' ></iframe>


</body>
</html>