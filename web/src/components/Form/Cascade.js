import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import {Input,Select,Row,Col} from 'antd'
import  ParseCityUtils from '../../utils/ParseCityUtils'
const Option = Select.Option;
let areaData = ParseCityUtils
//省
let provinceData = areaData.provinceData;
//市
let cityData = areaData.cityData;
//县
let countyData = areaData.countyData;

class Cascade extends React.Component {
  static propTypes = {
    onChange: PropTypes.valueEvent,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  };

  //初始化事件
  constructor(props, ...rest) {
    super(props, ...rest);
    var state = this.state || (this.state = {});
    var regex = /\{|\}/g;
    if (typeof (props.value) == "string") {
      state.value = regex.test(props.value) != true ? {} : JSON.parse(props.value);
      state.area = regex.test(props.value) != true ? {} : JSON.parse(props.value);
    } else {
      state.value = props.value;
      state.area = props.value;
    }
    let provinceDataIndex;
    for (var i in provinceData) {
      if (state.value.province != undefined) {
          if(state.value.province==provinceData[i]){
            provinceDataIndex=i
          }
      }
    }
    state.cities = provinceDataIndex!= undefined?cityData[provinceData[provinceDataIndex]]:[];
    state.countys =  state.value.city != undefined&&state.value.city != ""?countyData[state.value.city]:[];
  }

  static defaultProps = {
    type: "Cascade"
  };
  //给省赋值的改变事件
  handleProvinceChange = (value) => {
    let that = this;
    let obj = that.state.area;
    obj.province = value
    obj.city = ""
    obj.county = ""
    that.setState({
      cities: cityData[value],
      value: obj,
      area: obj,
    });
    that.props.onChange(obj);
  }
  //给市赋值的改变事件
  onSecondCityChange = (value) => {
    let that = this;
    let obj = that.state.area;
    obj.city = value
    obj.county = ""
    that.setState({
      countys: countyData[value],
      value: obj,
      area: obj,
    });

    that.props.onChange(obj);
  }
  //给县赋值的改变事件
  onCountyChange = (value) => {
    let that = this;
    let obj = this.state.area;
    obj.county = value
    that.setState({
      value: obj,
      area: obj,
    });
    that.props.onChange(obj);
  }
  //给文本框赋值的改变事件
  handleTextChange = (e) => {
    var value = e.target.value;
    let that = this;
    let obj = this.state.area;
    obj.others = value
    that.setState({
      value: obj,
      area: obj,
    });
    that.props.onChange(obj);
  }

  render() {
    let { value, onChange} = this.props;
    const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
    const cityOptions = this.state.cities.map(city => <Option key={city}>{city}</Option>);
    const countyOptions = this.state.countys.map(county => <Option key={county}>{county}</Option>);
    return <div>
        <Row style={{marginBottom:'10px'}}>
          <Col span={8}>
            <Select size="large" placeholder="省" onChange={this.handleProvinceChange}
                    value={this.state.value.province!=undefined?this.state.value.province:"省"}
                    style={{width:'100%',boxShadow: "inset 0 1px 1px rgba(0, 0, 0, .075)"}}>
              {provinceOptions}
            </Select>
          </Col>
          <Col span={7} offset={1}>
            <Select size="large" placeholder="市" onChange={this.onSecondCityChange}
                    value={this.state.value.city!=undefined?this.state.value.city:"市"}
                    style={{width:'100%',boxShadow: "inset 0 1px 1px rgba(0, 0, 0, .075)"}}>
              {cityOptions}
            </Select>
          </Col>
          <Col span={7} offset={1}>
            <Select size="large" placeholder="县" onChange={this.onCountyChange}
                    value={this.state.value.county!=undefined?this.state.value.county:"县"}
                    style={{width:'100%',boxShadow: "inset 0 1px 1px rgba(0, 0, 0, .075)"}}>
              {countyOptions}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input size="large" placeholder="详细地址" style={{width:'100%',boxShadow: "inset 0 1px 1px rgba(0, 0, 0, .075)"}} onChange={this.handleTextChange}
                   value={this.state.value.others!=undefined?this.state.value.others:""}/>
          </Col>
        </Row>
      </div>

  }
}
export default Cascade;
