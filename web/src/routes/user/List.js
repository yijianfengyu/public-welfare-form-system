import React from 'react'
import {Table} from 'antd'
import {DropOption} from 'components'
import {Link} from 'dva/router'
import {changeTableColorByClick} from '../../utils/common'

const List = ({dispatch, ...tableProps,clickString, onChange, onChanges}) => {

  const columns = [
    {
      title: 'Status',
      dataIndex: 'staffStatus',
      key: 'staffStatus',
    },
    {
      title: 'RealName',
      dataIndex: 'realName',
      key: 'realName',
    }, {
      title: 'UserName',
      dataIndex: 'userName',
      key: 'nickName',

    }, {
      title: 'Cell',
      dataIndex: 'cell',
      key: 'cell',
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',

    }, {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        let DropOptionProps = {
          editIcon: true,
          detailIcon: true,
          detailClick(){
            dispatch({type: "user/showDetailModal",payload:{
              currentItem:record,
              modalType:"update",
              targetKeys:[],
            }})

            dispatch({
              type: "user/querySuccess", payload: {
                currentItem: [],
                dateTime: "",
                targetKeys:[]
              }
            })

            sessionStorage.setItem("currentUser",JSON.stringify(record))
            dispatch({
              type: 'userDetail/query',
              payload: {
                id: record.id,
              },
            })
          }
        }
        return <DropOption {...DropOptionProps} />
      },
    },
  ]

  function onRowClick (record, index) {
    changeTableColorByClick("userList",index)
  }

  return (
    <div>
      <Table
        {...tableProps}
        className="userList"
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        size="small"
        onRowClick={onRowClick}
      />
      <div style={{marginTop: "10px", textAlign: "center"}}>
        <Link onClick={onChange}>{clickString}</Link>
        <span style={{color: "white"}}>------</span>
        <Link onClick={onChanges}>重新加载数据</Link>
      </div>
    </div>
  )
}

export default List
