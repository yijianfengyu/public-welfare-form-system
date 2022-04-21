import React from 'react'
import styles2 from '../../utils/commonStyle.less'
import {DatePicker, } from 'antd'

class DatePickers extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stateValue: undefined
    }
  }
  render() {
    let that = this;
    function handleSubmit(date, dateString) {
      that.state.stateValue=dateString
    }
    return (
      <DatePicker onChange={handleSubmit} size='default' style={{width: "200px"}}/>
    );
  }

// ,maxWidth:this.props.maxWidth+"px"

}

export default DatePickers
