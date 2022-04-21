import React from 'react'
import {Table, Tooltip, } from 'antd'
import styles2 from '../../utils/commonStyle.less'

const DailyList = ({location, ...tableProps,listRowClick}) => {

  const columns = [
    {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      width:"100px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width:"400px",
      render: (text,record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
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
        scroll={{x:true}}
        size="small"
        onRowClick={listRowClick}
        className="dailyList"
      />
    </div>
  )
}

export default DailyList
