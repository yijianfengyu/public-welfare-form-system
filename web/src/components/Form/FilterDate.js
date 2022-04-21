import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import {DatePicker, } from 'antd'
class FilterDate extends React.Component {
  static propTypes = {
    onBlur     : PropTypes.blurValidate,
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    dataType   : PropTypes.string,
    fieldAttrs : PropTypes.fieldAttrs,
    onChange   : PropTypes.valueEvent
  };
  onChange = (date, dateString) => {
    this.props.onChange(dateString);
  };
  render() {
    var { value, onChange} = this.props;
    return  <DatePicker onChange={this.onChange} size='default' style={{width: 150}}/>
  }
}
export default FilterDate;
