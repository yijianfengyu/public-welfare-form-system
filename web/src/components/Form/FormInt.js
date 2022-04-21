import React from 'react';
import {render} from 'react-dom';
import { Input,InputNumber } from 'antd';
import PropTypes from './propTypes'

/**
 * 百分比数字类型，在显示时按百分比显示
 */
class FormInt extends React.Component {
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
    subFormShow : PropTypes.object,
  };
  static defaultProps = {
    type: "FormInt"
  };
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state={value:this.props.value}
  }
  handleChange = (value) => {
    value=!value?'':value+'';
    let index=value.indexOf(".");
    if(index!=-1){
      value=value.substring(0,index);
    }
    this.setState({value:value});
    this.props.onChange(value);

  }
  render() {
    return <InputNumber step="1"
                        max={this.props.max}
                        min={this.props.min}
                         onChange={this.handleChange}
                         id={this.props.id}
                         name={this.props.name}
                         value={this.state.value}
                         placeholder={this.props.placeholder} />;
  }
}
export default FormInt;
