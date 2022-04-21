import React from 'react'
import { Table,Tooltip,Icon,Popconfirm} from 'antd';
import styles from './List.less'
import {DropOption} from 'components'
import {changeTableColorByClick} from '../../../utils/common'
const AccountList = ({
  dispatch,isCreate,recordIndex,tableList,pagination, ...tableProps
  }) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: '100px'
    },
    {
      title: '邮箱 ',
      dataIndex: 'email',
      key: 'email',
      width: '100px',
    },{
      title: '手机 ',
      dataIndex: 'tel',
      key: 'tel',
      width: '100px',
    },{
      title: '权限 ',
      dataIndex: 'roleName',
      key: 'roleName',
      width: '100px',
      render: (text, record) => {
        if(record.companyCreator=="YES"){
          text="管理员（超级管理员）"
        }
        return text
      }
    },
    {
      title: '操作',
      width: '100px',
      render: (text, record) => {
        let user=JSON.parse(sessionStorage.getItem("UserStrom"))
        let bb
        if(user.userName==record.userName&&user.companyCreator=="YES"){
          bb=true
        }
        let dd
        if(user.companyCreator=="NO"&&record.roleType=='admin'){
          dd=true
        }
        let DropOptionProps = {
          deleteIcon: true,
          deleteDisabled:dd||bb,
          editDisabled:dd||bb,
          onClick() {
            dispatch({
              type:'accountManagement/showCreateModalVisit',
              payload:{
                updateValue:record,
              }
            })
          },
          deleteClick() {
            dispatch({
              type:'accountManagement/deleteAccount',
              payload:{
                //companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
                id:record.id
              }
            })
            dispatch({
              type: 'accountManagement/querySuccess',
              payload: {
                recordIndex: recordIndex,
                tableList,tableList,
              },
            })
          }
        }
        return (<DropOption  {...DropOptionProps} />)
      }
    }
  ]
  function  onRowClick(record, index){
    changeTableColorByClick("AccountList", index)
    dispatch({
      type: 'accountManagement/querySuccess',
      payload: {
        recordIndex: index,
      },
    })
  }
  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        pagination={pagination}
        bordered
        columns={columns}
        className="AccountList"
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
        size="small"
      />
    </div>
  )
}

export default AccountList
