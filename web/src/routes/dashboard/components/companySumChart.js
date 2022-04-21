import React,{Component } from 'react'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';

import '../../../utils/macarons'

class companySumChart extends Component {

  render() {             //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="companySumChart"  style={{width:"100%",height:"385px"}}/>
      </div>
    )
  }
  initChart(){             //初始化
    const {data1,data2,data3} = this.props
    let myChart = echarts.init(document.getElementById('companySumChart'))
    let options = this.setOption(data1,data2,data3)
    myChart.setOption(options)
  }
  setOption(data1,data2,data3){     //绘图
    return {
      title: {
        text: '公司销售总额和公司销售成本',
        subtext: '公司近两年数据',
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data:['公司成本','销售总额'],
        x: 'center',
        show:'true',
        top:'1%'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        right:'2%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data1
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'销售总额',
          data: data2,
          type: 'line',
          areaStyle: {},
        },
        {
          name:'公司成本',
          data: data3,
          type: 'line',
          areaStyle: {},
        }
      ]

    }
  }
  constructor(props) {   //绑定方法
    super(props)
    this.setOption = this.setOption.bind(this)
    this.initChart = this.initChart.bind(this)
  }
  componentDidMount() {          //渲染方法
    this.initChart();
  }
  componentDidUpdate() {      //更新方法
    this.initChart();
  }
}

export default Form.create()(companySumChart)
