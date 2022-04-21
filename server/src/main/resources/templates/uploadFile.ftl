<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <meta charset="UTF-8">
    <title>上传文件</title>
    <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.js"></script>
    <style>
        body {
            display: block;
            margin: 20px;
            font-size:14px;
        }

        .btn-small {
            line-height:40px;
            height:40px;
            color:#fff;
            background-color:#88ccec;
            border-radius:4px;
            border:0;
            font-size:14px;
            margin-top:20px;
            width: 100%;
        }

        .file {
            position: relative;
            display: inline-block;
            background: #CCCCCC;
            /*border: 1px solid #999;*/
            border-radius: 4px;
            padding: 0px 12px;
            overflow: hidden;
            color: #fff;
            text-decoration: none;
            text-indent: 0;
            line-height: 40px;
            width: 100%;
            font-size:14px;
            box-sizing:border-box;
            text-align: center;
        }
        .file input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
        }
        .file:hover {
            background: #CCCCCC;
            border-color: #CCCCCC;
            color: #fff;
            text-decoration: none;
        }
        p {
            text-align: center;
            vertical-align:middle;
            line-height: 300px;
            color: #999;
        }
    </style
</head>

<body>
<form id="form1" action="${request.contextPath}/wechat/uploadFile" target="frame1" method="post" enctype="multipart/form-data">
    <div class="file" id="file1">
        <input type="file" name="file" id="fileid" value="">
        <div class="fileerrorTip1">请选择文件</div>
        <div class="showFileName1"></div>
    </div>

    <input type="hidden" name="createId" value="${resource.createId!''}">
    <input type="hidden" name="createName" value="${resource.createName!''}">
    <input type="hidden" name="type" value="文件">
    <input type="hidden" name="isEssential" value="否">
    <input type="hidden" name="projectId" value="${resource.projectId!''}">
    <input type="hidden" name="groupId" value="${resource.groupId!''}">
    <input type="hidden" name="uuid" value="${resource.uuid!''}">

    <input class="btn-small" type="button" value="上传" onclick="upload()">
</form>
<iframe name="frame1" id="frame1" frameborder="0" height="40"></iframe>

<p>文件上传成功后请返回退出当前页面。</p>
<!-- 其实我们可以把iframe标签隐藏掉 -->
<script type="text/javascript">
    $("#file1").on("change","input[type='file']",function(){
        var filePath=$(this).val();
        if(filePath!=""){
            $(".fileerrorTip1").html("").hide();
            var arr=filePath.split('\\');
            var fileName=arr[arr.length-1];
            $(".showFileName1").html(fileName);
        }else{
            $(".showFileName1").html("请选择文件");
        }
    });

    function upload() {
        var file = $("#fileid").val();
        if(file!=""){
            $("#form1").submit();
            var t = setInterval(function() {
                //获取iframe标签里body元素里的文字。即服务器响应过来的"上传成功"或"上传失败"
                var word = $("iframe[name='frame1']").contents().find("body").text();
                if(word != "") {
//						alert(word); //弹窗提示是否上传成功
						clearInterval(t); //清除定时器
                }
            }, 1000);
        }else{

        }
    }
</script>
</body>

</html>