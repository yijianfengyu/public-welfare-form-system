import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import moment from 'moment';
import { DatePicker } from 'antd';
class FormDate extends React.Component {
  static propTypes = {
    onBlur     : PropTypes.blurValidate,
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    dataType   : PropTypes.string,
    fieldAttrs : PropTypes.fieldAttrs,
    onChange   : PropTypes.valueEvent,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  };
  static defaultProps = {
    type: "FormDate"
  };

  asInputValue(value) {
    if (!value) {
      return '';
    }
    return new Date(value).toISOString().substring(0, 10);
  }
  handleDateChange = (date, dateString) => {
    //var value = e.target.value;
    this.props.onChange(dateString);
  };
  render() {
    let { value} = this.props;
    if(!value){
      value =new Date();
    }
    return <DatePicker  defaultValue={moment(value, 'YYYY-MM-DD')} onChange={this.handleDateChange} />;
  }
}
export default FormDate;
