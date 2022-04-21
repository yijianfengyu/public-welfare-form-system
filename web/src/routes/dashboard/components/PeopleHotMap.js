import React,{Component } from 'react'
import {Form} from 'antd'
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


class PeopleHotMap extends Component {

  render() {        //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="hotChart"  style={{
          width:'100%',
          height:'50vh'
        }}/>
      </div>
    )
  }
  initChart(){       //初始化

    var {echartsPeopleHotSetting} = this.props;
    let myChart = echarts.init(document.getElementById('hotChart'));
    myChart.setOption(echartsPeopleHotSetting,true,false);
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
export default Form.create()(PeopleHotMap)
