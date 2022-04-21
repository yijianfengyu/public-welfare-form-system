import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import moment from 'moment';
import { DatePicker } from 'antd';
class FormDatetime extends React.Component {
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
    type: "FormDatetime"
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
    return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" defaultValue={moment(value, 'YYYY-MM-DD HH:mm:ss')} onChange={this.handleDateChange} />;
  }
}
export default FormDatetime;
