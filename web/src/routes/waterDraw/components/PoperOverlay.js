/**
 * @author liusi
 * @version 1.0
 * @description 存放各种弹出窗口
 */

/**
 * 基础类
 * @param point
 * @param txt
 * @param map
 * @constructor
 */
export function PoperOverlay(point,txt,map,isZoomX,isHideX,opacityX){
  BMap.Overlay.call(this);
  this._point = point ;
  this._txt = txt ;
  this._div=null;//必须初始化为null
  this._span=null;
  this._map=map;
  this.guid=null;
  this.isZoom=isZoomX;
  this.isHide=isHideX;
  this._opacity=opacityX

  this.initialize= function(){
    this._div= document.createElement("div");
    var div =this._div;
    div.style.display=this.isHide?"none":"block";
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#EE5D5B";
    div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    div.style.opacity=this._opacity?this._opacity:"1";
    div.draggable="true";
    //div.style.zoom=0.2;
    //div.style.webkitTransform="scale(0.5)";


    div.style.padding = "2px 6px";

    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px"

    this._span =  document.createElement("span");
    this._span.innerHTML=this._txt;
    this._div.appendChild(this._span);
    this._map.getPanes().labelPane.appendChild(div);

    return div;
  }

  this.draw = function(){
    console.log("------绘制--------");
    var pixel = this._map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x  + "px";
    this._div.style.top  = pixel.y + "px";
    var zoom=this._map.getZoom();
    if(this.isZoom){
      if(zoom<=8){
        this._div.style.webkitTransform="scale(0)";
        this._div.style.mozTransform="scale(0)";
      }else if(zoom==9){
        this._div.style.webkitTransform="scale(0.3)";
        this._div.style.mozTransform="scale(0.3)";
      } else if(zoom>=9&&zoom<=13){
        this._div.style.webkitTransform="scale(1)";
        this._div.style.mozTransform="scale(1)";
      }else{
        this._div.style.webkitTransform="scale(1)";
        this._div.style.mozTransform="scale(1)";
      }
    }else{
      this._div.style.webkitTransform="scale(1)";
      this._div.style.mozTransform="scale(1)";
    }

  }

  this.setPosition = function(point){
    console.log("999999999999999999999999");
    console.log(this);
    this._point=point
    var pixel = this._map.pointToOverlayPixel(point);
    this._div.style.left = pixel.x  + "px";
    this._div.style.top  = pixel.y + "px";
  }

  this.setContent=function(txt){
    this._txt=txt;
    this._span.innerText=txt;
  }



}
PoperOverlay.prototype = new BMap.Overlay();
PoperOverlay.prototype.constructor = PoperOverlay; // 需要修复下构造函数


/**
 * 基础类
 * @param point
 * @param txt
 * @param map
 * @constructor
 */
export function MapCopyOverlay(point,txt,map,isZoomX,isHideX,opacityX){
  BMap.Overlay.call(this);
  this._point = point ;
  this._txt = txt ;
  this._div=null;//必须初始化为null
  this._span=null;
  this._map=map;
  this.guid=null;
  this.isZoom=isZoomX;
  this.isHide=isHideX;
  this._opacity=opacityX

  this.initialize= function(){
    var outDiv=document.createElement("div");
    this._div= document.createElement("div");

    var div =this._div;
    div.style.display=this.isHide?"none":"block";
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#EE5D5B";
    div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    div.style.opacity=this._opacity?this._opacity:"1";
    div.draggable=true;
    //div.style.zoom=0.2;
    //div.style.webkitTransform="scale(0.5)";
    div.style.zIndex=-1;

    div.style.padding = "2px 6px";

    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px"

    this._span =  document.createElement("span");
    this._span.innerHTML=this._txt;
    this._div.appendChild(this._span);
    this._map.getPanes().labelPane.appendChild(div);

    return div;
  }

  this.draw = function(){
    console.log("------绘制--------");
    var pixel = this._map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x  + "px";
    this._div.style.top  = pixel.y + "px";
    var zoom=this._map.getZoom();
    if(this.isZoom){
      if(zoom<=8){
        this._div.style.webkitTransform="scale(0)";
        this._div.style.mozTransform="scale(0)";
      }else if(zoom==9){
        this._div.style.webkitTransform="scale(0.3)";
        this._div.style.mozTransform="scale(0.3)";
      } else if(zoom>=9&&zoom<=13){
        this._div.style.webkitTransform="scale(1)";
        this._div.style.mozTransform="scale(1)";
      }else{
        this._div.style.webkitTransform="scale(1)";
        this._div.style.mozTransform="scale(1)";
      }
    }else{
      this._div.style.webkitTransform="scale(1)";
      this._div.style.mozTransform="scale(1)";
    }

  }
  this.setPosition = function(point){
    console.log(this);
    this._point=point
    var pixel = this._map.pointToOverlayPixel(point);
    this._div.style.left = pixel.x  + "px";
    this._div.style.top  = pixel.y + "px";
  }

  this.setContent=function(txt){
    this._txt=txt;
    this._span.innerText=txt;
  }

}
MapCopyOverlay.prototype = new BMap.Overlay();
MapCopyOverlay.prototype.constructor = MapCopyOverlay; // 需要修复下构造函数



