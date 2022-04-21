import React from 'react'
import styles2 from '../../utils/commonStyle.less'
import {Icon, } from 'antd'

class Header extends React.Component {

  constructor(props){
    super(props);
    this.state={
      width:props.width,
      // isDrag:props.isDrag,
      // isSort:props.isSort ,
      // dispatch:props.dispatch,
      // sort:props.sort, //排序的字段名称
      // type:props.sort.type,
      // dataIndex:props.dataIndex,
    }

    this.oldX=0;
    this.oldWidth=0;
    this.moveFlag=false;
    this.mouseUpHanlde=this.mouseUpHanlde.bind(this);
    this.mouseDownHandle=this.mouseDownHandle.bind(this);
    this.mouseMoveHandle=this.mouseMoveHandle.bind(this);
    this.mouseOverHandle=this.mouseOverHandle.bind(this);
    this.upSort=this.upSort.bind(this);
    this.downSort=this.downSort.bind(this);
    this.sortMove=this.sortMove.bind(this);
    this.mouseDown=this.mouseDown.bind(this);
    this.getStyle=this.getStyle.bind(this);

  }

  mouseDownHandle(event) {
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
    // self.style.cursor = 'col-resize';
    this.moveFlag=true;
    this.oldX = event.pageX;
    this.oldWidth = self.offsetWidth;

    document.addEventListener("mouseup", this.mouseUpHanlde);
    this.refs.self.parentNode.parentNode.parentNode.addEventListener("mousemove", this.mouseMoveHandle);
  }
  mouseOverHandle(event){
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
    self.style.cursor = 'default';
    document.removeEventListener("mouseup", this.mouseUpHanlde);
    this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mousemove", this.mouseMoveHandle);
    this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mouseover", this.mouseOverHandle);
  }
  mouseUpHanlde(event) {
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
    self.style.cursor = 'pointer';
    this.moveFlag=false;

    document.removeEventListener("mouseup", this.mouseUpHanlde);
    this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mousemove", this.mouseMoveHandle);
  }
  getStyle(dom, attr){
    return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
  }
  mouseMoveHandle (event) {
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
    self.style.cursor = 'col-resize';

    if(this.oldX==0 || this.moveFlag==false){
      return;
    }
    if ( this.oldWidth + (event.pageX -  this.oldX) > 0) {
      var newWidth= this.oldWidth + (event.pageX -  this.oldX);
      var paddingWidth=parseInt(this.getStyle(this.refs.self.parentNode.parentNode, "paddingLeft"))*2;

      if(newWidth + paddingWidth - this.props.width<10){
        this.refs.self.style.width=this.props.width-paddingWidth+ "px";
      }else if(newWidth + paddingWidth >= this.props.width) {
        this.refs.self.style.width =  this.oldWidth + (event.pageX -  this.oldX) + "px";
      }
    }

  }

  sortMove(event){
    event.preventDefault();
    event.stopPropagation();
    // this.refs.self.style.cursor = 'pointer';
    // document.removeEventListener("mouseup", this.mouseUpHanlde);
    // this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mousemove", this.mouseMoveHandle);
    // this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mouseover", this.mouseOverHandle);
    // this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mousedown", this.mouseDownHandle);
  }

  upSort(){
    let that = this;
    that.props.sort.payload.type=that.props.type
    this.props.dispatch({
      type: that.props.sort.type,
      payload: that.props.sort.payload
    })
  }

  downSort(){
    let that = this;
    that.props.sort.payload.type=that.props.type+" desc"
    this.props.dispatch({
      type: that.props.sort.type,
      payload: that.props.sort.payload
    })
  }

  mouseDown(){
    // event.preventDefault();
    // event.stopPropagation();
    // this.refs.self.style.cursor = 'pointer';
    // this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mousedown", this.mouseDownHandle);
    // document.removeEventListener("mousedown", this.mouseDownHandle);
  }

  render() {
    return (
      <div className={styles2.textEllipsis} ref="self" style={{width:"100%"}} onMouseDown={"true" == this.props.isDrag?this.mouseDownHandle:null  } onMouseMove={"true" == this.props.isDrag?this.mouseMoveHandle:null} >
        {this.props.title}
        <div className="ant-table-column-sorter" style={{display:"true" == this.props.isSort?"false":"none"}} onMouseMove={this.sortMove} onMouseDown={this.mouseDown}>
          <span className="ant-table-column-sorter-up off" title="↑" onClick={this.upSort}><Icon type="caret-up"></Icon></span>
          <span className="ant-table-column-sorter-down off" title="↓" onClick={this.downSort} ><Icon type="caret-down"></Icon></span>
        </div>
      </div>

    );
  }
// ,maxWidth:this.props.maxWidth+"px"

}

export default Header
