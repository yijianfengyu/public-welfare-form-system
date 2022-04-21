import React from 'react'
import {Card,Tooltip,Icon,Popconfirm,Input,Row,Col,Button,Form,Menu, Dropdown,message } from 'antd'
import {Link} from 'dva/router'
import styles2 from '../../utils/commonStyle.less'

const FormItem = Form.Item;
const {TextArea} = Input;

const DailyCard = ({
  createName,
  updateDate,
  dispatch,
  logContants,
  card,
  dailyList,
  userName,
  projectRecord,
  name,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  const formItemLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
  };
  function handleMenuClick(e) {
    if(e.key=='1'){
      var str=this.content.replace(/<.p?>/ig,"");
      var contact=str.replace(/<.*?>/ig, "\n");
      let field = [];
      field.content="aaa"
      let aa=
        <Row style={{marginTop:"20px"}}>
          <Col span={24}>
            <FormItem label="内容"
              {...formItemLayout}
            >
              {getFieldDecorator('content', {
                rules: [{required: true, message: '请输入内容'}],
              })(
                <TextArea autosize={{minRows: 4, maxRows: 6}} defaultValue={contact} size="default" style={{width: "340px"}}/>
              )}
            </FormItem>
          </Col>
          <Button size="default" className="margin-right" style={{margin:"0px 16px 10px 55px"}}
                  onClick={saveJournal.bind(this)}>保存日志</Button>
          <Button size="default" onClick={onCancel.bind(this)}>取消</Button>
        </Row>
      this.logContants = aa
      //dailyList[payload.index].content=payload.content;
      dailyList.splice(this.index, 1, this);
      dispatch({
        type: 'projectManage/querySuccess',
        payload: {
          dailyList:dailyList,
        }
      })
    }else if(e.key=='2'){

      dispatch({
        type: 'projectManage/deleteProjectDaily',
        payload: {
          id: this.id,
          projectId: this.projectId,
          index: this.index,
        }
      })
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick.bind(card)}>
      <Menu.Item key="1">修改</Menu.Item>
      <Menu.Item key="2">删除</Menu.Item>
    </Menu>
  );


  function onCancel() {
    let aa =this.content
    this.logContants = aa

    dailyList.splice(this.index, 1, this);
    dispatch({
      type: 'projectManage/retryDefaultDailyView',
      payload: {
        index: this.index,
      }
    })
  }

  function saveJournal() {
    validateFields((error, value) => {
      if (error) {
         if(this.content!=""&&this.content!=null&&value.content==undefined){
            dispatch({
              type: 'projectManage/updateProjectDaily',
              payload: {
                content: this.content,
                id: this.id,
                projectId: this.projectId,
                index: this.index,
              }
            })
          }else{
           message.error("日志内容不能为空");
           return
         }
      }else{
        var str = value.content.replace(/\n/g, "<br>");
        var content="<p>"+str+"</p>";
        dispatch({
          type: 'projectManage/updateProjectDaily',
          payload: {
            content: content,
            id: this.id,
            projectId: this.projectId,
            index:this.index,
          }
        })
      }
    })
  }

  let button
  if (card.content !== "<p>该项目暂无日志</p>"&&name===userName&&card.dailyType==="work") {
    button = <div style={{cursor:"pointer"}}>
      <Dropdown overlay={menu} >
        <span>
          操作 <Icon type="down" />
        </span>
      </Dropdown>
    </div>
  }
  return (
    <div style={{overflow:'hidden',border:"1px solid #f4f4f4",margin:"1px",marginBottom:"10px",boxShadow:"1px 1px 1px #8888881c"}}>
      <div >
        <div style={{fontSize:"14px",margin:"10px",color:"black"}}>
          <div><span style={{fontSize:"16px"}}>{createName}</span> <span style={{float:"right"}}>{button}</span></div>
          <div><span style={{color:"#8D8D8D"}}>{updateDate}-{card.processName}</span></div>
        </div>
        {typeof logContants==="string"? <div style={{marginLeft:"10px",padding:"10px",wordBreak:"break-all"}}>
          <div dangerouslySetInnerHTML={{__html:logContants}}/>
        </div>:logContants }

      </div>
    </div>
  )
}
export default Form.create()(DailyCard)
