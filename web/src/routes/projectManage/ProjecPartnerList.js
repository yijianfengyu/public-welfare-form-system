import React from 'react'
import { Table, message, Icon, Tooltip, Modal } from 'antd'
import styles2 from '../../utils/commonStyle.less'
import { DropOption } from 'components'
import { request, config } from 'utils'

const { api } = config

const ProjectPartnerList = ({ location, dispatch,...tableProps }) => {
  const columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: "30px"
    }, {
    title: '资助的团队',
    dataIndex: 'team_name',
    key: 'team_name',
    width: "100px"
    },{
    title: '合作方分类',
    dataIndex: 'type',
    key: 'type',
    width: "80px"
    },{
    title: '资方名称',
    dataIndex: 'name',
    key: 'name',
    width: "100px"
    },{
      title: '资助费用',
      dataIndex: 'partner_cost',
      key: 'partner_cost',
      width: "30px"
    },{
    title: '联系人姓名',
    dataIndex: 'concat_name',
    key: 'concat_name',
    width: "40px"
    },{
    title: '联系人电话',
    dataIndex: 'concat_phone',
    key: 'concat_phone',
    width: "60px"
    },
    {
      title: '操作',
      key: 'operation',
      width: "150px",
      render: (text, record, index) => {
        let DropOptionProps = {
          editIcon:true,
          deleteIcon: true,
          deleteClick(){
            dispatch({
              type: "projectManage/deleteProjectPartner",
              payload: {
                relateId:record.id,
                projectDelIndex:index,//关系表的id
              }
            })
          },
          addItemIcon:true,
          addItemTitle:'添加或修改资助费用',
          addItemClick(){
            dispatch({
              type: "projectManage/querySuccess",
              payload: {
                addProjectPartnerCostModelShow: true,
                projectPartner:record,
              }
            })
          },
        }
        return (<div className={styles2.textEllipsis}>
          <DropOption {...DropOptionProps}  />
        </div>);
      }
    }
  ]
  return (
    <div>
      <Table
        pagination={false}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        size="small"
        dataSource={tableProps.addedPartnerList}
      />
    </div>
  )
}

export default ProjectPartnerList
