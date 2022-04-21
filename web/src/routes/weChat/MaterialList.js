import React from 'react'
import {Table, Tooltip, message, Icon,Popconfirm} from 'antd'
import {Link} from 'dva/router'
import moment from 'moment';
import {DropOption} from 'components'
import _ from 'lodash';

import styles2 from '../../utils/commonStyle.less'
const MaterialList = ({location, ...tableProps,dispatch,setEditorState,listRowClick,sendMaterial}) => {

  const props = {
    materialItem(record) {
      return record.content.news_item.map((item,index) =>
        <div key={item.thumb_media_id} style={{lineHeight:'20px'}}><a href={item.url} target="_blank" >{item.title}</a>
          <a style={{float:'right',marginRight:'100px'}} onClick={
            function () {
              let newMaterialRecord = _.cloneDeep(record);
              let newMaterialRecordItem =newMaterialRecord.content.news_item[index];

              newMaterialRecord.index = index;
              newMaterialRecord.content.news_item=[newMaterialRecordItem];

              setEditorState(newMaterialRecordItem.content.replace(/data-src/g,"src"));
              dispatch({type: "weChat/querySuccess",payload:{
                materialRecord:newMaterialRecord,
                materialRecordItem:newMaterialRecordItem,
                addMaterialModalVisible:true,
                materialSaveType:"update"
              }})
            }
          }>编辑</a>
        </div>)
    },
  }
  const columns = [
    {
      title: '标题',
      dataIndex: 'content',
      key: 'content',
      width: "300px",
      render: (text,record) => {
        let title = "";
        text.news_item.map(tiem => {
          if(title==""){
            title = tiem.title
          }else{
            title+="..."
          }
        })
        return <Tooltip placement="top" title={title}><span className={styles2.textEllipsis}>{title}</span></Tooltip>
      }
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: "80px",
      render: (text,record) => {
        let date = moment(text*1000).format('YYYY-MM-DD HH:mm:ss')
        return <Tooltip placement="top" title={date}><span className={styles2.textEllipsis}>{date}</span></Tooltip>
      }
    },
    {
      title: '操作',
      width: '50px',
      render: (text, record) => {

        //修改事件
        function onClick() {
          let newMaterialRecord = _.cloneDeep(record);
          let newMaterialRecordItem =newMaterialRecord.content.news_item.length>0?newMaterialRecord.content.news_item[0]:{};
          setEditorState(newMaterialRecord.content.news_item.length>0?newMaterialRecord.content.news_item[0].content.replace(/data-src/g,"src"):null);
          dispatch({type: "weChat/querySuccess",payload:{
            materialRecord:newMaterialRecord,
            materialRecordItem:newMaterialRecordItem,
            addMaterialModalVisible:true,
            materialSaveType:"update"
          }})
        }

        return (
          <div >

          {/*<Tooltip placement="top" title="编辑">*/}
            {/*<Link onClick={onClick}  style={{border: 'none', marginRight: "5px"}}>*/}
              {/*<Icon type="toihk-edit"></Icon>*/}
            {/*</Link>*/}
          {/*</Tooltip>*/}

          <Tooltip placement="top" title="删除">
            <Popconfirm placement="left" title="确认删除吗？" onConfirm={tableProps.deleteMaterial} okText="确定"cancelText="取消">
              <Link style={{border: 'none', marginRight: "5px"}}>
                <Icon type="toihk-delete"></Icon>
              </Link>
            </Popconfirm>
          </Tooltip>
          <Tooltip placement="top" title="群发">
            <Popconfirm placement="left" title="消息开始群发后无法撤销，是否确认群发？" onConfirm={tableProps.sendMaterial} okText="确定"cancelText="取消">
              <Link style={{border: 'none', marginRight: "5px"}}>
                <Icon type="team" theme="outlined" />
              </Link>
            </Popconfirm>
          </Tooltip>
          </div>)
      }
    }
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.media_id}
        scroll={{x:630}}
        size="small"
        expandedRowRender={record => props.materialItem(record)}
        onRowClick={listRowClick}
      />
    </div>
  )
}

export default MaterialList
