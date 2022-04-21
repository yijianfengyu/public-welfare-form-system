import {PoperOverlay} from './PoperOverlay'
import {PopEditInfo} from "./PopEditInfo";
export function Draw() {
  var _this = this ;
  var map;
  //默认进入的坐标
  var poi;
  this.overlays=[];
  this.myOverlay=[];
  this.activePaths=[];//缓存弹跳提示点
  this.labelPaths=[];//存储所有覆盖物的文字标签
  var defaultZoom=11;
  var styleDraw;
  var styleOptions;
  var dispatch;
  var bindRightMenu;
  var polylinecomplete;
  var drawingManager;
  var currentCity;
  this.markerDrag;
  this.isLabelZoom=true;//默认标签会自动缩放
  this.isLargeData=false;//是否海量数据

  var removeMarker = function (e,ee,marker) {
    //e和ee分别是界面鼠标坐标和极坐标

    map.removeOverlay(marker);//地图界面上删除图形
    for (var i = 0; i < _this.myOverlay.length; i++) {
      if (_this.myOverlay[i].guid == marker.guid) {
        _this.myOverlay.splice(i, 1);//服务器后端的删除，如果有的话
      }
    }
    for (var i = 0; i < _this.overlays.length; i++) {
      if (_this.overlays[i].guid == marker.guid) {
        _this.overlays.splice(i, 1);//服务器后端的删除，如果有的话
      }
    }
    for (var i = 0; i < _this.labelPaths.length; i++) {
      if (_this.labelPaths[i].guid == marker.guid) {
        map.removeOverlay(_this.labelPaths[i]);//地图界面上删除图形
        _this.labelPaths.splice(i, 1);//服务器后端的删除，如果有的话
      }
    }
    //@数据库删除
    dispatch({
      type: "waterDraw/deletePath",
      payload: {
        guid:marker.guid,
      }
    })
  }

  //5、编辑多边形
  var editMarker = function (e, ee, marker) {
    //开启编辑模式
    if(marker.drawingMode != "marker"){
      marker.enableEditing();
    }

    var editInfo=new PopEditInfo(map,marker,dispatch,_this.labelPaths,_this.myOverlay);
    hiddenPathLabel(marker.guid);
  }

  var hiddenPathLabel=function(guid){
    for(var index=0; index< _this.labelPaths.length;index++){
      if(_this.labelPaths[index].guid==guid){
        _this.labelPaths[index].hide();
        break;
      }
    }
  }

  var showPathLabel=function(guid){
    for(var index=0; index< _this.labelPaths.length;index++){
      if(_this.labelPaths[index].guid==guid){
        _this.labelPaths[index].show();
        break;
      }
    }
  }
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  // Generate a pseudo-GUID by concatenating random hexadecimal.
  var getGuid = function () {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  //6、保存多边形
  var saveMarker = function (e, ee, marker) {
    //关闭编辑模式.marker无此菜单功能
      marker.disableEditing();
      //@保存到数据库
      var path = marker.getPath();//获取第一个多边形
      var pathArr = [];
      for (var k = 0; k < path.length; k++) {
        pathArr.push([path[k].lng, path[k].lat]);
      }
      var newOverlay = {
        drawingMode: null,
        path: JSON.stringify(pathArr),
        id: null,
        guid: marker.guid,
        pathType:null,
      };

      dispatch({
        type: "waterDraw/saveOverlayPath",
        payload: {
          ...newOverlay,
        }
      })

    showPathLabel(marker.guid);



  }

  this.init = function (context, dispatchX) {

    // 构造函数
    map = new BMap.Map('map');
    //1、添加地图类型控件
    var mapTypeControl=new BMap.MapTypeControl({
      mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]});
    mapTypeControl.setAnchor(BMAP_ANCHOR_TOP_LEFT);
    map.addControl(mapTypeControl);


    //2、定位到当前城市
    poi = new BMap.Point(112.938884, 28.22808);
    map.centerAndZoom(poi, defaultZoom);
    var city = new BMap.LocalCity();
    city.get(function(ee){
      currentCity=ee.name;

    });
    map.setCenter(city);

    //3、打开比例尺显示
    map.enableScrollWheelZoom();
    map.addControl(new BMap.ScaleControl());

    //4、按比例尺缩放所有自定义覆盖物
    map.addEventListener("zoomend", function() {
      var zoomLevel = this.getZoom();
      console.log (zoomLevel);

    })

    //5、基础配置
    styleDraw = {
      strokeColor: "#58D25B",    //边线颜色。
      fillColor: "#80DD82",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 2,       //边线的宽度，以像素为单位。
      strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
      fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid' //边线的样式，solid或dashed。
    };
    styleOptions= {
      strokeColor: "#187BC0",    //边线颜色。
      fillColor: "#2796E4",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 2,       //边线的宽度，以像素为单位。
      strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
      fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid' //边线的样式，solid或dashed。
    };
    dispatch = dispatchX;

    bindRightMenu = function (overlay) {

      var markerMenu = new BMap.ContextMenu();
      markerMenu.addItem(new BMap.MenuItem('删除', removeMarker.bind(overlay)));
      markerMenu.addItem(new BMap.MenuItem('编辑', editMarker.bind(overlay)));
      if(overlay.drawingMode != "marker"){
        //不是点marker的话会有编辑和保存菜单
        markerMenu.addItem(new BMap.MenuItem('保存', saveMarker.bind(overlay)));
      }

      overlay.addContextMenu(markerMenu);
    }

    polylinecomplete = function (e) {
      console.log("---polylinecomplete----");
      //将多边形保存到数组
      var guid = getGuid();
      e.overlay.guid = guid;
      _this.overlays.push(e.overlay);

      var drawingMode=e.currentTarget.getDrawingMode();
      var path = "marker"==drawingMode?[e.overlay.getPosition()]:e.overlay.getPath();//markerf转换到数组主要是为了统一处理



      var pathArr = [];
      for (var k = 0; k < path.length; k++) {
        pathArr.push([path[k].lng, path[k].lat]);
      }

      var newOverlay = {
        drawingMode: e.currentTarget.getDrawingMode(),
        path: JSON.stringify(pathArr),
        id: null,
        guid: guid,
        pathType:context.state.pathType
      };



      _this.myOverlay.push(newOverlay);

      //新创建的生成唯一键，如果点了邮件的保存就会进入数据库，如果并没有，则不会保存此覆盖物图形

      //创建右键菜单
      bindRightMenu(e.overlay);
      //@保存数据
      //添加一个信息窗口

      var lastPoint=pathArr[pathArr.length-1];
      var point = new BMap.Point(lastPoint[0],lastPoint[1]);
      var div =  document.createElement("div");

      var infoWindow = new BMap.InfoWindow(div);

      var pathNameInput =  document.createElement("input");
      pathNameInput.id='pathName';
      pathNameInput.width=100;

      var pathNameBtn =  document.createElement("input");
      pathNameBtn.id='pathName';
      pathNameBtn.value="提交";
      pathNameBtn.type="button";

      //编辑名称完成后保存
      var saveEvt=function () {
        newOverlay.pathName=pathNameInput.value;
        dispatch({
          type: "waterDraw/saveOverlayPath",
          payload: {
            ...newOverlay,
          }
        })
        map.closeInfoWindow(infoWindow,point);
        if(newOverlay.pathName&&""!=newOverlay.pathName){
          //创建label
          var label=new PoperOverlay(new BMap.Point(pathArr[0][0], pathArr[0][1]),newOverlay.pathName,map,false,false);
          label.guid=newOverlay.guid;

          //label添加移动时label跟随
          if("marker"==drawingMode){
            e.overlay.addEventListener("dragend",function(lbl){
              label.setPosition(lbl.point);
              newOverlay.path=JSON.stringify([[lbl.point.lng, lbl.point.lat]]);
              dispatch({
                type: "waterDraw/saveOverlayPath",
                payload: {
                  ...newOverlay,
                }
              })
            });
            e.overlay.addEventListener("dragging",function(lbl){
              label.setPosition(lbl.point);
            });
          }
          _this.labelPaths.push(label);
          map.addOverlay(label);
        }
      }

      pathNameBtn.addEventListener("click", saveEvt);

      div.addEventListener("keydown",function(){
        if(event.keyCode == 13){
          if(pathNameInput.value==""){
            map.closeInfoWindow(infoWindow,point);
          }else{
            saveEvt();
          }

        }
      });


      div.appendChild(pathNameInput);
      div.appendChild(pathNameBtn);
      map.openInfoWindow(infoWindow,point);
      drawingManager.close();

      dispatch({
        type: "waterDraw/saveOverlayPath",
        payload: {
          ...newOverlay,
          paths: _this.myOverlay,
        }
      })

    };

    drawingManager = new BMapLib.DrawingManager(map, {

      isOpen: false, //是否开启绘制模式
      enableDrawingTool: true, //是否显示工具栏
      drawingMode: 'BMAP_DRAWING_POLYGON',//绘制模式  多边形
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
        drawingModes: [
          BMAP_DRAWING_POLYGON,//仅支持多边形
          BMAP_DRAWING_POLYLINE,//线
          BMAP_DRAWING_MARKER,//点
        ]
      },
      polygonOptions: styleDraw, //设置多边形的样式
      polylineOptions: styleDraw, //线的样式
    });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', polylinecomplete);

  };
  this.getCurrentCity=function(){
    return currentCity;
  }
  this.setDrawingManagerHide=function(){
    drawingManager._drawingTool.hide();
  }
  this.setDrawingManagerShow=function(){
    drawingManager._drawingTool.show();
  }
  this.setZoom=function(zoom){
    map.setZoom(zoom?zoom:defaultZoom);
  }
  this.setMyOverlay = function (myOverlayX) {
    _this.myOverlay = myOverlayX;
  }
  this.getMyOverlayX = function () {
    return _this.myOverlay;
  }
  this.setOverlays = function (overlaysX) {
    _this.overlays = overlaysX;
  }
  this.getOverlays = function () {
    return _this.overlays;
  }
  this.clearInfoWindow = function () {
    map.closeInfoWindow();//关闭提示窗
  }
  //城市级别地图
  this.getcs = function (csdict) {
    map.centerAndZoom(csdict, 12);
  }
  //给当前绘制设置新的样式
  this.setViewStyle=function(styleOpts){
    styleOptions=styleOpts;
  }

  this.centerAndZoom =function (index){
    var pathPoints = JSON.parse( _this.myOverlay[index].path);//坐标值转换的坐标对象集合
    var point =new BMap.Point(pathPoints[0][0],pathPoints[0][1]);
    map.panTo(point);
  }

  this.updateLabel=function(guid,txt){
    for(var k=0;k< _this.labelPaths.length;k++){
      if(_this.labelPaths[k].guid==guid){
        _this.labelPaths[k].setContent(txt);
        break;
      }
    }
  }

  //3、清除地图上所有覆盖物,并不删除数据的数据
  this.clearAll = function () {
    //清除界面上的图形覆盖物
    //清除缓存的图形覆盖物
    _this.overlays.length = 0;
    _this.activePaths.length = 0;
    _this.labelPaths.length = 0;

    map.clearOverlays();//关闭提示窗
  }

  //2、打印所有覆盖物图形
  this.printAll = function () {
    console.log("缓存的数量:" + _this.overlays.length);
    console.log(_this.overlays);
    console.log("加载的数量:" + _this.myOverlay.length);
    console.log(_this.labelPaths);
  }

  this.addCopyLayer=function(){
    var ol= new BMap.Marker(poi);
    ol.enableDragging();//允许移动

    var img="<img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547812913268&di=980e71af7a2fcc4d78cf5a0b9d3fb18f&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fbaike%2Fc0%253Dbaike60%252C5%252C5%252C60%252C20%253Bt%253Dgif%2Fsign%3D6dbff48b0b24ab18f41be96554938da8%2F5243fbf2b21193138fa7ee1d67380cd790238db2.jpg' />";
    var label=new PoperOverlay(poi,img,map,false,false,1);

    ol.addEventListener("dragend",function(lbl){
      label.setPosition(lbl.point);
    });
    ol.addEventListener("dragging",function(lbl){
      label.setPosition(lbl.point);
    });
    map.addOverlay(ol);
    map.addOverlay(label);
  }

  this.loadMyOverlay = function (isLarge,isLabelZoom) {
    //清空现在有的多边形
    _this.clearAll();
    if(isLarge?isLarge:this.isLargeData){
      console.log("--------加载海量数据-----");
      if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
        var points = [];  // 添加海量点数据
        var options = {
          size: BMAP_POINT_SIZE_SMALL,
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: '#E60000'
        }

        for (var i = 0; i < _this.myOverlay.length; i++) {

          var overlay = _this.myOverlay[i];//默认图形，模拟从数据库加载，和上面的overlays相同{drawingMode:"",point:[[],[]]}
          var pathPoints = JSON.parse(overlay.path);//坐标值转换的坐标对象集合
          for (var index = 0; index < pathPoints.length; index++) {
            var point=new BMap.Point(pathPoints[index][0], pathPoints[index][1]);
            point.pathName=overlay.pathName;
            points.push(point);

          }

        }
        console.log("-------------加载海量数据结束-------------");
        var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection

        var infoLabel=new PoperOverlay(poi,"初始化",map,false,true);

        map.addOverlay(infoLabel);

        pointCollection.addEventListener('mouseover', function (e) {
         // console.log(e.point.pathName+'坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
          var point = new BMap.Point(e.point.lng, e.point.lat);
            infoLabel.setPosition(point);
            infoLabel.setContent(e.point.pathName);
            infoLabel.show();
        });
        pointCollection.addEventListener('mouseout', function (e) {
          infoLabel.hide();  // 监听点击事件
        });

        map.addOverlay(pointCollection);  // 添加Overlay

      } else {
        alert('请在chrome、safari、IE8+以上浏览器查看数据');
      }

    }else{
      for (var i = 0; i < _this.myOverlay.length; i++) {
        var overlay = _this.myOverlay[i];//默认图形，模拟从数据库加载，和上面的overlays相同{drawingMode:"",point:[[],[]]}
        var pathPoints = JSON.parse(overlay.path);//坐标值转换的坐标对象集合
        var points = [];
        for (var index = 0; index < pathPoints.length; index++) {
          points.push(new BMap.Point(pathPoints[index][0], pathPoints[index][1]));
        }
        var ol = null;//覆盖物
        var styles=styleOptions;
        //最近新增得覆盖物没有ID,所以可以更具此判断赋予新样式。
        if(_this.myOverlay[i].id==null){
          styles=styleDraw;
        }

        if (overlay.drawingMode == "polyline") {
          //创建折线
          ol = new BMap.Polyline(points, styles);
        } else if (overlay.drawingMode == "polygon") {
          //多边形
          ol = new BMap.Polygon(points, styles);
        }else if (overlay.drawingMode == "marker") {
          //点
          ol= new BMap.Marker(points[0]);
          ol.enableDragging();//允许移动
        }
        ol.id=overlay.id;
        ol.guid=overlay.guid;
        ol.drawingMode=overlay.drawingMode;//自己添加的标记是没有这个属性，所以要添加进去
        ol.addEventListener("click",function(arg,arg2){
          return function(type,target){
            console.log("--------单击我了-------");
            console.log(arg);
            arg2({
              type: "waterDraw/setCurrentPath",
              payload: {
                currentPath:arg,
              }
            })
          };
        }(overlay,dispatch));

        //显示标准的名称放在第一个坐标点上面
        //if(overlay.pathName&&""!=overlay.pathName){
          //console.log("isLabelZoom:"+isLabelZoom);

          var label01=new PoperOverlay(new BMap.Point(pathPoints[0][0], pathPoints[0][1]),overlay.pathName,map,isLabelZoom,false);
          label01.guid=ol.guid;

          if("marker"==overlay.drawingMode&&ol){
            //ol.addEventListener("dragend",dragendFun.bind(this));
            //ol.addEventListener("dragend",markerDrag(ol,label01,overlay));
            //(function(arg,arg2){
              //注意闭包的循环绑定问题
              ol.addEventListener("dragend",function(arg,arg2) {
                return function(lbl){
                  arg.setPosition(lbl.point);
                  arg2.path=JSON.stringify([[lbl.point.lng, lbl.point.lat]]);
                  dispatch({
                    type: "waterDraw/updateOverlayPath",
                    payload: {
                      ...arg2,
                    }
                  })
                }


              }(label01,overlay));

              ol.addEventListener("dragging",function(arg) {
                return function(lbl){
                  arg.setPosition(lbl.point);
                }
              }(label01));

            //}).bind(this)(label01,overlay);//调用时参数



          }

          _this.labelPaths.push(label01);
          map.addOverlay(label01);

        //}

        _this.overlays.push(ol);//临时存储,主要是为了获取覆盖物,以便删除
        if(ol){
          map.addOverlay(ol);
        }

        //创建右键菜单
        bindRightMenu(ol);

      }
    }


  }
  //提示有覆盖物得坐标
  this.activeOverlay = function () {
    if(_this.activePaths.length>0){

      for (var i = 0; i < _this.activePaths.length; i++) {
        map.removeOverlay(_this.activePaths[i]);
      }
      //清除缓存的图形覆盖物
      _this.activePaths.length = 0;
    }else{

      for (var i = 0; i < _this.myOverlay.length; i++) {
        var overlay = _this.myOverlay[i];//默认图形，模拟从数据库加载，和上面的overlays相同{drawingMode:"",point:[[],[]]}
        var pathPoints = JSON.parse(overlay.path);//坐标值转换的坐标对象集合
        var point = pathPoints[0];//在第一个点处弹跳即可
        var marker = new BMap.Marker(new BMap.Point(point[0], point[1]));  // 创建标注

        //设置文字标签的title
        /**if (overlay.pathName&&""!=overlay.pathName) {
          var label = new BMap.Label(overlay.pathName, {offset: new BMap.Size(20, -10)});
          marker.setLabel(label);
        }**/

        map.addOverlay(marker);               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        this.activePaths.push(marker);
      }
    }
  }


  //init(context, overlaysX, myOverlayX, dispatchX);
}
