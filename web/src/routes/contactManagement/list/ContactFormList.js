import React from 'react'
import {Table, Tooltip, Icon, Popconfirm} from 'antd';
import styles from './List.less'
import {DropOption} from 'components'
import {changeTableColorByClick} from '../../../utils/common'
const ContactFormList = ({
  dispatch,contactFormList,contactFormRowKey,userProjExpandedRowKey,showHeaderVisit,...tableProps
  }) => {
  let contactFormColumns = [
    {
      title: '表单名称',
      dataIndex: 'formTitle',
      key: 'formTitle',
      width: '150px',
    }, {
      title: '反馈数',
      dataIndex: 'dataCounts',
      key: 'dataCounts',
      width: '150px',
    },
  ];
  /* render: (text, record, index) => {
   return <Table
   {...tableProps}
   columns={text}
   rowKey={record => record.id}
   bordered={true}
   pagination={false}
   showHeader={showHeaderVisit}
   size="small"
   />
   }
   * */
  /* function onRowClick() {
   dispatch({
   type: 'contactManagement/querySuccess',
   payload: {
   showHeaderVisit: true,
   },
   });
   }*/
  function focusProjDaily(record, index) {

    return <Table
      dataSource={record.list}
      columns={record.tableColumns}
      //rowKey={record => record.list.id}
      bordered={true}
      pagination={false}
      showHeader={true}
      scroll={{x:record.tableColumns.length*150}}
      size="small"
    />
  }

  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        bordered={false}
        columns={contactFormColumns}
        simple
        rowKey={record => record.id}
        size="small"
        scroll={{x:300}}
        expandedRowRender={focusProjDaily}
      />
    </div>
  )
}

export default ContactFormList
