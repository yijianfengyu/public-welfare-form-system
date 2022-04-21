import React from 'react'
import {Table, Tooltip, message, Icon} from 'antd'
import {changeTableColorByClick} from '../../utils/common'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import styles2 from '../../utils/commonStyle.less'
import {Link} from 'dva/router'
const ProjectList = ({location, ...tableProps,dispatch,listRowClick,treeUpdate}) => {
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: "230px",
      render: (text,record) => {
        let treeSearchKey = {}
        treeSearchKey.groupId = record.groupId
        treeSearchKey.status = 'Cancel'
        treeSearchKey.executor=''
        return <div className={styles2.textEllipsis}>
          <Icon type="search" title="点击切换项目树查看此项目" style={{marginRight:"5px"}} onClick={function(){
            dispatch({type:"projectManage/querySuccess",payload:{
            treeSearchKey,
            projectKey:"2"
            }})
          }}/>
         <Link style={{color:'#565656',}} className={styles2.fd}>
           <Tooltip placement="top" onClick={function(){
            dispatch({type:"projectManage/querySuccess",payload:{
            treeSearchKey,
            projectKey:"2"
            }})
          }} title={text}>{text}</Tooltip></Link>
        </div>
      }
    },
    {
      title: '项目编号',
      dataIndex: 'groupId',
      key: 'groupId',
      width: "150px",
      render: (text, record) => {
        return <div className={styles2.textEllipsis}>
          <Tooltip placement="top" title={text}>
            <CopyToClipboard text={record.groupId} style={{float: "left"}} >
              <Icon type="copy" onClick={() => message.success("项目编号复制成功！")} title="copy"/>
            </CopyToClipboard>{text}</Tooltip></div>
      }
    },
/*    {
      title: '项目进度',
      dataIndex: 'projectProgress',
      key: 'projectProgress',
      width: "80px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text+"%"}</span></Tooltip>
      }
    },*/
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: "80px",
      render: (text,record) => {
        let span
        if(text=="Active"){
          text="正常"
        }else if(text=="Completed"){
          text="已完成"
        }else if(text=="Cancel"){
          text="取消"
        }
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '负责人',
      dataIndex: 'executorName',
      key: 'executorName',
      width: "90px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        scroll={{x:630,y:300}}
        size="small"
        onRowClick={listRowClick}
        className="projectList"
      />
    </div>
  )
}

export default ProjectList
