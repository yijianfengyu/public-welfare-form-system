import React from 'react';
import {render} from 'react-dom';
import { Input,InputNumber } from 'antd';
import PropTypes from './propTypes'

/**
 * 百分比数字类型，在显示时按百分比显示
 */
class FormDaily extends React.Component {
  //注意:有属性才会自动从定义中取出值
  static propTypes = {
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    onChange: PropTypes.valueEvent,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    subFormShow : PropTypes.object,
  };
  static defaultProps = {
    type: "FormText"
  };
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state={value:this.props.value}
  }
  handleChange = (e) => {
    let value=e.target.value;
    let len=value.length;
    if(len>this.props.max){
      value=value.substring(0,this.props.max);
    }
    /*    if(len<this.props.min){
          alert("必须满足最小长度:"+this.props.min);
        }*/
    this.setState({value});
    this.props.onChange(value);
  }
  render() {
    return <Input.TextArea rows={3} onChange={this.handleChange}
                         id={this.props.id}
                         name={this.props.name}
                         value={this.state.value}
                         placeholder={this.props.placeholder} />;
  }
}
export default FormDaily;
