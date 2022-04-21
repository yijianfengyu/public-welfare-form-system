import React,{Component } from 'react'
import PropTypes from 'prop-types'
import {Form} from 'antd'

import echarts from 'echarts/lib/echarts';
import  'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class rateChart extends Component {
  constructor(props) {   //绑定方法
    super(props)
    this.setOption = this.setOption.bind(this)
    this.initChart = this.initChart.bind(this)
    this.state={
      min:6,
      max:9,
      selectedCurrency:{  'USD': true,  'HKD': false, 'GBP': false, 'EUR': false,}
    }
  }

  componentWillReceiveProps(){
    this.initChart();
  }

  componentDidMount() {          //渲染方法
    let myChart=this.initChart();
    let that=this
    myChart.on('legendselectchanged', function (params) {
      // 获取点击图例的选中状态
      if( params.name == "HKD" && params.selected.HKD == true){
        that.setState({
          min:0,
          max:1,
          selectedCurrency:{  'USD': false,  'HKD': true, 'GBP': false, 'EUR': false,
          },
        },that.componentWillReceiveProps)
      }else{
        params.selected.HKD=false
        that.setState({
          min:6,
          max:9,
          selectedCurrency:params.selected
        },that.componentWillReceiveProps)
      }
    });
  }

  render() {             //定义一个有宽高的div组件  装图表
    return (
      <div>
        <div  id="rateChart"  style={{width:"100%",height:"310px"}}/>
      </div>
    )
  }
  initChart(){             //初始化
    const {gbpDate,usdDate,hkdDate,eurDate,timeDate} = this.props
    let myChart = echarts.init(document.getElementById('rateChart'))
    let options = this.setOption(gbpDate,usdDate,hkdDate,eurDate,timeDate,this.state.min,this.state.max,this.state.selectedCurrency)
    myChart.setOption(options)
    this.setState({
      myChart:myChart
    })
    return myChart
  }

  setOption(gbpDate,usdDate,hkdDate,eurDate,timeDate,min,max,selectedCurrency){     //绘图
    return {
      title: {
        text: '中国人民银行实时汇率',
        subtext: '近三个月数据',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data:['HKD','GBP','USD','EUR'],
        x:"right",
        right:"22%",
        top:"9%",
        selected: selectedCurrency
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
        data: timeDate
      },
      yAxis: {
        type: 'value',
        min:min,
        max:max,
      },
      series: [
        {
          name:'GBP',
          type:'line',
          data:gbpDate
        },

        {
          name:'EUR',
          type:'line',
          data:eurDate
        },
        {
          name:'USD',
          type:'line',
          data:usdDate
        },
        {
          name:'HKD',
          type:'line',
          data:hkdDate
        }
      ]
    }
  }


}

export default Form.create()(rateChart)
