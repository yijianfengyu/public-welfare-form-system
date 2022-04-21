import React from 'react'
import styles2 from '../../utils/commonStyle.less'

class DivListener extends React.Component {

  constructor(props){
    super(props);
    this.state={
      width:props.width,
      isDrag:props.isDrag
    }
    this.oldX=0;
    this.oldWidth=0;
    this.moveFlag=false;
    this.mouseUpHanlde=this.mouseUpHanlde.bind(this);
    this.mouseDownHandle=this.mouseDownHandle.bind(this);
    this.mouseOverHandle=this.mouseOverHandle.bind(this);
    this.getStyle=this.getStyle.bind(this);

  }


  mouseDownHandle(event) {
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
    self.style.cursor = 'col-resize';
    this.moveFlag=true;
    this.oldX = event.pageX;
    this.oldWidth = self.offsetWidth;

    document.addEventListener("mouseup", this.mouseUpHanlde);
    this.refs.self.parentNode.parentNode.parentNode.addEventListener("mousemove", this.mouseOverHandle);
  }
  mouseOverHandle(event){
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
  }
  mouseUpHanlde(event) {
    event.preventDefault();
    event.stopPropagation();
    var self=event.target || event.srcElement;
    self.style.cursor = 'default';
    this.moveFlag=false;

    document.removeEventListener("mouseup", this.mouseUpHanlde);
    this.refs.self.parentNode.parentNode.parentNode.removeEventListener("mousemove", this.mouseOverHandle);
  }
  getStyle(dom, attr){
    return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
  }
  mouseOverHandle (event) {
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

  render() {
    return (<div  ref="self" onMouseOver={this.mouseOverHandle} ></div>);
  }

}

export default DivListener
