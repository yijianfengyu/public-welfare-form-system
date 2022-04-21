import React from 'react'
import { Table, message, Icon, Tooltip, Modal } from 'antd'
import { request, config } from 'utils'
const { api } = config
const ProjectLocalOrganizationList = ({ location, dispatch,...tableProps }) => {
  const columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: "100px"
    }, {
    title: '系统编号',
    dataIndex: 'system_no',
    key: 'system_no',
    width: "100px"
    },{
    title: '在地组织名称',
    dataIndex: 'name',
    key: 'name',
    width: "100px"
    },{
    title: '组织所在地',
    dataIndex: 'location',
    key: 'location',
    width: "100px",
      render:(text, record, index)=>{
        let item=text?JSON.parse(text):'';
        return <span>{item.province} {item.city} {item.county} {item.town?item.town:''} {item.village?tem.village:''} {item.others}</span>;
      }
    },{
    title: '联系人姓名',
    dataIndex: 'concat_name',
    key: 'concat_name',
    width: "100px"
    },{
    title: '联系人电话',
    dataIndex: 'concat_phone',
    key: 'concat_phone',
    width: "100px"
    },{
    title: '联系人邮箱',
    dataIndex: 'concat_email',
    key: 'concat_email',
    width: "100px"
    },
  ]

  return (
    <div>
      <Table
        pagination={false}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        scroll={{ x: 700 }}
        size="small"
        dataSource={tableProps.addedLocalOrganizationList}
      />
    </div>
  )
}

export default ProjectLocalOrganizationList
