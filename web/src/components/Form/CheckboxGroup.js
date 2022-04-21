import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import {Checkbox,Row,Col} from 'antd'
class CheckboxGroup extends React.Component {
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
  static defaultProps = {
    type: "CheckboxGroup"
  };
  handleChange = (checkedValues) => {
    console.log("--选中---",checkedValues);
    let result=[];
    for(let i=0;i<checkedValues.length;i++){
        result.push(this.props.options[checkedValues[i]]);
    }

    this.props.onChange(result);
    this.setState({seleted:checkedValues});
  };

  //初始化事件
  constructor(props, ...rest) {
    super(props, ...rest);
    let state = this.state || (this.state = {});
    let regex=/\[|\]/g;
    console.log("--多选的--",props.value);
    let dv=[];
    if (typeof (props.value) == "string") {
      dv = regex.test(props.value)!=true? [] : JSON.parse(props.value);
    } else {
      dv = props.value;
    }
    let seleted=[];
    for(let i=0;i<this.props.options.length;i++){
      for(let k=0;k<dv.length;k++){
        if(this.props.options[i].uuid==dv[k].uuid){
          seleted.push(i);
        }
      }
    }
    this.state = {seleted};
  }


  render() {
    let { value, onChange,options} = this.props;
    const checkboxOption = options.map((option,index) => <Col span={8} key={index}><Checkbox value={index}>{option.option}</Checkbox></Col>);
    return <Checkbox.Group value={this.state.seleted} onChange={this.handleChange}>
        <Row>
          {checkboxOption}
        </Row>
      </Checkbox.Group>
  }
}
export default CheckboxGroup;
