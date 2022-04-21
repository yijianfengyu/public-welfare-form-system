import React,{Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class salesRankChart extends Component {
  render() {             //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="salesRankChart"  style={{width:"100%",height:"180px"}}/>
      </div>
    )
  }
  initChart(){             //初始化
    const {data1,data2} = this.props
    let myChart = echarts.init(document.getElementById('salesRankChart'))
    let options = this.setOption(data1,data2)
    myChart.setOption(options)
  }
  setOption(data1,data2){     //绘图
    return {
      title: {
        text: '本月销售排行榜'
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
        boundaryGap: true,
        data: data1
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'Real Gross Profit(RMB)',
          type:'bar',
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

export default Form.create()(salesRankChart)
