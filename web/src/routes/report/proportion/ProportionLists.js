import React from 'react'
import {Table, Tooltip, Icon, Popconfirm, Spin} from 'antd';
import styles from '../List.less'
import {changeTableColorByClick} from '../../../utils/common'
import {Link} from 'dva/router'
import {config} from 'utils'

const {api} = config
const {urls} = api
const ProportionLists = ({
                      dispatch, ...tableProps, report
                   }) => {
  let widths = {x: 900};


  const columns = [
    {
      title: '题目标题',
      dataIndex: 'title',
      key: 'title',
      width: '100px',
    },{
      title: '满分比例',
      dataIndex: 'fullMark',
      key: 'fullMark',
      width: '100px',
      sorter: (a, b) => a.fullMark - b.fullMark,
      render: (text, record) => {
        return text+"%";
      }
    }, {
      title: '扣分比例',
      dataIndex: 'deduct',
      key: 'deduct',
      width: '100px',
      sorter: (a, b) => a.deduct - b.deduct,
      render: (text, record) => {
        return text+"%";
      }
    },{
      title: '零分比例 ',
      dataIndex: 'zero',
      key: 'zero',
      width: '100px',
      sorter: (a, b) => a.zero - b.zero,
      render: (text, record) => {
        return text+"%";
      }
    },
  ];




function onRowClick(record, index) {
    changeTableColorByClick("fromLists", index)
  }

  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        pagination={false}
        bordered
        columns={columns}
        className="fromLists"
        simple
        rowKey={record => record.title}
        onRowClick={onRowClick}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default ProportionLists
