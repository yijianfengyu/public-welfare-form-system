import React,{Component } from 'react'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class salesGPChart extends Component {
  render() {             //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="salesGPChart"  style={{width:"100%",height:"310px"}}/>
      </div>
    )
  }
  initChart(){             //初始化
    const {ymDate,amountDate,customerDate,gpDate} = this.props
    let myChart = echarts.init(document.getElementById('salesGPChart'))
    let options = this.setOption(ymDate,amountDate,customerDate,gpDate)
    myChart.setOption(options)
  }

  setOption(ymDate,amountDate,customerDate,gpDate){     //绘图
    return {
      title: {
        text: '公司销售额、客户增长量和提成曲线图',
        subtext: '今年与去年数据',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data:['总销售量(单位:十万)','总客户增长量','总提成(单位:万)'],
        x:"right",
        right:"22%",
        top:"9%"
      },
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
        data: ymDate
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'总销售量(单位:十万)',
          type:'line',
          data:amountDate
        },
        {
          name:'总客户增长量',
          type:'line',
          data:customerDate
        },
        {
          name:'总提成(单位:万)',
          type:'line',
          data:gpDate
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

export default Form.create()(salesGPChart)
