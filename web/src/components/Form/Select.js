import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import {Select as Se}  from 'antd'
const Option = Se.Option;
class Select extends React.Component {
  static propTypes = {
    onChange: PropTypes.valueEvent,
    options: PropTypes.options,
    onBlur     : PropTypes.blurValidate,
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    dataType   : PropTypes.string,
    fieldAttrs : PropTypes.fieldAttrs,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  };
  handleChange = (index) => {

    this.setState({
      seletedIndex:''+index,
    });
    this.props.onChange(this.state.optionList[index]);
  };

  //初始化事件
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {optionList:[],seletedIndex:'0'};
  }
  componentDidMount() {
    console.log("-----select componentDidMount----",this.props);
    let options=this.props.options;
    let value='';
    if(this.props.value&&this.props.value!=''){
      value=Object.prototype.toString.call(this.props.value ) === '[object Object]'
      || Object.prototype.toString.call(this.props.value ) === '[object Array]'
        || this.props.value.indexOf("{")==-1
        ?this.props.value:JSON.parse(this.props.value);
    }
    let seletedIndex="";
    options.push({
      label: '',
      option: '',
      score: "0",
      uuid: 88888888,
      val: null,
    });
    //console.log(options);
    for(let i=0;i<options.length;i++){
      if(value&&(value==options[i].option||value.uuid==options[i].uuid)){
        seletedIndex=''+i;
      }
    }
    this.setState({
      seletedIndex:seletedIndex,
      optionList:options,
    });
  }

  render() {

    const options = this.state.optionList.map((option,index) => {
      return <Option key={'soo_'+index} value={index+''}>{option.option}</Option>;
    });
    return <Se showSearch value={this.state.seletedIndex}
              style={{ width: '60%' }}
              optionFilterProp="children"
              filterOption={(input, option) => this.state.optionList.indexOf(input) >= 0}
              onChange={this.handleChange}>
        {options}
      </Se>

  }
}
export default Select;
