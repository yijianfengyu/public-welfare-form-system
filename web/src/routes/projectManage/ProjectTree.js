import React , { Component, } from 'react'
import {connect} from 'dva'
import {Form, Input, Row, Col,Badge,Checkbox,Radio,Switch} from 'antd'
import {request, config} from 'utils'
import styles from "../../utils/commonStyle.less"

import Tree2 from "./Tree2"
import Tree1 from "./Tree1"

const {api} = config
const FormItem = Form.Item
const Search = Input.Search

const user = sessionStorage.getItem("UserStrom")
const isBoss=JSON.parse(user).roleType=="admin"
const userName = JSON.parse(user).userName
const userId = JSON.parse(user).id

class ProjectTree1 extends Component {
  constructor(props) {
    super(props);
    this.state={
      show:false,
      refresh:false,
      treeDom:null,
      project:null,
      downId:null,
      data:{}
    };
    this.initTree = this.initTree.bind(this)
  }

  //初始化
  componentWillMount(){
    this.initTree();
  }

  changeVal =(e) => {
    this.props.treeSearchKey.groupId = e.target.value;
    this.setState({refresh:!this.state.refresh});
  }


  //开关
  onChangeSwitch =(e)=> {
    if(e){
      this.props.treeSearchKey.executor = userId;
    }else{
      this.props.treeSearchKey.executor = '';
    }
    this.searchKey();
  }

  //复选框事件
  onChange =(e)=> {
    if(e.target.checked){
      this.props.treeSearchKey.status = '';
    }else{
      this.props.treeSearchKey.status = 'Cancel';
    }
    this.searchKey();
  }

  handleSizeChange = (e) => {
    this.props.setTreeMode(e.target.value);
  }

  //查询
  searchKey =()=> {
    let fd=new FormData();
    fd.append('groupId',this.props.treeSearchKey.groupId);
    fd.append('status',this.props.treeSearchKey.status);
    fd.append('executor',this.props.treeSearchKey.executor);
    //fd.append('companyCode',JSON.parse(sessionStorage.getItem("UserStrom")).companyCode);

    let that = this;
    fetch(api.urls+'/pm/queryProject/tree',
      {
        method:'post',
        body:fd,
        credentials: 'include'
      }
    ).then(function(response) {
        return response.json();
      }).then(function(json) {
      that.props.setTreeData(json);
      that.props.treeDom.changeData(json);
      that.props.treeDom.autoZoom();

      if(that.props.treeMode == 'L'){
        document.getElementById('optionDiv').style.display = 'none';
        document.getElementById('optionDiv').style.opacity = 0;
      }
    });
  }

  //创建树
  initTree(){
    let fd=new FormData();
    fd.append('groupId',this.props.treeSearchKey.groupId);
    fd.append('status',this.props.treeSearchKey.status);
    fd.append('executor',this.props.treeSearchKey.executor);
    //fd.append('companyCode',JSON.parse(sessionStorage.getItem("UserStrom")).companyCode);

    let that = this;
    fetch(api.urls+'/pm/queryProject/tree',
      {
        method:'post',
        body:fd,
        credentials: 'include'
      }
    ).then(function(response) {
        return response.json();
      }).then(function(json) {
        that.props.setTreeData(json);
        var tree = that.props.setTreeDom(new G6.Tree({id: 'initDiv'}));
        tree.source(that.props.treeData);
        tree.render();
        that.setState({show:true});
    })
  }
  render() {
    return (
      <div>
        <div id="initDiv" style={{display: 'none'}}/>
        <div className={styles.filterDiv}>
          <Row>
            <Col span={2}>
              <FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
              <Badge status="error" text="逾期"/>
              </FormItem>
            </Col>
            <Col span={2}>
              <FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
              <Badge status="success" text="完成"/>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
              <Badge status="processing" text="进行中"/>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="过滤其他" labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
                <Switch checkedChildren="开" unCheckedChildren="关" checked={this.props.treeSearchKey.executor==''?false:true} onChange={this.onChangeSwitch}/>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="所有状态" labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
                <Checkbox size='default'checked={this.props.treeSearchKey.status==''?true:false} onChange={this.onChange}></Checkbox>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
                <Search
                  size="default"
                  placeholder="项目编号"
                  onChange={this.changeVal} value={this.props.treeSearchKey.groupId}
                  onSearch={this.searchKey}
                />
              </FormItem>
            </Col>

            <Col span={4} style={{textAlign: 'right'}}>
              {/*<FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>*/}
              {/*<span>滚动鼠标缩放</span>*/}
              {/*</FormItem>*/}
              <FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
              <Radio.Group size="default"  value={this.props.treeMode} onChange={this.handleSizeChange}>
                <Radio.Button value="L">L</Radio.Button>
                <Radio.Button value="R">R</Radio.Button>
              </Radio.Group>
              </FormItem>
            </Col>
          </Row>
        </div>
        {this.props.treeMode=='L'&& this.state.show && <Tree1{...this.props}/>}
        {this.props.treeMode=='R'&& this.state.show && <Tree2{...this.props} obj={this}/>}
      </div>
    )
  }
}

export default connect(({login,app,user}) => ({login, app, user}))(Form.create()(ProjectTree1))
