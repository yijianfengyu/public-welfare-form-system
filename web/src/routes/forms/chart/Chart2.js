import React,{Component } from 'react'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/pie';
import  'echarts/lib/chart/funnel';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import TableUtils from "../../../utils/TableUtils";

class Chart2 extends Component {

  render() {        //定义一个有宽高的div组件  装图表
    const {echartsPieSetting} = this.props;
    let height = (echartsPieSetting.series.length*150+350)+"px";
    return (
      <div>
        <div  id="pieChart"  style={{width:"100%",height:height}}/>
      </div>
    )
  }
  initChart(){       //初始化
    const {echartsPieSetting} = this.props;
    let myChart = echarts.init(document.getElementById('pieChart'));
    /**echartsPieSetting.toolbox.feature.mytools={//自定义按钮 danielinbiti,这里增加，selfbuttons可以随便取名字
      show:true,//是否显示
      color:'#5e5e5e',
        title:'放大', //鼠标移动上去显示的文字
        icon:'path://M90.9,148.9c-30.4,0-55.1-24.7-55.1-55.1s24.7-55.1,55.1-55.1S146,63.3,146,93.7S121.3,148.9,90.9,148.9z M90.9,44.2c-27.3,0-49.6,22.2-49.6,49.6c0,27.3,22.2,49.6,49.6,49.6s49.6-22.2,49.6-49.6C140.5,66.4,118.2,44.2,90.9,44.2z M90.9,125.2c-1.5,0-2.8-1.2-2.8-2.8v-56c0-1.5,1.2-2.8,2.8-2.8c1.5,0,2.8,1.2,2.8,2.8v56C93.6,124,92.4,125.2,90.9,125.2z M118.9,97.2h-56c-1.5,0-2.8-1.2-2.8-2.8c0-1.5,1.2-2.8,2.8-2.8h56c1.5,0,2.8,1.2,2.8,2.8C121.7,96,120.4,97.2,118.9,97.2z', //图标
        onclick:function() {//点击事件,这里的option1是chart的option信息
          console.log("-------hello-----");//series[].radius
          console.log(myChart);
          let radiuArr=TableUtils.caculatorPieRadius(50,echartsPieSetting.series.length);
          for(let i=0;i<echartsPieSetting.series.length;i++){
            echartsPieSetting.series[i].radius=radiuArr[i];
          }
          myChart.setOption(echartsPieSetting);
        }
    }**/

    myChart.setOption(echartsPieSetting,true,false);
  }
  constructor(props) {   //绑定方法
    super(props)

    this.initChart = this.initChart.bind(this)
  }
  componentDidMount() {          //渲染方法
    this.initChart();
  }
  componentDidUpdate() {      //更新方法
    this.initChart();
  }
}

export default Form.create()(Chart2)
