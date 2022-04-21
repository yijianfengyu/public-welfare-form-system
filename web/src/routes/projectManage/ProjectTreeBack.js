import React , { Component, } from 'react'
import {connect} from 'dva'
import {Form, Input, Row, Col, Button, message,Icon,Badge,Checkbox,Radio} from 'antd'
import {request, config} from 'utils'
import styles from "../../utils/commonStyle.less"

import Tree2 from "./Tree2"

import G6 from '@antv/g6';
const {api} = config
const FormItem = Form.Item
const Search = Input.Search

const user = sessionStorage.getItem("UserStrom")
const isBoss=JSON.parse(user).roleType=="admin"
const userName = JSON.parse(user).userName      //判断是否具有Boss权限

class ProjectTree extends Component {
  constructor(props) {
    super(props);
    this.state={
      refresh:false,
      treeDom:null,
      project:null,
      downId:null,
      data:{},
      groupId:this.props.treeSearchKey.groupId,
      status:this.props.treeSearchKey.status
    };
    this.initTree = this.initTree.bind(this)
    this.changeVal = this.changeVal.bind(this)
    this.searchKey = this.searchKey.bind(this)
    this.addProject = this.addProject.bind(this)
    this.addResource = this.addResource.bind(this)
    this.copyProject = this.copyProject.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onIsCollapsed  = this.onIsCollapsed.bind(this)
    this.onDown = this.onDown.bind(this)
    this.lookLog = this.lookLog.bind(this)
    this.toolsIsAuthority = this.toolsIsAuthority.bind(this)
  }

  //初始化
  componentWillMount(){
    this.initTree();
  }

  changeVal(e){
    this.props.treeSearchKey.groupId = e.target.value;
    this.setState({groupId:e.target.value});
  }

  //查询
  searchKey(){
    let that = this;
    fetch(api.urls+'/pm/queryProject/tree?groupId='+that.props.treeSearchKey.groupId+'&status='+that.props.treeSearchKey.status)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
      that.props.treeDom.changeData(json);
      that.props.treeDom.autoZoom();
      document.getElementById('optionDiv').style.display = 'none';
      document.getElementById('optionDiv').style.opacity = 0;
    });
  }

  //复选框事件
  onChange(e){
    if(e.target.checked){
      this.props.treeSearchKey.status = '';
      this.setState({status:''});
    }else{
      this.props.treeSearchKey.status = 'Cancel';
      this.setState({status:'Cancel'});
    }
    this.searchKey();
  }

  //工具-展开/折叠
  onIsCollapsed(){
    if(this.state.project.isCollapsed){
        this.state.project.isCollapsed = false;
        this.props.treeDom.update(this.state.project.id,this.state.project);
    }else{
        this.state.project.isCollapsed = true;
        this.props.treeDom.update(this.state.project.id,this.state.project);
    }
    document.getElementById('optionDiv').style.display = 'none';
    document.getElementById('optionDiv').style.opacity = 0;
    this.props.treeDom.refresh();
  }

  //下钻展开
  onDown(){
    if(this.state.downId == this.state.project.id){
      this.state.downId = this.state.project.parent.id;
      this.props.treeDom.changeData(this.state.project.parent);
    }else{
      this.state.downId = this.state.project.id;
      this.state.project.isCollapsed = false;
      this.props.treeDom.changeData(this.state.project);
    }

    this.props.treeDom.autoZoom();
    document.getElementById('optionDiv').style.display = 'none';
    document.getElementById('optionDiv').style.opacity = 0;
  }

  //工具-查看日志
  lookLog(){
    this.props.listRowClick(this.state.project);
    this.props.treeSelectTabKey("2");
  }

  //工具-添加子项目
  addProject(){
    if(this.toolsIsAuthority(this.state.project)){
      this.props.setIsAuthority(true);
      this.props.listRowClick(this.state.project);
      this.props.treeCreateProject();
    }else{
      message.warning("无权限操作！")
    }
  }

  //工具-添加资源
  addResource(){
    this.props.listRowClick(this.state.project);
    this.props.treeOnUpload();
  }

  //工具-复制项目
  copyProject(){
    if(this.toolsIsAuthority(this.state.project)){
      this.props.setIsAuthority(true);
      this.props.listRowClick(this.state.project);
      this.props.treeCopyProject(this.state.project);
    }else{
      message.warning("无权限操作！")
    }
  }

  //检查是否有权限，负责人或boss
  toolsIsAuthority(model){
    if(isBoss || userName == model.executor){
      return true;
    }else{
      if(model.id !='0'){
        return this.toolsIsAuthority(model.parent)
      }else{
        return false;
      }
    }
  }

  //创建树
  initTree(){
    const {treeSearchKey,listRowClick} = this.props
    let that = this;
    fetch(api.urls+'/pm/queryProject/tree?groupId='+that.props.treeSearchKey.groupId+'&status='+that.props.treeSearchKey.status+'&companyCode='+JSON.parse(sessionStorage.getItem("UserStrom")).companyCode)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
      that.state.data = json;

      var data = that.state.data;

      var Util = G6.Util;

      // 准备布局配置
      var layoutCfg = {
        "direction": "LR",
        "nodeSep": 20,
        "nodeSize": 30,
        "rankSep": 200
      };
      // 自定义树节点
      var DEFAULT_NODE_SIZE = 15;
      G6.registNode('treeNode', {
        draw(cfg, group) {
          var model = cfg.model;
          var r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
          var shapeCfg = {
            attrs: {
              x: cfg.x,
              y: cfg.y,
              r: r,
              stroke: '#003380',
              fill: 'white',
              fillOpacity: 1,
              model:model,
            },
            class : 'ButtonPointer'
          };

          if (model.children && model.children.length) {

            shapeCfg.class = model.isCollapsed ? 'spreadoutButton' : 'collapseButton';
            shapeCfg.attrs.fill = '#FFFFFF';
            shapeCfg.attrs.stroke = '#003380';
            shapeCfg.attrs.fillOpacity = 1;
            // shapeCfg.attrs.model = model;
          }
          if (model.root) {
            shapeCfg.attrs.fill = '#FFFFFF';
            shapeCfg.attrs.stroke = '#003380';
            shapeCfg.attrs.fillOpacity = 1;
            // shapeCfg.attrs.model = model;
          }

          var domain = 100;
          var keep = Number(model.projectProgress);
          var keepRatio = keep/domain;
          if(keep){
            shapeCfg.attrs.fill = 'l (0) 0:#108ee9 ' + keepRatio + ':#108ee9 ' + keepRatio + ':#FFFFFF';
            shapeCfg.attrs.fillOpacity = 1;
          }

          if( model.isOverdue=='YES'){
            shapeCfg.attrs.fillOpacity = 1;
            shapeCfg.attrs.fill = '#f04134'
          }else{
            if(model.projectProgress=="100"){
              shapeCfg.attrs.fillOpacity = 1;
              shapeCfg.attrs.fill = '#00a854'
            }
          }

          shapeCfg.attrStash = Util.mix({}, shapeCfg.attrs);
          return group.addShape('circle', shapeCfg);
        },
        afterDraw(cfg, group) {
          var model = cfg.model;
          var r = layoutCfg.nodeSize ? layoutCfg.nodeSize / 2 : DEFAULT_NODE_SIZE;
          var align = model.align;
          var labelAttrs = {
            text: model.name,
            fill: '#666',
            textBaseline: 'middle',
            fontSize: 30,
            x: cfg.x + r + DEFAULT_NODE_SIZE,
            y: cfg.y,
            textAlign: 'left',
            model:model
          };
          if (align === 'R') {
            Util.mix(labelAttrs, {

              x: cfg.x+r+DEFAULT_NODE_SIZE,
              // x: cfg.x - r - DEFAULT_NODE_SIZE,
              y: cfg.y - r + DEFAULT_NODE_SIZE,
              // textAlign: 'right',
              textBaseline: '',
            });
          } else if (align === 'T' || align === 'CH') {
            Util.mix(labelAttrs, {
              x: cfg.x,
              y: cfg.y + r + DEFAULT_NODE_SIZE,
              textAlign: 'right',
              rotate: -Math.PI / 2,
            });
          } else if (align === 'B') {
            Util.mix(labelAttrs, {
              x: cfg.x,
              y: cfg.y - r - DEFAULT_NODE_SIZE,
              textAlign: 'left',
              rotate: -Math.PI / 2,
            });
          }
          var label = group.addShape('text', {
            attrs: labelAttrs,
            class: 'ButtonPointer'
          });
          return label;
        }
      });

      // 生成树图实例
     // var tree = new G6.Tree({
     //    id: 'mountNode',                            // 容器ID
     //    height: 440,                         // 画布高
     //    fitView: 'autoZoom',                 // 自动缩放
     //    layoutFn: G6.Layout.LayeredTidyTree, // 布局类型
     //    layoutCfg: layoutCfg,                // 布局配置
     //    showButton: true,
     //  });

      that.props.setTreeDom(new G6.Tree({
        id: 'mountNode',                            // 容器ID
        height: 440,                         // 画布高
        fitView: 'autoZoom',                 // 自动缩放
        layoutFn: G6.Layout.LayeredTidyTree, // 布局类型
        layoutCfg: layoutCfg,                // 布局配置
        showButton: true,
      }));

      var tree = that.props.treeDom;

      tree.tooltip(true);

      // 加载数据
      tree.source(data);
      tree.node().shape('treeNode');
      tree.edge().shape('smooth').style({stroke: '#A9BCD3'});
      tree.node().tooltip(function(obj){
          var tip =  [['开始时间', obj.startDate],['结束时间', obj.expectedEndTime],['负责人',obj.executor],['进度',obj.projectProgress+"%"]];
          // if(obj.projectProgress=="100"){
          //   tip.push(['是否逾期',obj.isOverdue]);
          // }
          return tip;
        })

      // 渲染树图
      tree.render();

      //功能选项div浮层
      var divObj = document.getElementById('optionDiv');

      //节点样式检索判断
      function hasClass(shape, className) {
        if (shape) {
          var clasees = shape.get('class');
          if (clasees && clasees.indexOf(className) !== -1) {
            return true;
          }
        }
        return false;
      }

      //显示工具浮框
      function showTools(node) {
        if(!node){
          return;
        }
        var group = node.get('group');
        var label = group.findBy(function(child){
          if(hasClass(child, 'ButtonPointer') || hasClass(child, 'Button')){
            return true;
          }
          return false;
        });
        var rootGroup = tree.get('rootGroup');
        var bbox = Util.getBBox(label, rootGroup);
        divObj.style.left = bbox.minX + 'px';
        divObj.style.top = bbox.minY+bbox.height + 95 + 'px';
        divObj.style.display = 'block';
        divObj.style.opacity = 0;
        fadeIn(divObj,500);
      }

      //渐显
      var opacityt;
      function fadeIn(ele,speed){
        opacityt = null;
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

      //判断负责人权限
      function isAuthority(model){
        if(isBoss || userName == model.executor){
          that.props.setIsAuthority(true);
          return;
        }else{
          if(model.id !='0'){
            isAuthority(model.parent)
          }else{
            that.props.setIsAuthority(false);
            return;
          }
        }
      }

      //鼠标进入元素事件
      tree.on('mouseenter', function(ev){
        var shape = ev.shape;
        if(shape!=undefined && shape.attr().model!=undefined ){
          if(shape.attr().model.id !='0'){
            shape.attr('fillOpacity', 0.6);
            shape.attr('strokeOpacity', 0.8);
            // if(that.state.project ==null || that.state.project.id != shape.attr().model.id){
            //   that.state.project = shape.attr().model;
              that.setState({project:shape.attr().model});
              showTools(ev.item);
            // }
          }
          tree.refresh();
        }
      });
      //鼠标离开元素事件
      tree.on('mouseleave', function(ev){
        var shape = ev.shape;
        if(shape!=undefined && shape.attr().model!=undefined) {
          if (shape.attr().model.id != '0') {
            clearInterval(opacityt);
            divObj.style.display = 'block';
            divObj.style.opacity = 1;
            shape.attr('fillOpacity', 1);
            shape.attr('strokeOpacity',1 );
            tree.refresh();
          }
        }

      });
      //单击事件
      tree.on('click', function(ev){
        var shape = ev.shape;
        if(shape!=undefined && shape.attr().model!=undefined && shape.hasClass('ButtonPointer')){
          if(shape.attr().model.id !='0'){
            isAuthority(shape.attr().model);
            listRowClick(shape.attr().model);
            shape.attr('fillOpacity', 1);
            shape.attr('strokeOpacity',1 );
          }
          // tree.addBehaviour(['clickActive']);
        }
        if(shape!=undefined && (shape.hasClass('spreadout') || shape.hasClass('collapse'))){
          tree.autoZoom();
        }
        divObj.style.display = 'none';
        divObj.style.opacity = 0;
      });
      // 鼠标滚轮事件
      tree.on('mousewheel', function(ev){
        divObj.style.display = 'none';
        divObj.style.opacity = 0;
      });
      // 鼠标左键按下事件
      tree.on('mousedown', function(ev){
        divObj.style.display = 'none';
        divObj.style.opacity = 0;
      });
      that.setState({refresh:!that.state.refresh});
    })
  }
  render() {
    const {treeSearchKey} = this.props
    return (
      <div>
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
            <Col span={6}>
              <FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
                <Search
                  placeholder="项目编号"
                  onChange={this.changeVal} value={treeSearchKey.groupId}
                  onSearch={this.searchKey}
                />
              </FormItem>
            </Col>
          <Col span={6}>
            <FormItem label="所有状态" labelCol={{span: "12"}} style={{marginBottom:'0px'}}>
              <Checkbox size='default'checked={this.props.treeSearchKey.status==''?true:false} onChange={this.onChange}></Checkbox>
            </FormItem>
          </Col>
            <Col span={5} style={{textAlign: 'right'}}>
              {/*<FormItem labelCol={{span: "12"}} style={{marginBottom:'0px'}}>*/}
              {/*<span>滚动鼠标缩放</span>*/}
              {/*</FormItem>*/}
              <Radio.Group value={'L'} >
                <Radio.Button value="L">L</Radio.Button>
                <Radio.Button value="R">R</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <div id="optionDiv" style={{position: 'absolute',zIndex:10,display: 'none',opacity:0,backgroundColor:'#f7f7f7',border:'solid 1px #f7f7f7',boxShadow: '2px 2px 4px #888888'}}>
          <Row>
            {/*<Col span={4}>*/}
              <Icon title="展开/折叠" style={{ fontSize: 18,cursor:'pointer', padding:'5px'}} type="arrows-alt" onClick={this.onIsCollapsed}/>
            {/*</Col>*/}
            {/*<Col span={4}>*/}
            <Icon title={this.state.project!=null&&this.state.project.id==this.state.downId?'上钻':'下钻'} style={{ fontSize: 18,cursor:'pointer', padding:'5px'}} type={this.state.project!=null&&this.state.project.id==this.state.downId?'up':'down'} onClick={this.onDown}/>
            {/*</Col>*/}
            {/*<Col span={4}>*/}
              <Icon title="添加子项目" style={{ fontSize: 18,cursor:'pointer', padding:'5px'}} type="file-add" onClick={this.addProject}/>
            {/*</Col>*/}
            {/*<Col span={4}>*/}
              <Icon title="添加资源" style={{ fontSize: 18,cursor:'pointer', padding:'5px'}} type="file-pdf" onClick={this.addResource}/>
            {/*</Col>*/}
            {/*<Col span={4}>*/}
              <Icon title="复制项目" style={{ fontSize: 18,cursor:'pointer', padding:'5px'}} type="copy" onClick={this.copyProject}/>
            {/*</Col>*/}
            {/*<Col span={4}>*/}
              <Icon title="查看时间线" style={{ fontSize: 18,cursor:'pointer', padding:'5px'}} type="calendar" onClick={this.lookLog}/>
            {/*</Col>*/}
          </Row>
        </div>
        {/*<div id="mountNode" style={{height:"465px"}}>*/}
        {/*</div>*/}
        <Tree2 {...this.props}/>
      </div>
    )
  }
}

export default connect(({login,app,user}) => ({login, app, user}))(Form.create()(ProjectTree))
