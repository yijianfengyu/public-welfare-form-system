import React from 'react'
import {Table, Tooltip, Icon, Popconfirm, Spin} from 'antd';
import styles from './List.less'
import {changeTableColorByClick} from '../../utils/common'
import {Link} from 'dva/router'
import {config} from 'utils'

const {api} = config
const {urls} = api
const FromLists = ({
                     paginations, dispatch, contactSelectValueUpdate, isAuthorityForm, ...tableProps, report
                   }) => {
  let widths = {x: 900};

  const info = (text) => {
    dispatch({
      type: 'report/querySuccess',
      payload: {
        IntroInfoVisible: true,
        text: text,
      }
    })
  }

  const  edit=(record)=>{
    dispatch({
      type: 'report/querySuccess',
      payload: {
        createModalVisible: true,
        updateValue: record,
      }
    })
  }


  const  download=(record)=>{
    dispatch({
      type: 'report/testDownload',
      payload: {
        projectId:record.project,
        accountId:record.creator,
        groupId: record.teamId,
         id:record.id,
        waterSourceName:record.waterSourceName,
        teamName:record.team_name,
        creatorName:record.creatorName,
        dateCreated:record.dateCreated,
      }
    })
  }

  const columns = [
    {
      title: '水源地名称',
      dataIndex: 'waterSourceName',
      key: 'waterSourceName',
      width: '100px',
    }, {
      title: '调研团队',
      dataIndex: 'team_name',
      key: 'team_name',
      width: '100px'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: '100px'
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: '100px'
    }, {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: '50px'
    },{
      title: '供应人口',
      dataIndex: 'supply_population',
      key: 'supply_population',
      width: '50px'
    },  {
      title: '健康分数',
      dataIndex: 'health_degree',
      key: 'health_degree',
      width: '50px'
    }, {
      title: '实地环境',
      dataIndex: 'sdhj',
      key: 'sdhj',
      width: '50px'
    }, {
      title: '水质信息',
      dataIndex: 'szxx',
      key: 'szxx',
      width: '50px'
    }, {
      title: '水质达标',
      dataIndex: 'szdb',
      key: 'szdb',
      width: '50px'
    }, {
      title: '管理信息',
      dataIndex: 'glxx',
      key: 'glxx',
      width: '50px'
    }, {
      title: '水量满足',
      dataIndex: 'slmz',
      key: 'slmz',
      width: '50px'
    }, {
      title: '建议',
      dataIndex: 'suggest',
      key: 'suggest',
      render: (text, record) => {
        if (text != null && text != "") {
          if (text.length > 42) {
            return <div><span>{text.substring(0, 36)}<span style={{fontSize: '15px'}}>......</span></span><Link
              onClick={() => info(text)}>查看详情</Link></div>
          } else {
            return text
          }
        }
      }
    }, {
      title: '提交时间 ',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '100px',
      render: (text, record) => {
        if (record.dateCreated != null) {
          if (record.dateCreated.length > 19) {
            text = record.dateCreated.substr(0, 19);
          }
        }
        return text
      }
    },
    {
      title: '操作',
      width: '100px',
      render: (text, record, index) => {
        return <div><Link onClick={() => edit(record)}>编辑</Link> | <Link onClick={() => download(record)}>下载</Link></div>
      }
    }
  ]

  function onRowClick(record, index) {
    changeTableColorByClick("fromLists", index)
  }

  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        pagination={paginations}
        bordered
        columns={columns}
        className="fromLists"
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default FromLists
