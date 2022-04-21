import React from 'react'
import {Card,Table,Icon,Button,Popconfirm,Input} from 'antd';
import {Link} from 'dva/router'
import {download} from '../../utils/config'
const Search = Input.Search;

const LatestDocumentCard = ({
  dispatch,
  vfilter,
  userDocumentProjectList,
  userDocumentProjRowKey,
  })=> {


  //表格内容
  let documentProjectColumns = [
    {
      title: '资源名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text, record) => {
        if (text != null && text != "") {
          return <div>
            <p style={{marginBottom:'5px'}}>
              <a target="_blank" href={download+"/"+record.url}>
                <span>{text}</span>
              </a>
            </p>
            <p style={{textAlign:'right',fontColor:'#dfdfdf',paddingRight:'1em'}}>
              <span>--{record.createName}.{record.createDate}&nbsp;</span>
            </p>
          </div>
        } else if ((text == null || text !== "") && (record.templateName != null && record.templateName != "")) {
          return <div>
            <p style={{marginBottom:'5px'}}>
              <a target="_blank" href={download+"/"+record.templateUrl}>
                <span>{record.templateName}</span>
              </a>
            </p>
            <p style={{textAlign:'right',fontColor:'#dfdfdf',paddingRight:'1em'}}>
              <span>--{record.createName}.{record.createDate}&nbsp;</span>
            </p>
          </div>
        }
      }
    },
  ];

  //加载更多文档
  function moreDocumentProject() {
    dispatch({
      type: 'dashboard/queryDocumentResourceMore',
      payload:{
        resourcesName:vfilter===""?undefined:vfilter,
      }
    });
  }

  return (
    <Card title={<div style={{paddingLeft:'2px'}}><h5>最新文档</h5><span>
          <Search
            placeholder="请输入文档名称"
            style={{ width: 200 }}
            onSearch={value =>{
                  dispatch({
                    type: 'dashboard/queryHomeProjectResources',
                    payload: {
                      resourcesName:value,
                    },
                  })
                 dispatch({
                  type: 'dashboard/querySuccess',
                  payload: {
                    vfilter:value,
                  }
                })
            }}
          />
    </span></div>}
          style={{ overflowY: 'hidden',overflowX: 'hidden',borderRadius: '3px'}}>
      <Table pagination={false} showHeader={false}
             rowKey={record => record.id}
             expandedRowKeys={[userDocumentProjRowKey]}
             columns={documentProjectColumns}
             dataSource={userDocumentProjectList}
      />
      <br/>
      <div style={{textAlign:'center'}}><Link onClick={moreDocumentProject}>加载更多文档...</Link></div>
    </Card>
  )
}

export default LatestDocumentCard
