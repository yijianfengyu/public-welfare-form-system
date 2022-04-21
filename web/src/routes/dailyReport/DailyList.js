import React from 'react'
import {Form,Table,Tooltip,message,Icon} from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import styles2 from '../../utils/commonStyle.less'

const DailyList = ({location, ...tableProps, }) => {
  const columns = [
    {
      title: '项目编号',
      dataIndex: 'groupId',
      key: 'groupId',
      width:"150px",
      render: (text,record) => {
        return <div className={styles2.textEllipsis}><span >
            <CopyToClipboard text={text} style={{float: "left"}}>
              <Icon type="copy" onClick={() => message.success("项目编号复制成功！")} title="copy"/>
            </CopyToClipboard>{text}</span></div>
      }
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width:"300px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text.replace(/,/g," > ")}</span></Tooltip>
      }
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width:"600px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      width:"80px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width:"150px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        scroll={{x:1280}}
        size="small"
        className="dailyList"
      />
    </div>
  )
}


export default Form.create()(DailyList)
