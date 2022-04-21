import React from 'react'
import { Table,Tooltip,Icon,Popconfirm,Spin} from 'antd';
import styles from './List.less'
import { config} from 'utils'
import styles2 from '../../utils/commonStyle.less'
import { DropOption } from '../../components'

const List = ({
   dispatch,region
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
      title: '父ID',
      dataIndex: 'pid',
      key: 'pid',
      width: "40px",
    },
    {
      title: '地名简称',
      dataIndex: 'sname',
      key: 'sname',
      width: "80px",
    },
    {
      title: '区域等级',
      dataIndex: 'level',
      key: 'level',
      width: "35px",
    },
    {
      title: '区域编码',
      dataIndex: 'citycode',
      key: 'citycode',
      width: "35px",
    },
    {
      title: '邮政编码',
      dataIndex: 'yzcode',
      key: 'yzcode',
      width: "35px",
    },
    {
      title: '组合名称',
      dataIndex: 'mername',
      key: 'mername',
      width: "80px",
    },
    {
      title: '经度',
      dataIndex: 'lng',
      key: 'lng',
      width: "40px",
    },
    {
      title: '纬度',
      dataIndex: 'lat',
      key: 'lat',
      width: "40px",
    },
    {
      title: '拼音',
      dataIndex: 'pinyin',
      key: 'pinyin',
      width: "40px",
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: "40px",
    },
    {
      title: '操作',
      key: 'operation',
      width: "150px",
      render: (text, record, index) => {
        let DropOptionProps = {
          editIcon: false,
          addItemIcon:true,
          onClick:()=>{
            dispatch({
              type: 'region/querySuccess',
              payload: {
                regionRecord:record,
                updateIndex:index,
                updateModalVisible:true,
                updateType:'update',
              }
            })
          },
          addItemClick:()=>{
            dispatch({
              type: 'region/querySuccess',
              payload: {
                regionRecord:{pid:record.id},
                updateIndex:index,
                updateModalVisible:true,
                updateType:'insert',

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
    let pagination=region.pagination;
    pagination.pageSize = page.pageSize;
    pagination.currentPage = page.current;
    dispatch({
      type: "region/searchList", payload: {
        searchValues:region.searchValues,
        ...region.searchValues,
        ...pagination,
      }
    });
    dispatch({
      type: "region/querySuccess", payload: {
        searchLoading: true,
      }
    })
  }
  return (
    <div className={styles.table}>
      <Table
        onChange={onChange}
        pagination={region.pagination}
        bordered
        dataSource={region.searchList}
        columns={columns}
        className="regionList"
        simple
        rowKey={record => record.id}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default List
