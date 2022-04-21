export function GaodeDraw() {
  var _this = this;
  var defaultLnglat = new AMap.LngLat(116.33719, 39.942384);//默认坐标
  this._map = null;//高德地图对象

  var contextMenu = null;//创建右键菜单
  var mouseTool = null;
  var polyEditor = null;
  var currentMouseOnObj = null;//记录是当前编辑的覆盖物和当前被单击的覆盖物


  /**-------------------
   * 服务器增删改查访问
   */
  function deleteOverlay(overlay) {
    console.log("-------------deleteOverlay-----------");
    _this._map.remove(overlay);
  }

  function saveOverlay(overlay) {
    console.log("-------------saveOverlay-----------");
    //var drawingMode = overlay.CLASS_NAME == "AMap.Marker" ? "marker" : overlay.CLASS_NAME == "AMap.Polyline" ? "polyline" : "polygon";
    var path = [];
    if (overlay.CLASS_NAME == "AMap.Marker") {
      var posi = overlay.getPosition;
      path.push([posi.getLng(), posi.getLat()]);
    } else {
      var paths = overlay.getPath();
      for (var i = 0; i < paths.length; i++) {
        var posi = paths[i];
        path.push([posi.getLng(), posi.getLat()]);
      }
    }
    console.log(path);
    //@保存到服务器
  }

  /**-------------------
   * 覆盖物绑定事件
   */
  function bindEvent(overlay) {
    overlay.on('rightclick', function (e) {
      console.log("------rightclick------");
      currentMouseOnObj = e.target;
      contextMenu.open(_this._map, e.lnglat);
    });
    overlay.on('click', function (e) {
      currentMouseOnObj = e.target;
    });
    overlay.on('mouseout', function (e) {

    });
    overlay.on('mouseover', function (e) {
      currentMouseOnObj = e.target;
    });
    overlay.on("dragend", function (e) {
      //marker,polygon,polyline
      console.log("------drag end----------");
      if (currentMouseOnObj) {
        saveOverlay(currentMouseOnObj);
      }

    });
  }

  /**
   * 设置绘画模式
   * @param type
   */
  this.drawingMode=function(type) {
    switch (type) {
      case 'marker': {
        mouseTool.marker({
          //同Marker的Option设置
        });
        break;
      }
      case 'polyline': {
        mouseTool.polyline({
          strokeColor: '#80d8ff',
          draggable: true,
          //同Polyline的Option设置
        });
        break;
      }
      case 'polygon': {
        mouseTool.polygon({
          fillColor: '#00b0ff',
          strokeColor: '#80d8ff',
          draggable: true,
          //同Polygon的Option设置
        });
        break;
      }
      case 'rectangle': {
        mouseTool.rectangle({
          fillColor: '#00b0ff',
          strokeColor: '#80d8ff',
          draggable: true,
          //同Polygon的Option设置
        });
        break;
      }
      case 'circle': {
        mouseTool.circle({
          radius: 1500,
          strokeColor: "#3366FF", //边框线颜色
          strokeOpacity: 0.3,       //边框线透明度
          strokeWeight: 3,        //边框线宽
          fillColor: "#FFA500", //填充色
          fillOpacity: 0.35,//填充透明度
          draggable: true
        });
        break;
      }
    }
  }

  /**
   * 放大缩小
   * @param paths
   * @param method
   * @returns {Array}
   */
  function converZoomPath(paths, method) {

    var pList = []  // 原始顶点坐标， 在initPList函数当中初始化赋值
    var dpList = [] // 边向量dpList［i＋1］－ dpLIst［i］ 在 initDPList函数当中计算后赋值
    var ndpList = [] // 单位化的边向量， 在initNDPList函数当中计算后肤质，实际使用的时候，完全可以用dpList来保存他们
    var newList = []  // 新的折线顶点，在compute函数当中，赋值
    var dist = 1 * ("-" == method ? -1 : 1);

    for (var i = 0; i < paths.length; i++) {
      var pxl = (_this._map.lngLatToContainer(paths[i]));
      pList.push(new Point(pxl.x, pxl.y));
    }

    //初始化dpList  两顶点间向量差:计算dpList
    for (var index = 0; index < pList.length; ++index) {
      dpList.push(pList[index == pList.length - 1 ? 0 : index + 1].sub(pList[index]));
    }


    //初始化ndpList，单位化两顶点向量差开始计算ndpList
    for (var index = 0; index < dpList.length; ++index) {
      ndpList.push(dpList[index].mulNum(1 / Math.sqrt(dpList[index].dotMul(dpList[index]))));
    }

    //计算新顶点， 注意参数为负是向内收缩， 为正是向外扩张开始计算新顶点
    let count = pList.length;
    for (var index = 0; index < count; ++index) {
      let startIndex = index == 0 ? count - 1 : index - 1;
      let endIndex = index;
      let sinax = ndpList[startIndex].sina(ndpList[endIndex]);
      let length = dist / sinax;
      let vector = ndpList[endIndex].sub(ndpList[startIndex]);

      var point = pList[index].add(vector.mulNum(length));//恢复坐标

      var pixel = new AMap.Pixel(point.x, point.y);
      var lnglat = _this._map.containerToLngLat(pixel);
      newList.push(lnglat);
    }

    console.log(newList);
    return newList;
  }

  /**
   * 关闭绘画笔
   */
  this.closeTools=function() {
    mouseTool.close()//关闭
    /**for (var i = 0; i < radios.length; i += 1) {
      radios[i].checked = false;
    }**/
    //@清除按钮选中状态
  }

  /**--------------
   * 清除所有覆盖物
   */
  this.clearLayovers = function () {
    _this._map.clearMap();
  }

  this.init = function (contextX, dispatchX) {
    /**-------------------
     * 初始化
     */
    console.log("-------9999999999.0------");
    _this._map = new AMap.Map("gdcontainer", {
      center: defaultLnglat,
      zoom: 14,
      resizeEnable: true
    });
    console.log("-------9999999999------");

    /**-------------------
     * 创建右键菜单
     */
    contextMenu = new AMap.ContextMenu();
    mouseTool = new AMap.MouseTool(_this._map);
    //右键编辑
    contextMenu.addItem("编辑", function () {
      //如果是圆的话
      console.log(currentMouseOnObj);
      if (currentMouseOnObj && (currentMouseOnObj.CLASS_NAME == "AMap.Polyline" || currentMouseOnObj.CLASS_NAME == "AMap.Polygon")) {
        polyEditor = new AMap.PolyEditor(_this._map, currentMouseOnObj);
        polyEditor.open();
        //@liuqi 服务器更新
      }
    }, 0);
    //右键删除
    contextMenu.addItem("删除", function () {
      //@liuqi 服务器更新
      if (currentMouseOnObj) {
        deleteOverlay(currentMouseOnObj);
      }
    }, 1);
    //右键保存
    contextMenu.addItem("保存", function () {
      polyEditor.close();
      //@liuqi 服务器更新
      if (currentMouseOnObj) {
        saveOverlay(currentMouseOnObj);
      }
    }, 2);
    //右键转换为多边形
    contextMenu.addItem("转换为多边形", function () {
      console.log(currentMouseOnObj);
      if (currentMouseOnObj && currentMouseOnObj.CLASS_NAME == "AMap.Polyline") {
        var paths = currentMouseOnObj.getPath();
        var polygon = new AMap.Polygon({
          path: paths,
          fillColor: '#00b0ff',
          strokeColor: '#80d8ff',
          draggable: true,
        });
        _this._map.remove(currentMouseOnObj);
        bindEvent(polygon);
        _this._map.add(polygon);

      }


    }, 3);

    /**-------------------
     * 监听draw事件可获取画好的覆盖物
     */
    mouseTool.on('draw', function (e) {

      e.obj.setOptions ? e.obj.setOptions({
        map: _this._map,
        draggable: true
      }) : e.obj.setDraggable(true);
      bindEvent(e.obj);
      this.closeTools();
    })

    //默认绑定画多边形
    this.drawingMode("polygon");
    /**radios = document.getElementsByName('func');
    for (var i = 0; i < radios.length; i += 1) {
      radios[i].onchange = function (e) {
        draw(e.target.value)
      }
    }**/

    /**---------------
     * 监听放大缩小的快捷键
     * @param event
     */
    document.onkeydown = function (event) {

      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e.shiftKey && e.keyCode == 187) { // 按 +
        ////进行变大计算
        console.log("按了+号键");
        console.log(currentMouseOnObj);
        if (currentMouseOnObj && currentMouseOnObj.CLASS_NAME == "AMap.Polygon") {
          var centerPoint = currentMouseOnObj.getBounds().getCenter();
          //var centerPixel = this._map.lngLatToContainer(centerPoint);  // 获得 Pixel 对象
          var paths = currentMouseOnObj.getPath();
          var newPaths = converZoomPath(paths, '+');
          currentMouseOnObj.setPath(newPaths);
        }
      }
      if (e.shiftKey && e.keyCode == 189) { // 按 —
        //缩小计算
        console.log("按了-号键");
        if (currentMouseOnObj) {
          //进行缩小计算
          var centerPoint = currentMouseOnObj.getBounds().getCenter();
          var paths = currentMouseOnObj.getPath();
          var newPaths = converZoomPath(paths, '-');
          currentMouseOnObj.setPath(newPaths);
        }
      }

    };


  }
}
