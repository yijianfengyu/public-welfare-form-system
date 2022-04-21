import React from 'react'

import { Button,Icon } from 'antd';

class Btn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnVisible: "false",
      iconVisible: "false",
    }
  }
    render (){
      return (
       <div>
         { this.props.btnVisible && <div><span>{this.props.content}</span> <Button >{this.props.btnTitle}</Button><span>{this.props.lastcontent}</span></div>}
         { this.props.iconVisible && <div><span>{this.props.content}</span> <Icon type={this.props.type}/><span>{this.props.lastcontent}</span></div>}
       </div>
        )
    }
}

export default Btn
