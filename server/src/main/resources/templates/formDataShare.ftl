<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="Generator" content="公益">
    <title>${title}:数据</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Expires" content="0" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache-control" content="no-cache" />
    <meta http-equiv="Cache" content="no-cache" />
    <meta name="Author" content="公益"/>
    <meta name="Keywords" content=""/>
    <meta name="Description" content="${title}:数据"/>
    <meta itemprop="name" content="${title}:数据"/>
    <meta itemprop="description" content="${title}:数据"/>
    <meta itemprop="image" content="${img}"/>
    <script type="text/javascript">

        window.addEventListener('message',function(event){
            //此处执行事件
            if(event.data=='2'){
                document.getElementById("myframe").height=2300;
            }else if(event.data=='1'){
                document.getElementById("myframe").height=400;
            }
        })

    </script>
</head>
<body>
<img src="${img}" width="0" height="0" />
<iframe id="myframe" id="shareDataFrame" allowTransparency='true' style='width:100%;border:none;' height="3000" scrolling='no' seamless='seamless' frameborder='0' src='${url}'></iframe>
</body>
</html>
