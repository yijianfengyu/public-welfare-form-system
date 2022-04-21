import React , { Component, } from 'react'
import {connect} from 'dva'
import {Form, Tree, Row, Icon, message,Menu,Dropdown} from 'antd'
import {request, config} from 'utils'
const TreeNode = Tree.TreeNode;
const {api} = config

const user = sessionStorage.getItem("UserStrom")
const isBoss = JSON.parse(user).roleType == "admin"
const userName = JSON.parse(user).userName

class Tree2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [this.props.treeData],
      groupId: '',
      node: null,
      selectedKeys:[],
      dropdownVisible:false
    }
    this.toolsIsAuthority = this.toolsIsAuthority.bind(this)
  };

  onClickDiv = () => {
    var divObj = document.getElementById('optionDiv');
    divObj.style.display = 'none';
    divObj.style.opacity = 0;
    this.setState({dropdownVisible:false});
  }

  onSelect = (selectedKeys, info) => {
    if(selectedKeys.length != 0){
      this.setState({selectedKeys})
    }

    if (info.node.props.dataRef.id != '0') {
      this.props.listRowClick(info.node.props.dataRef);
      var isBool = this.toolsIsAuthority([this.props.treeData], info.node.props.dataRef.id);
      this.props.setIsAuthority(isBool);
    }
    else{
      let dispatch=this.props.dispatch
      dispatch({
        type:'projectManage/querySuccess',
        payload:{
          projectRecord:"",
          projectTitle:"新建项目",
          cards:[],
          resourcesList:[],
        }
      })
      this.props.handleReset()
    }
  }

  //右键
  onRightClick = (e) => {
    if (e.node.props.dataRef.id != '0') {
      this.props.listRowClick(e.node.props.dataRef);
      var isBool = this.toolsIsAuthority([this.props.treeData], e.node.props.dataRef.id);
      this.props.setIsAuthority(isBool);
      this.setState({project:e.node.props.dataRef});
      this.setState({selectedKeys:[e.node.props.eventKey]})
      this.setState({dropdownVisible:true});
      this.showTools(e.event);
    }else{
      let dispatch=this.props.dispatch
      dispatch({
        type:'projectManage/querySuccess',
        payload:{
          projectRecord:"",
          projectTitle:"新建项目",
          cards:[],
          resourcesList:[],
        }
      })
      this.props.handleReset()
    }
  }

  //展开
  onExpand = (expandedKeys, {expanded: bool, node}) => {
    let data = node.props.dataRef;
    data.isCollapsed = false;
    this.props.treeDom.update(data.id, data);
    this.props.treeDom.refresh();
  }

  //显示工具浮框
  showTools =(event)  => {
    var divObj = document.getElementById('optionDiv');
    var tn = document.getElementById('treeNode');

    divObj.style.left = event.pageX - tn.getBoundingClientRect().left + 'px';
    divObj.style.top = event.pageY - tn.getBoundingClientRect().top  + 100 + 'px';
    divObj.style.display = 'block';
    divObj.style.opacity = 0;
    this.fadeIn(divObj,200);
  }

  //渐显
  fadeIn = (ele,speed) => {
    var opacityt = null;
    var opacitynum=ele.style.opacity||0;
    var speed=(speed/100);
    function opacityAdd(){
      if(opacitynum<1){
        ele.style.opacity=opacitynum=(parseFloat(opacitynum)+0.01).toFixed(2);
      }else{
        clearInterval(opacityt);
      }
    }
    opacityt=setInterval(opacityAdd,speed);
  }

  //工具-添加子项目
  addProject =()=> {
    this.setState({dropdownVisible:false});
    if(this.toolsIsAuthority([this.props.treeData],this.state.project.id)){
      this.props.setIsAuthority(true);
      this.props.listRowClick(this.state.project);
      this.props.treeCreateProject();
    }else{
      message.warning("无权限操作！")
    }
  }

  //工具-添加资源
  addResource =()=> {
    this.setState({dropdownVisible:false});
    this.props.listRowClick(this.state.project);
    this.props.treeOnUpload();
  }

  //工具-查看日志
  lookLog =()=> {
    this.setState({dropdownVisible:false});
    this.props.listRowClick(this.state.project);
    this.props.treeSelectTabKey("2");
  }

  toolsIsAuthority(json, id) {
    this.state.node = null;
    if (isBoss) {
      return true;
    } else if (id == '0') {
      return false;
    } else {
      var obj = this.getNode(json, id)
      if (userName == obj.node.executorName) {
        return true;
      } else {
        return this.toolsIsAuthority(json, obj.node.parentId);
      }
    }
  };

  //根据id获取node
  getNode = (json, nodeId) => {
    //1.第一层 root 深度遍历整个JSON
    for (var i = 0; i < json.length; i++) {
      if (this.state.node) {
        break;
      }
      var obj = json[i];
      //没有就下一个
      if (!obj) {
        continue;
      }
      //有节点就开始找，一直递归下去
      if (obj.id == nodeId) {
        //找到了与nodeId匹配的节点，结束递归
        this.state.node = obj;
        break;
      } else {
        //如果有子节点就开始找
        if (obj.children) {
          //递归往下找
          this.getNode(obj.children, nodeId);
        } else {
          //跳出当前递归，返回上层递归
          continue;
        }
      }
    }
    //返回结果obj
    return {
      node: this.state.node
    };
  }

  onDrop = (info) => {
    if(info.node.props.dataRef.id =='0'){
      return;
    }
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); //判断移动到所在节点前还是后，-1=前,1=后

    let that = this;
    let fd=new FormData();
    fd.append('id',info.node.props.dataRef.id);
    fd.append('parentId',info.node.props.dataRef.parentId);
    fd.append('dropPosition',dropPosition);
    fd.append('dragId',info.dragNode.props.dataRef.id);
    fd.append('companyCode',JSON.parse(user).companyCode);
    fetch(api.urls+'/pm/updateProjectSequence',
      {
        method:'post',
        body:fd,
        credentials: 'include'
      }
    ).then(function(response) {
      return response.json();
    }).then(function(json) {
      that.props.obj.searchKey();//重新查询
    })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
        let title = item.name;
        let tooTitle = "开始时间：" + item.startDate + "\r结束时间：" + item.expectedEndTime + "\r负责人：" + item.executorName + "\r进度：" + item.projectProgress + "%";
        var oDate1 = new Date(item.expectedEndTime);//要求完成时
        var oDate2 = new Date(item.actualEndTime);//实际完成时
        if (oDate2.getTime() > oDate1.getTime()) {
          if (item.projectProgress === '100') {
            title = <span title={tooTitle} style={{ color: '#00A854' }}>{item.name}</span>
          } else {
            title = <span title={tooTitle} style={{ color: '#f04134' }}>{item.name}</span>
          }
        } else {
          if (item.projectProgress === '100') {
            title = <span title={tooTitle} style={{ color: '#00a854' }}>{item.name}</span>
          } else if (item.projectProgress > 0 && item.projectProgress < 100) {
            title = <span title={tooTitle} style={{color:'#108EE9'}}>{item.name}</span>
          } else {
            title = <span title={tooTitle}>{item.name}</span>
          }
        }
        if (item.children) {
          return (
            <TreeNode title={title} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        } else {
          return (<TreeNode title={title} key={item.id} dataRef={item}/>);
        }
        return <TreeNode {...item} />;
      }
    );
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a style={{color:"#666",textDecoration:'none'}} rel="noopener noreferrer" onClick={this.addProject}>新建子项目</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a style={{color:"#666",textDecoration:'none'}}  rel="noopener noreferrer" onClick={this.addResource}>创建资源</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a style={{color:"#666",textDecoration:'none'}}  rel="noopener noreferrer" onClick={this.lookLog}>查看时间线</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <div>
        <div id="treeNode" onClick={this.onClickDiv} style={{height:"465px",overflow:'scroll'}}>
          <Tree
            showLine
            // defaultExpandedKeys="0"
            defaultExpandedKeys={this.props.treeSearchKey.groupId!=''&&this.props.treeData.children!=null?this.props.treeData.children[0].id:'0'}
            // defaultExpandAll={this.props.treeSearchKey.groupId!=''?true:false}
            onSelect={this.onSelect}
            onRightClick={this.onRightClick}
            onExpand={this.onExpand}
            selectedKeys={this.state.selectedKeys}
            draggable
            onDrop={this.onDrop}
          >
            {this.renderTreeNodes([this.props.treeData])}
          </Tree>
        </div>
        <div id="optionDiv" style={{position: 'absolute',display: 'none',opacity:0}}>
          <Dropdown overlay={menu} visible={this.state.dropdownVisible} >
            <a className="ant-dropdown-link" href="#" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default connect(({login,app,user}) => ({login, app, user}))(Form.create()(Tree2))
