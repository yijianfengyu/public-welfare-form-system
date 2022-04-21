import React from 'react'
import {Select, } from 'antd'
class QuerySupervisor extends React.Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    var state = this.state || (this.state = {});
    state.value = props.value;
    state.item=props.optionItem;
  }

  onChanges = () => {
    const dispatch = this.props.dispatch
    //const companyCode = this.props.companyCode
    dispatch({
      type: 'app/SelectPrincipalAll',
      payload: {
        //companyCode: companyCode,
      }
    })
    const optionItem = this.props.optionItem
    return optionItem
  }
  // 在第一次渲染后调用，只在客户端。
  componentDidMount() {
    this.setState({item: this.onChanges()});
  }

  //在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({item: newProps.optionItem,value: newProps.value});
    }else{
      this.setState({item: this.props.optionItem});
    }
  }
  handleChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    var {value}=this.props
    return (
      <Select size="default" defaultValue={value} style={{width: "150px"}} onChange={this.handleChange}>
        {this.state.item}
      </Select>
    )
  }
}
export default QuerySupervisor
