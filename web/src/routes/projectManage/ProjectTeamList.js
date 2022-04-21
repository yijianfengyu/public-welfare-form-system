import React from 'react'
import { changeTableColorByClick } from '../../utils/common'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Table, message, Icon, Tooltip, Modal, Row, Col, Input } from 'antd'
import styles2 from '../../utils/commonStyle.less'
import { DropOption } from 'components'
import { request, config } from 'utils'
import { Link } from 'dva/router'
import Header from '../../components/Form/Header'

const { api } = config


const ProjectTeamList = ({ location,proTeamAddPartnerSelect, dispatch,...tableProps }) => {
  let data = [{
    id: '1',
    team_no: 'II09',
    institution_name: '长沙理工大学',
    name: '长沙理工清大环保',
  }]

  const columns = [
    {
      title: '团队ID',
      dataIndex: 'id',
      key: 'id',
      width: '30px',
    }, {
      title: '团队编号',
      dataIndex: 'team_no',
      key: 'team_no',
      width: '60px',
    }, {
      title: '机构名称',
      dataIndex: 'institution_name',
      key: 'institution_name',
      width: '100px',
    }, {
      title: '团队名称',
      dataIndex: 'name',
      key: 'name',
      width: '100px',
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
              type: "projectManage/deleteProjectTeam",
              payload: {
                teamId:record.id,
                projectId:tableProps.projectRecord.id,
                projectDelIndex: index,
              }
            })
          },
          addItemIcon:true,
          addItemTitle:'添加资方',
          addItemClick(){
            dispatch({
              type: "projectManage/querySuccess",
              payload: {
                addProjectPartnerModelShow: true,
                teamId:record.id,
                projectPartnerListSelect:[]
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
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if(selected){
        //加入
        proTeamAddPartnerSelect.push(record.id);
      }else{
        //删除
        for(let i=0;i<proTeamAddPartnerSelect.length;i++){
          if(proTeamAddPartnerSelect[i]==record.id){
            proTeamAddPartnerSelect.splice(i, 1);
          }
        }
      }
      dispatch({
        type: 'projectManage/querySuccess', payload: {
          proTeamAddPartnerSelect
        },
      })
    },
    hideDefaultSelections:true,
  }
  return (
      <div>
        <Table
          rowSelection={rowSelection}
          pagination={false}
          bordered
          columns={columns}
          simple
          rowKey={record => record.id}
          scroll={{ x: 700 }}
          size="small"
          dataSource={tableProps.addedTeamList}
        />
      </div>
  )
}

export default ProjectTeamList
