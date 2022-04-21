import {PoperOverlay} from "./PoperOverlay";

export function PopEditInfo(mapX,overlayX,dispatchX,labelPathsX,myOverlayX){
  var drawingMode=overlayX.drawingMode;
  var path =  "marker"==drawingMode?[overlayX.getPosition()]:overlayX.getPath();;//markerf转换到数组主要是为了统一处理
  var pathArr = [];
  for (var k = 0; k < path.length; k++) {
    pathArr.push([path[k].lng, path[k].lat]);
  }

  var newOverlay = {
    drawingMode: overlayX.drawingMode,
    path: JSON.stringify(pathArr),
    id: null,
    guid: overlayX.guid,
  };
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
    dispatchX({
      type: "waterDraw/saveOverlayPath",
      payload: {
        ...newOverlay,
      }
    })
    mapX.closeInfoWindow(infoWindow,point);
    if(newOverlay.pathName&&""!=newOverlay.pathName){
      //更新label的显示
      for(var index=0; index<labelPathsX.length;index++){
        if(labelPathsX[index].guid==overlayX.guid){
          labelPathsX[index].setContent(newOverlay.pathName);
          if("marker"==drawingMode){
            labelPathsX[index].show();
          }
          break;
        }
      }
      //更新缓存
      for(var k=0;k<myOverlayX.length;k++){
        if(myOverlayX[k].guid==overlayX.guid){
          myOverlayX[k].pathName=newOverlay.pathName;
          break;
        }
      }
    }
  }

  pathNameBtn.addEventListener("click", saveEvt);

  div.addEventListener("keydown",function(){
    if(event.keyCode == 13){
      if(pathNameInput.value==""){
        mapX.closeInfoWindow(infoWindow,point);
      }else{
        saveEvt();
      }

    }
  });


  div.appendChild(pathNameInput);
  div.appendChild(pathNameBtn);
  mapX.openInfoWindow(infoWindow,point);

}
