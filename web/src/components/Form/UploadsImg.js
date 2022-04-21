import React from 'react';
import {render} from 'react-dom';
import {Upload,Button,Icon,message } from 'antd'
import {request, config} from 'utils'
const {api} = config
const {dingding} = api
import {Link} from 'dva/router'
import PropTypes from './propTypes'

class UploadsImg extends React.Component {

  static propTypes = {
    value      : PropTypes.value,
    onChange: PropTypes.valueEvent,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
    state: {
      fileList: [],
      fileUrlList:[],
    }
  };
  static defaultProps = {
    type: "UploadsImg"
  };
  constructor(props,...rest) {
    super(props,...rest);
    if(props.value){
      this.state={
        value:props.value,
      }
    }else{
      this.state={value:''}
    }
    console.log("----upload constructor----",props.value);
  }


  componentWillReceiveProps(newProps) {

  }
  componentDidMount(){
    let { value} = this.props;
    let result=[];
    if(value){
      let fileNameList=JSON.parse(value);
      for(let i=0;i<fileNameList.length;i++){
        result.push({
          uid: -1,
          name: fileNameList[i],
          status: 'done',
          url: fileNameList[i],
          thumbUrl:fileNameList[i]+'?x-oss-process=image/resize,m_fill,h_30,w_30',
        });
      }
      this.setState({fileList:result,fileUrlList:fileNameList});
    }

  }

  fileList = [{
    uid: -1,
    name: "",
    status: 'done',
    url: "",
    thumbUrl:"",
  }]
//上传
  onChangeFile = (info) => {
    let fileList = info.fileList;
    let fileNameList=[];
    for(let i=0;i<fileList.length;i++){
      fileNameList.push(dingding+fileList[i].response);
    }
    this.props.onChange(fileNameList);
    this.setState({fileList,fileUrlList:fileNameList});
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

  beforeUpload=(file)=>{
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (isJPG||isPNG) {
      return isJPG || isPNG
    }else {
      message.error('只支持JPG或者PNG文件!');
    }
    return isPNG;
  }
  //删除
  onRemove = (file) => {

  }
  props2 = {
    name: 'file',
    action: this.onAction(),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'authorization': 'authorization-text'
    },
    data: this.onData(),
    listType: 'picture',
    showUploadList: true,
    multiple: false,
    beforeUpload:this.beforeUpload,
    onChange: this.onChangeFile,
    onRemove: this.onRemove,
  }
  onSelect=()=> {
    let se = <Button>
      <Icon type="upload"/> 上传图片
    </Button>

    return se;
  }
  render() {
    let that = this;
    return <div>
      <Upload {...that.props2} fileList={that.state.fileList}>
        {that.onSelect()}
      </Upload>
    </div>
  }
}
export default UploadsImg;
