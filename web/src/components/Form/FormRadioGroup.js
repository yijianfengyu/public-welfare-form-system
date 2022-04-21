import React from 'react';
import PropTypes from './propTypes'
import { Row, Col, Radio, Select as Se } from 'antd'
const RadioGroup = Radio.Group;
class FormRadioGroup extends React.Component {
  static defaultProps = {
    type: "FormRadioGroup"
  };
  static propTypes = {
    onChange: PropTypes.valueEvent,
    options: PropTypes.options,
    onBlur     : PropTypes.blurValidate,
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    uuid: PropTypes.string,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    dataType   : PropTypes.string,
    fieldAttrs : PropTypes.fieldAttrs,
    dispatch : PropTypes.func,
    subFormShow : PropTypes.object,
  };
  handleChange = (e) => {
    let index=e.target.value;
    this.setState({
      seletedIndex:''+index,
    });
    let option=this.state.optionList[index];
    this.props.onChange(option);
    this.props.dispatch({
          uuid:this.props.uuid+'',
          subUuid:option.uuid+'',
        });

  };

  //初始化事件
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {optionList:[],seletedIndex:'0'};
  }
  componentDidMount() {
    let options=this.props.options;
    let value='';
    if(this.props.value&&this.props.value!=''){
      value=Object.prototype.toString.call(this.props.value ) === '[object Object]'?this.props.value:JSON.parse(this.props.value);
    }
    let seletedIndex="";
    for(let i=0;i<options.length;i++){
      if(value&&value.uuid==options[i].uuid){
        seletedIndex=''+i;
      }
    }
    this.setState({
      seletedIndex:seletedIndex,
      optionList:options,
    });
  }

  render() {
    let { value, onChange,options} = this.props;
    const checkboxOption = options.map((option,index) =>
      <Col span={8} key={"cbo"+index}><Radio value={index+''}>{option.option}</Radio></Col>);
    return (<RadioGroup value={this.state.seletedIndex} onChange={this.handleChange}>
        <Row>
          {checkboxOption}
        </Row>
      </RadioGroup>
    )
  }
}
export default FormRadioGroup;
