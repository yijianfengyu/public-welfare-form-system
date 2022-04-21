import React from 'react'
import {Card,Table,Icon,Button,Popconfirm,Row,Col,Tooltip} from 'antd';
import {Link} from 'dva/router'
import {download,sharedLinks} from '../../utils/config';
import { config} from 'utils'
const {api} = config
const {urls} = api

const ButtonGroup = Button.Group;
const MyFocusFrom = ({
  dispatch,
  userFocusFromRowKey,//展开的行，控制属性
  userFocusFromList,//数据数组
  focusFromRecord,
  })=> {

  let focusFromColumns = [
    {
      title: '表单标题',
      dataIndex: 'formTitle',
      key: 'formTitle',
      render: (text, record, index) => {
        function handleClickUnfollow() {
          dispatch({
            type: 'dashboard/deleteFocusFrom',
            payload: {
              projectId: record.id,
              type: "form",
              index: index,
            }
          })
        }
        let links = urls + "/temp/dataShare?id=" + encodeURIComponent( record.id)+"&code="+JSON.parse(sessionStorage.getItem("UserStrom")).companyCode+"&url="+encodeURIComponent(sharedLinks)+"&img="+encodeURIComponent(sessionStorage.getItem("imgOne"));
        return (<div>
            <div key={index}>
              <p style={{marginBottom:'5px'}}>
                <Tooltip placement="top" title="点击填写表单">
                  <Link to={links} target="_blank">{record.formTitle}</Link>
                </Tooltip>
                <span>&nbsp;（反馈数：{record.dataCounts}）</span>
              </p>
              <p style={{textAlign:'right',fontColor:'#dfdfdf',paddingRight:'1em'}}>
                <span>--{record.creatorName}.{record.dateUpdated!=null&&record.dateUpdated.length > 19?record.dateUpdated.substr(0, 19):""}&nbsp;</span>
                <Tooltip placement="top" title="取消关注">
                  <Link onClick={handleClickUnfollow}>
                    <Icon style={{ fontSize: '1.2em', color: '#337ab7',cursor: 'pointer' }} type="heart"/>
                  </Link>
                </Tooltip>
              </p>
            </div>
          </div>
        );
      }
    },
  ]

  //加载更多表单
  function moreFocusFrom() {
    dispatch({
      type: 'dashboard/queryFocusFromMore',
    });
  }

  return (
    <Card
      title={<div style={{paddingLeft:'2px'}}><h3 style={{fontSize:'1.6em'}}>我关注的表单</h3></div>}
      style={{ overflowY: 'hidden',overflowX: 'hidden',borderRadius: '3px'}}>
      <Table pagination={false} showHeader={false}
             rowKey={record => record.id}
             expandedRowKeys={[userFocusFromRowKey]}
             columns={focusFromColumns}
             dataSource={userFocusFromList}
      />
      <br/>
      <div style={{textAlign:'center'}}><Link onClick={moreFocusFrom}>加载更多表单...</Link></div>
    </Card>
  )
}

export default MyFocusFrom
