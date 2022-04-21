import React from 'react'
import {Table, Tooltip, message, Icon} from 'antd'
import moment from 'moment';
import {DropOption} from 'components'

import styles2 from '../../utils/commonStyle.less'
const MaterialOtherList = ({location, ...tableProps,dispatch}) => {

  const props = {
  }
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      width: "300px",
      render: (text,record) => {
        if(record.url){
          return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}><a href={record.url} target="_blank" >{text}</a></span></Tooltip>
        }else{
          return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
        }
      }
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: "80px",
      render: (text,record) => {
        let date = moment(text*1000).format('YYYY-MM-DD HH:mm:ss')
        return <Tooltip placement="top" title={date}><span className={styles2.textEllipsis}>{date}</span></Tooltip>
      }
    },
    {
      title: '操作',
      width: '50px',
      render: (text, record) => {
        let DropOptionProps = {
          deleteIcon: false,
          editIcon:true,
          onClick() {
          },
          deleteClick() {
          }
        }
        return (<DropOption  {...DropOptionProps} />)
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
        rowKey={record => record.media_id}
        scroll={{x:630}}
        size="small"
      />
    </div>
  )
}

export default MaterialOtherList
