import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import Uploads from './Uploads'
import {Checkbox, Col, Input, Row, Radio } from "antd";
const RadioGroup = Radio.Group;
class RadioAttach extends React.Component {
  //注意:有属性才会自动从定义中取出值
  static propTypes = {
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    onChange: PropTypes.valueEvent,
    options: PropTypes.options,
  };
  static defaultProps = {
    type: "RadioAttach"
  };
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state={
      value:{
        option:'',
        score:'',//分值
        describe:'',//描述
        picture:'',//图片
      }
    }
  }
  radioChange = (e) => {
    console.log(e);
    let that = this;
    let obj = this.state.value;
    let value=e.target.value;
    let temp=value.indexOf("@@")!=-1?value.split("@@"):["",""]
    obj.option=temp[1];
    obj.score=temp[0];
    this.setState({value:obj})
    that.props.onChange(obj);
  };
  describeChange = (e) => {
    let that = this;
    let obj = this.state.value;
    const { value } = e.target;
    obj.describe=value;
    this.setState({value:obj})
    that.props.onChange(obj);
  };
  fileChange = (fileName) => {
    let that = this;
    let obj = this.state.value;
    obj.picture=fileName;
    this.setState({value:obj})
    that.props.onChange(obj);
  };
  render() {
    /***
     * value:{
  text:'月',//单选选择的值
  score:'0.1',//分值
  describe:'',//描述
  picture:'',//图片
  date:'',//时间
}
     */
    let {options} = this.props;
    const radioOption = options.map((option,index) => <Col span={12} key={index}><Radio value={option.score+"@@"+option.option}>{option.option}</Radio></Col>);
    return  (<div>
      <Row style={{marginBottom:'10px'}}>
        <Col span={24}>
        <RadioGroup onChange={this.radioChange}>
          <Row>
            {radioOption}
          </Row>
        </RadioGroup>
        </Col>
      </Row>
      <Row style={{marginBottom:'10px'}}>
        <Col span={24}>
          <Input.TextArea onChange={this.describeChange} />
        </Col>
      </Row>
      <Row style={{marginBottom:'10px'}}>
        <Col span={24}>
          <Uploads onChanges={this.fileChange} />
        </Col>
      </Row>
    </div>);
  }
}
export default RadioAttach;
