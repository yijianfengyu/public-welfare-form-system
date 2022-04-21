import React from 'react'
import { render } from 'react-dom'
import { Col, Input, InputNumber, Row } from 'antd'
import PropTypes from './propTypes'

/**
 * 百分比数字类型，在显示时按百分比显示
 */
class FormMeasurement extends React.Component {
  //注意:有属性才会自动从定义中取出值
  static propTypes = {
    value: PropTypes.value,
    id: PropTypes.id,
    name: PropTypes.htmlFor,
    className: PropTypes.typeClass,
    placeholder: PropTypes.string,
    onChange: PropTypes.valueEvent,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  }
  static defaultProps = {
    type: 'FormMeasurement',
  }
  constructor(props, ...rest) {
    super(props, ...rest);
    if(props.value){
      let json = Object.prototype.toString.call(props.value ) === '[object Object]'?props.value:JSON.parse(props.value);
      this.state={
        measurement:{
          readings:json.readings,
          dilution:json.dilution,
          actuals:json.actuals,
        }
      }
    }else{
      this.state={
        measurement:{
          readings:'',
          dilution:'',
          actuals:'',
        }
      }
    }

  }
  handleChange1 = (value) => {
    value= value+'';
    let index=value.indexOf(".");
    let len=value.length;
    if(len-index>4){
      value=value.substring(0,index+5);
    }
    let obj = this.state.measurement;
    obj.readings=value;
    if(obj.readings&&obj.dilution){
      obj.actuals=(parseFloat(obj.readings)*parseInt(obj.dilution)).toFixed(4);
    }

    this.props.onChange(obj)
  }
  handleChange2 = (value) => {
    value=value+'';
    let index=value.indexOf(".");
    if(index!=-1){
      value=value.substring(0,index);
    }
    let obj = this.state.measurement;
    obj.dilution=value;
    if(obj.readings&&obj.dilution){
      obj.actuals=(parseFloat(obj.readings)*parseInt(obj.dilution)).toFixed(4);
    }
    this.props.onChange(obj);
  }

  render () {
    return <div>
      <Row style={{ marginBottom: '10px' }}>
        <Col span={7}>
          <InputNumber min={this.state.measurement.readingsMin}
                       max={this.state.measurement.readingsMax}  type='number' step="0.0001"
                       onChange={this.handleChange1}
                       id={this.props.id}
                       name={this.props.name}
                       value={this.state.measurement.readings}
                       placeholder="填写仪表读数"/>
        </Col>
        <Col span={7}>
          <InputNumber min={this.state.measurement.dilutionMin}
                       max={this.state.measurement.dilutionMax}
                       type='number' step="1"
                       onChange={this.handleChange2}
                       id={this.props.id}
                       name={this.props.name}
                       value={this.state.measurement.dilution}
                       placeholder="填写稀释倍数"/>
        </Col>
        <Col span={1}></Col>
        <Col span={9}>{this.state.measurement.actuals}</Col>
      </Row>
    </div>;
  }
}

export default FormMeasurement
