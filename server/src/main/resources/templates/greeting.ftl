<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>haha</title>

    <!--<meta charset="utf-8">-->
    <!--<meta http-equiv="Content-Type" content="text/html;charset=utf-8">-->
    <!--<title></title>-->
    <!-- react.js是React的核心库 -->

    <script src="js/react.js" charset="utf-8"></script>
    <!-- react-dom.js的作用是提供与DOM相关功能 -->
    <script src="js/react-dom.js" charset="utf-8"></script>
    <!-- browser.min.js的作用是将JSX语法转换成JavaScript语法 -->
    <script src="js/browser.min.js" charset="utf-8"></script>
</head>
<div id="example">

</div>

</body>
<!-- 在React开发中，使用JSX，跟JavaScript不兼容，在使用JSX的地方，要设置type: text/babel -->
<!-- babel是一个转换编译器，ES6转成可以在浏览器中运行的代码 -->
<script type="text/babel" charset="utf-8">
ReactDOM.render(
    <div>
    <h1>菜鸟教程</h1>
    <h2>欢迎学习 React</h2>
    <p data-myattribute = "somevalue">这是一个很不错的 JavaScript 库!</p>
    </div>
    ,
    document.getElementById('example')
);
  </script>

</body>
<!-- React渲染的模版内容插入到这个DOM节点中，作为一个容器 -->

</html>