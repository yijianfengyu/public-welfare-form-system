import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import { DatePicker } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;
class DataTimes extends React.Component {
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
    type: "DataTimes"
  };
  constructor(props, ...rest) {
    super(props, ...rest);
    let state = this.state || (this.state = {dateList:['2000-01-01','2000-01-02']});

  }
  asInputValue(value) {
    if (!value) {
      return '';
    }
    return new Date(value).toISOString().substring(0, 10);
  }
  componentDidMount(){
    console.log("--componentDidMount--",this.props.value);
    let value=this.props.value
    let dateArr=value?((typeof value)=='string'?JSON.parse(value):value):['2000-01-01','2000-01-02'];
    console.log(dateArr);
    this.setState({dateList:dateArr});
  }
  handleDateChange = (date, dateString) => {
    //var value = e.target.value;
    console.log("--------",date,dateString)
    this.props.onChange(dateString);
    this.setState({
      dateList:dateString
    });
  };
  render() {
    return <RangePicker value={[moment(this.state.dateList[0], 'YYYY-MM-DD'), moment(this.state.dateList[1], 'YYYY-MM-DD')]} onChange={this.handleDateChange} />
  }
}
export default DataTimes;
