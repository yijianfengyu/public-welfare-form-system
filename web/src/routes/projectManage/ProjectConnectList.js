import React from 'react'
import { Table, message, Icon, Tooltip, Modal } from 'antd'
import { request, config } from 'utils'
import styles2 from '../../utils/commonStyle.less'
import { DropOption } from '../../components'
const { api } = config


const ProjectConnectList = ({ location, dispatch,...tableProps }) => {

  const columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: "100px"
    }, {
    title: '机构所在地址',
    dataIndex: 'address',
    key: 'address',
    width: "100px",
      render:(text, record, index)=>{
        let item=text?JSON.parse(text):'';
        return <span>{item.province} {item.city} {item.county} {item.town?item.town:''} {item.village?tem.village:''} {item.others}</span>;
      }
    },{
    title: '解决方案',
    dataIndex: 'solution',
    key: 'solution',
    width: "100px"
    },{
    title: '申请机构',
    dataIndex: 'apply_for',
    key: 'apply_for',
    width: "100px"
    },{
    title: '合作意向',
    dataIndex: 'purpose',
    key: 'purpose',
    width: "100px"
    },{
    title: '联系人',
    dataIndex: 'concat_name',
    key: 'concat_name',
    width: "100px"
    },{
      title: '联系邮箱',
      dataIndex: 'concat_email',
      key: 'concat_email',
      width: "100px"
    },{
    title: '联系电话',
    dataIndex: 'concat_phone',
    key: 'concat_phone',
    width: "100px"
    },
    {
      title: '审核状态',
      dataIndex: 'state',
      key: 'state',
      width: "30px"
    },
    {
      title: '操作',
      key: 'operation',
      width: "150px",
      render: (text, record, index) => {
        if(record.state=='ok'){
          return <span></span>
        }else{
          let DropOptionProps = {
            editIcon:true,
            addItemIcon:true,
            addItemTitle:'添加到资方',
            addItemClick(){
              dispatch({
                type: "projectManage/querySuccess",
                payload: {
                  addProjectConnectModelShow: true,
                  projectTeamListSelect:[],
                  projectConnect:record,
                }
              })
            },
          }
          return (<div className={styles2.textEllipsis}>
            <DropOption {...DropOptionProps}  />
          </div>);
        }

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
        scroll={{ x: 700 }}
        size="small"
        dataSource={tableProps.addedConnectList}
      />
    </div>
  )
}

export default ProjectConnectList
