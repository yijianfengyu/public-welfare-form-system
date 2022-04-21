import React from 'react'
import { Table} from 'antd';
import styles from './List.less'
import DropOption from '../../components/DropOption'

const List = ({
   dispatch,account
  }) => {
  let widths = {x: 900};
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: "40px",
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: "70px",
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: "40px",
    },
    {
      title: '微信头像',
      dataIndex: 'phototUrl',
      key: 'phototUrl',
      width: "80px",
    },    {
      title: '小程序openID',
      dataIndex: 'openId',
      key: 'openId',
      width: "60px",
    }, {
      title: '公众号openID',
      dataIndex: 'wxgzhOpenId',
      key: 'wxgzhOpenId',
      width: "60px",
    },
    {
      title: '用户编码',
      dataIndex: 'code',
      key: 'code',
      width: "35px",
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      key: 'state',
      width: "40px",
      render:(text, record, index)=>{
        return text==1?'激活':'失效';
      }
    },
    {
      title: '注册时间',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: "40px",
    },
    {
      title: '团队名称',
      dataIndex: 'teamName',
      key: 'teamName',
      width: "40px",
    },    {
      title: '团队状态',
      dataIndex: 'teamState',
      key: 'teamState',
      width: "40px",
    },    {
      title: '团队入队密码',
      dataIndex: 'teamPassword',
      key: 'teamPassword',
      width: "40px",
    },    {
      title: '团队编号',
      dataIndex: 'teamNo',
      key: 'teamNo',
      width: "40px",
    }, {
      title: '操作',
      key: 'operation',
      width: "150px",
      render: (text, record, index) => {
        let DropOptionProps = {
          editIcon: false,
          addItemIcon:true,
          onClick:()=>{
            dispatch({
              type: 'account/querySuccess',
              payload: {
                userId:record.id,
                bindModalVisible:true,
              }
            })
          },
        }
        return <div>
          {<DropOption {...DropOptionProps}  />}
        </div>
      },
    },
  ];

  function onChange(page) {
    console.log(page);
    let pagination=account.pagination;
    pagination.pageSize = page.pageSize;
    pagination.currentPage = page.current;
    dispatch({
      type: "account/searchList", payload: {
        searchValues:account.searchValues,
        ...account.searchValues,
        ...pagination,
      }
    });
    dispatch({
      type: "account/querySuccess", payload: {
        searchLoading: true,
      }
    })
  }
  return (
    <div className={styles.table}>
      <Table
        onChange={onChange}
        pagination={account.pagination}
        bordered
        dataSource={account.searchList}
        columns={columns}
        className="accountList"
        simple
        rowKey={record => record.id}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default List
