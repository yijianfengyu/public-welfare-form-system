import React from 'react';
import {render} from 'react-dom';
import { Input } from 'antd';
import PropTypes from './propTypes'

/**
 * 百分比数字类型，在显示时按百分比显示
 */
class FormPhone extends React.Component {
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
    type: "FormPhone"
  };
  handleChange = (e) => {
    const { value } = e.target;
    this.props.onChange(value);
  }
  render() {
    return <Input onChange={this.handleChange} id={this.props.id} name={this.props.name} defaultValue={this.props.value} placeholder={this.props.placeholder} />;
  }
}
export default FormPhone;
