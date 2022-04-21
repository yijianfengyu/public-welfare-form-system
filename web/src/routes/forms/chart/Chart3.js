import React,{Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class Chart3 extends Component {
  render() {             //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="Chart3"  style={{width:"100%",height:"500px"}}/>
      </div>
    )
  }
  initChart(){//初始化
    const {textData1,textData2} = this.props
    let myChart = echarts.init(document.getElementById('Chart3'))
    let options = this.setOption(textData1,textData2)
    myChart.setOption(options)
  }
  setOption(textData1,textData2){     //绘图
    return {
      title: {
        text: '填写表单系统环境'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   data: textData1
      // },
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        right:'2%'
      },
      series : [
        {
          name: '填写表单系统环境',
          type: 'pie',
          radius : '80%',
          center: ['50%', '55%'],
          data:textData2,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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

export default Form.create()(Chart3)
