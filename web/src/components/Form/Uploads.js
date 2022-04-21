import React from 'react';
import {render} from 'react-dom';
import {Upload,Button,Icon,message } from 'antd'
import {request, config} from 'utils'
import {Link} from 'dva/router'
import PropTypes from './propTypes'
const {api} = config
const {dingding} = api
class Uploads extends React.Component {
  static propTypes = {
    onChange: PropTypes.valueEvent,
    state: {
      fileList: [],
    },
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  };
  static defaultProps = {
    type: "Uploads"
  };

  constructor(props, ...rest) {
    super(props, ...rest);
    let state = this.state || (this.state = {});
    state.value = props.value;
  }

  //在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      if(newProps.value==""){
        this.setState({value: ""});
      }else{
        this.setState({value: newProps.value});
        this.setState({fileList: this.state.fileList});
      }
    }
  }

  componentDidMount() {
    this.setState({fileList: this.fileList});
  }

  fileList = [{
    uid: -1,
    name: this.props.value,
    status: 'done',
    url: dingding + this.props.value,
    thumbUrl: dingding + this.props.value,
  }]
  //路由
  onMethod = () => {
    let search = window.location.search
    let ss = search.replace("?", "");
    var strs = new Object(); //定义一数组
    strs = ss.split("&");
    let method
    for (var i in strs) {
      if (strs[i].slice(0, 6) == "method") {
        method = strs[i].slice(7)
      }
    }
    return method
  }
  //code
  onCode = () => {
    let search = window.location.search
    let ss = search.replace("?", "");
    var strs = new Object(); //定义一数组
    strs = ss.split("&");
    let obj=new Object()
    for (var i in strs) {
      if (strs[i].slice(0, 4) == "code") {
        obj.code=strs[i].slice(5)
      }
    }
    return obj
  }
//上传
  onChangeFile = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.props.onChange([dingding+fileList[0].response]);
    this.setState({fileList});
  }
  //请求
  onAction = () => {
    let aa = dingding + "upload/uploadTempFile"
    return aa
  }
  //参数
  onData = () => {
    let code = sessionStorage.getItem("code")
    let user = new Object()
    user.code_key = code
    return user
  }
  //删除
  onRemove = (file) => {
    let that = this;
    if (that.onMethod() == "select") {
      return false
    } else {
      const fileList = []
      let value = ""
      that.setState({fileList:fileList, value:value});
      that.props.onChange(value);
      return true
    }
  }
  props2 = {
    name: 'file',
    action: this.onAction(),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'authorization': 'authorization-text'
    },
    data: this.onData(),
    showUploadList: true,
    multiple: false,
    onChange: this.onChangeFile,
    onRemove: this.onRemove,
  }
  onImg=()=>{
    let file
   if(this.state.fileList==undefined){
     file=null
   }else{
     if(this.state.fileList.length!=0){
       if(this.state.fileList[0].name!=""){
         file=this.state.fileList
       }else{
         file=null
       }
     }
   }
    return file
  }
  onSelect=()=>{
    let se
    if(this.onMethod()=="select"){
      if(this.state.fileList!=undefined) {
        if (this.state.fileList.length != 0) {
          if (this.state.fileList[0].name == "") {
            se = <p></p>
          }
        }
      }
    }else{
      se= <Button>
        <Icon type="upload" /> 上传
      </Button>
    }
    return se
  }
  render() {
    let { value, onChange} = this.props;
    let that = this;
    return <div>
      <Upload {...that.props2} fileList={that.onImg()}>
        {that.onSelect()}
      </Upload>
    </div>
  }
}
export default Uploads;
