import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'
import { Select, Spin } from 'antd'
import { config, request } from '../../utils'
const {api} = config
const {sys} = api
const Option = Select.Option;
class FormRegion extends React.Component {
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
    type: "FormRegion"
  };
  //初始化事件
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {addressDataList:[],addressFetching:false,value:''};
  }
  componentDidMount() {
    let text=this.props.value;
    let txt="";
    if(text&&text!=""){
      let json = Object.prototype.toString.call(text ) === '[object Object]'?text:JSON.parse(text);
      let province = json.province? json.province : "";
      let city = json.city? " "+json.city : "";
      let county = json.county? " "+json.county : "";
      let town = json.town? " "+json.town : "";
      let village = json.village? " "+json.village : "";
      let others = json.others? " "+json.others : "";
      txt = province +  city +  county + town + village + others;
    }
    this.setState({
      value:txt,
    });

  }
  fetchAddress=(value)=>{
    this.setState({
      addressFetching: true,
    });
    let that=this;
    request({
      url: sys + "/getRegionList",
      method: 'post',
      data: {
        address:value,
      },
    }).then((res)=>{
      if(res.success){
        that.setState({
          addressDataList: res.list,
          addressFetching: false,
        });
      }

      }
    ).catch((e)=>{
      console.log("服务器获取地址列表失败",e);
      this.setState({
        addressFetching: false,
      });
    });
  }
  handleAddressChange=(value)=>{
    this.setState({
        addressFetching: false,
      });
    value=this.state.addressDataList[value];
    let {id,lng,lat,mername,isadd}=value;
    let list=mername.split(",");
    let province = list[1]? list[1] : "";
    let city = list[2]? list[2] : "";
    let county = list[3]? list[3] : "";
    let town = list[4]? list[4] : "";
    let village = list[5]? list[5] : "";
    let others = list[6]? list[6] : "";
    let obj=JSON.stringify({
      id,lng,lat,isadd,province,city,county,town,village,others
    });
    this.props.onChange(obj);
    this.setState({value: province +" "+  city +" "+  county+" " + town +" "+ village+" " + others});
  }
  render() {
    const addressChild = [];
    for (let i in this.state.addressDataList) {
      addressChild.push(<Option value={i} key={'fadl'+i}>{this.state.addressDataList[i].mername}</Option>);
    }

    return <Select
        value={this.state.value}
        showSearch
        placeholder="选择地址"
        notFoundContent={this.state.addressFetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchAddress}
        onChange={this.handleAddressChange}
        style={{ width: '100%' }}
      >
        {addressChild}
      </Select>
  }
}
export default FormRegion;
