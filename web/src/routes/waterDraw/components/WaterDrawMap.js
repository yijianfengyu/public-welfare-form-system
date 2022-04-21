import React, {Component} from 'react'
import {Row, Col, Form, Select, Button,Table, Radio,Tabs} from 'antd'
import PathsTable from './PathsTable'
import echarts from 'echarts/lib/echarts';

import  'echarts/extension/bmap/bmap'
import 'echarts/lib/component/geo';
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/scatter';
import  'echarts/lib/chart/effectScatter';
import  'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
class WaterDrawMap extends React.Component {

  render() {
  console.log("------render WaterDrawMap -------");
    console.log(this.props);
    let list = this.waterTypes.map((item,i) => (
      <TabPane  tab={item} key={i}></TabPane>
    ));

    var table=(<PathsTable {...this.props} updatePathName={this.updatePathName} />);
    var tools=( <Form>
      <FormItem
        label="城市"
        hasFeedback
      >
        <Select defaultValue={this.state.defaultCity} value={this.state.defaultCity} style={{width: 120}} onChange={this.getcs}>
          <Option value="长沙市">长沙市</Option>
          <Option value="北京市">北京市</Option>
          <Option value="上海市">上海市</Option>
          <Option value="合肥市">合肥市</Option>
          <Option value="广州市">广州市</Option>
        </Select>
      </FormItem>
      <FormItem
        label="水体"
        hasFeedback
      >
        <Select defaultValue="" style={{width: 120}} onChange={this.setPathType}>
          <Option value="">--</Option>
          <Option value="水系范围">水系范围</Option>
          <Option value="七大水系干流及一级支流河流轨迹">七大水系干流及一级支流河流轨迹</Option>
          <Option value="水电分布">水电分布</Option>
          <Option value="河流垃圾监测信息">河流垃圾监测信息</Option>
          <Option value="黑臭水体监测信息">黑臭水体监测信息</Option>
          <Option value="水源地信息">水源地信息</Option>
          <Option value="守望者守望河流认领信息">守望者守望河流认领信息</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button onClick={this.clearAll}>清除所有覆盖物图形</Button>
        <Button onClick={this.loadMyOverlay}>-显示缓存图形-</Button>
        <Button onClick={this.activeOverlay}>提示哪些地方有绘制</Button>
      </FormItem>
      <FormItem>
        <div>Development tools测试工具</div>
        <Button onClick={this.addCopyLayer}>添加临摹地图</Button>
        <Button onClick={this.printAll}>log所有覆盖物</Button>
      </FormItem>
      <FormItem>
        <Radio.Group value="polygon" onChange={this.handleDrawingModeChange}>
          <Radio.Button value="marker">标记点</Radio.Button>
          <Radio.Button value="polyline">画折线</Radio.Button>
          <Radio.Button value="polygon">画多边形</Radio.Button>
          <Radio.Button value="clear">清除</Radio.Button>
          <Radio.Button value="close">关闭绘图</Radio.Button>
        </Radio.Group>
      </FormItem>
    </Form>);
    return (
      <div style={{minHeight:'768px'}}>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Tabs defaultActiveKey="0" onChange={this.tabsChange}>
              {list}
            </Tabs>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Row gutter={24} style={this.props.tabIndex==9?{display:'none'}:{display:'block'}}>
              <Col lg={20} md={20}>
                <div id="allmap" style={{overflow: "hidden", zoom: 1, position: "relative", width: '100%', height: '100vh'}}>
                  <div id="map" style={{height: '100%',}}>
                  </div>
                </div>

                <div id="gdcontainer"></div>

              </Col>
              <Col lg={4} md={4}>
                {this.props.tabIndex==0?tools:table}
              </Col>
            </Row>
            <Row gutter={24} style={parseInt(this.props.tabIndex)==9?{display:'block'}:{display:'none'}}>
              <Col lg={24} md={24}>
                <div style={{overflow: "hidden", zoom: 1, position: "relative", width: '100%', height: '100%'}}>
                  <div  id="hotChart"  style={{
                    width:"100%",
                    height:'100vh'
                  }}/>
                </div>
              </Col></Row>
          </Col>
        </Row>
      </div>
    )
  }

  //城市级别地图
  getcs(csdict) {
    this.draw.getcs(csdict);
  }

  setPathType(pathType){
    this.setState({
      pathType: pathType
    });
    //清除图形
    this.clearAll();
    //后台加载对应类别数据
    this.props.dispatch({
      type: "waterDraw/initOverlayPath",
      payload: {
        pathType:pathType,
      }
    })
  }

  //3、清除地图上所有覆盖物,并不删除缓存数据的数据
  clearAll() {
    this.draw.clearAll();
  }

  //2、打印所有覆盖物图形
  printAll() {
    this.draw.printAll();
  }

  //2、打印所有覆盖物图形
  addCopyLayer=() =>{
    this.draw.addCopyLayer();
  }

  //从数据加载多边形
  loadMyOverlay() {
    this.draw.loadMyOverlay(false,false);
  }

  activeOverlay(){
    this.draw.activeOverlay();
  }

  updatePathName=(guid,txt) =>{
    this.draw.updateLabel(guid,txt);
  }

  constructor(props) {//绑定方法
    super(props);
    // 百度地图API功能

    this.getcs = this.getcs.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.printAll = this.printAll.bind(this);
    this.loadMyOverlay = this.loadMyOverlay.bind(this);
    this.setPathType=this.setPathType.bind(this);
    this.activeOverlay=this.activeOverlay.bind(this);
    this.draw=null;
    //this.waterTypes=['水体编辑器','水系范围','七大水系干流及一级支流河流轨迹','水电分布','河流垃圾监测信息','黑臭水体监测信息','水源地信息','守望者守望河流认领信息','守望日记2018','守望者分布'];
    this.waterTypes=['水体编辑器','水系范围','七大水系干流及一级支流河流轨迹','水电分布','河流垃圾监测信息','黑臭水体监测信息','水源地信息'];
    //this.tabsChange=this.tabsChange.bind(this);
    this.state={
      defaultCity:"北京市",
    }

    this.gdEdit=null;

  }

  handleDrawingModeChange = (e) => {
    console.log("----------handleDrawingModeChange----------");
    var mode=e.target.value;
    if(mode=="close"){
      this.props.gdEdit.closeTools();
    }else if(mode=="clear"){
      this.props.gdEdit.clearLayovers();
    }else{
      this.props.gdEdit.drawingMode(e.target.value);
    }

  }

  setCity=(ee)=>{

     console.log(ee);
    this.setState({
      defaultCity:ee.name,
    });
  }
   tabsChange=(key) =>{
    //把界面的数据切换一下
     if(key!=0){
       var styleOptions= {
         strokeColor: "#187BC0",    //边线颜色。
         fillColor: "#2796E4",      //填充颜色。当参数为空时，圆形将没有填充效果。
         strokeWeight: 2,       //边线的宽度，以像素为单位。
         strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
         fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
         strokeStyle: 'solid' //边线的样式，solid或dashed。
       };
       if(key==5){
         styleOptions.strokeColor="#59181A";
         styleOptions.fillColor="#F38B89";
       }
       this.draw.setViewStyle(styleOptions);
       this.draw.setDrawingManagerHide();
     }else{
       this.draw.setDrawingManagerShow();
     }

     if(key==1||key==2){
       this.draw.setZoom(5);
     }else{
       this.draw.setZoom(11);
     }
     this.props.dispatch({
       type: "waterDraw/querysOverlayPath",
       payload: {
         tabIndex:key,
         pathType:this.waterTypes[key],
         tabChanged:true,
       }
     })

  }

  componentDidMount() {//渲染方法
    console.log("--componentDidMount WaterDrawMap");
    this.draw=this.props.draw;
    this.draw.init(this, this.props.dispatch);

    this.gdEdit=this.props.gdEdit;
    this.gdEdit.init(this, this.props.dispatch);

    var city = new BMap.LocalCity();
    city.get(this.setCity);

  }

  componentDidUpdate() {//更新方法
    console.log("--componentDidUpdate WaterDrawMap");
    //特殊处理
    if(document.getElementById("pathName")){
      //在pathName输入框被创建后再聚焦
      document.getElementById("pathName").focus();
    }
    if(parseInt(this.props.tabIndex)==9){
      if(this.props.echartsPeopleHotSetting){
        var div=document.getElementById('hotChart');
        var echart = echarts.init(div);
        echart.setOption(this.props.echartsPeopleHotSetting, true, false);
      }

    }else{
    }
    //var _draw=this.draw;
   // if(document.getElementsByClassName("BMap_pop")) {
      /**document.getElementsByClassName("BMap_pop")[0].addEventListener("mouseout", function () {
        _draw.clearInfoWindow();
      });**/
    //}
    console.log(this.props);

  }

}

export default Form.create()(WaterDrawMap)
