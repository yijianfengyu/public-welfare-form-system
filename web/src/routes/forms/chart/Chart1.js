import React,{Component } from 'react'
import {Form} from 'antd'
import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';

class Chart1 extends Component {

  render() {        //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="line1Chart"  style={{width:"100%",height:"350px"}}/>
      </div>
    )
  }
  initChart(){       //初始化
    var {echartsBarLineSetting} = this.props;
    let myChart = echarts.init(document.getElementById('line1Chart'));

    myChart.setOption(echartsBarLineSetting,true,false);
  }
  constructor(props) {//绑定方法
    super(props);
    this.initChart = this.initChart.bind(this);
  }
  componentDidMount() {//渲染方法
    this.initChart();
  }
  componentDidUpdate() {//更新方法
    this.initChart();
  }
}

export default Form.create()(Chart1)
