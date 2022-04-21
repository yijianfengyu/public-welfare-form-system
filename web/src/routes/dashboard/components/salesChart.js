import React,{Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class salesChart extends Component {
  render() {             //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="salesChart"  style={{width:"100%",height:"280px"}}/>
      </div>
    )
  }
  initChart(){             //初始化
    const {data1,data2,salesChartTitle} = this.props
    let myChart = echarts.init(document.getElementById('salesChart'))
    let options = this.setOption(data1,data2,salesChartTitle)
    myChart.setOption(options)
  }

  setOption(data1,data2,salesChartTitle){     //绘图
    return {
      title: {
        text: salesChartTitle
      },
      tooltip: {
        trigger: 'axis'
      },
      // legend: {
      //   data:['Real Gross Profit(RMB)']
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        right:'2%'
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
          name:'Real Gross Profit(RMB)',
          type:'line',
          stack: '总量',
          data:data2
        },
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

export default Form.create()(salesChart)
