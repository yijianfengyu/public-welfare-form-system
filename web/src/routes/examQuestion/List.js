import React from 'react'
import { Table,Tooltip,Icon,Popconfirm,Spin} from 'antd';
import styles from './List.less'
import {Link} from 'dva/router'
import { config} from 'utils'
const {api} = config
const List = ({
   dispatch,examQuestion
  }) => {
  let widths = {x: 900};
  console.log("--list--");
  const columns = [
    {
      title: '题目名称',
      dataIndex: 'title',
      key: 'title',
      width: '300px',
    },
    {
      title: '分类',
      dataIndex: 'label',
      key: 'label',
      width: '100px'
    },
    {
      title: '问题描述',
      dataIndex: 'question',
      key: 'question',
      width: '500px'
    },
    {
      title: '创建时间 ',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '100px',
      render: (text, record) => {
        if (record.dateCreated) {
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
        function onEdit() {
          console.log("-----onEdit----",record);
          let question=JSON.parse(record.question);
          const ii = []
          if (question.type == "FormRadioGroup"
            || question.type == "CheckboxGroup"
            || question.type == "Select"
            || question.type == "RadioAttach") {
            let options = question.options
            for (let i = 0; i <= options.length; i++) {
              let list = new Object()
              list["k"] = i
              list["option"] = options[i]
              if (list.option) {
                ii.push(list)
              }
            }
          }

          dispatch({
            type: 'examQuestion/querySuccess',
            payload: {
              column:question,
              defaultColumnType:question.type,
              updateModalVisit:true,
              updateIndex:index,
              inputOptions: ii,
              columnLabel:record.label,
              updateType:'update',
            }
          })
        }
        function deleteItem() {
          dispatch({
            type: 'examQuestion/deleteExamQuestion',
            payload: {

            }
          })
        }

        return <div>
          <Tooltip placement="top" title="修改">
            <Link onClick={onEdit} style={{marginRight: "5px"}}>
              <Icon type="toihk-edit"></Icon></Link>
          </Tooltip>
          <Tooltip placement="top" title="删除">
            <Popconfirm placement="left" title="确认删除?" onConfirm={deleteItem} okText="确定"
                        cancelText="取消">
              <Link style={{marginRight: "5px"}} >
                <Icon type="toihk-delete" />
              </Link>
            </Popconfirm>
          </Tooltip>

        </div>
      }
    }
  ]

  function onChange(page) {
    console.log("------",examQuestion.searchValues);
    let pagination=examQuestion.pagination;
    pagination.pageSize = page.pageSize;
    pagination.currentPage = page.current;
    dispatch({
      type: "examQuestion/searchList", payload: {
        searchValues:examQuestion.searchValues,
        ...examQuestion.searchValues,
        ...pagination,
      }
    });
    dispatch({
      type: "examQuestion/querySuccess", payload: {
        searchLoading: true,
      }
    })
  }
  return (
    <div className={styles.table}>
      <Table
        onChange={onChange}
        pagination={examQuestion.pagination}
        bordered
        dataSource={examQuestion.searchList}
        columns={columns}
        className="examQuestionList"
        simple
        rowKey={record => record.uuid}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default List
