import React from 'react'
import { Form, Button, Row, Col, DatePicker, Input, Select, Tooltip, Icon, Popconfirm, Table } from 'antd'
import styles from './ExamQuestion.less'
import { Link } from 'dva/router'
const Option=Select.Option;
const ExamQuestion = ({
  dispatch,
  forms,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    },
  }) => {
  console.log("--filter--");
  let widths = {x: 900};
  const handleSubmit = () => {
    let fields = getFieldsValue();
    console.log("---search---",fields);
    forms.paginationQuestion.currentPage=1;
    dispatch({
      type: 'forms/searchListQuestion',
      payload: {
        searchValuesQuestion:fields,
        ...fields,
        ...forms.paginationQuestion,
      }
    })
  };

  const handleReset = () => {
    resetFields();
    handleSubmit()
  };

  let labelOptions=forms.labelListQuestion.map((item,index)=>{
    return <Option key={index} value={item.key}>{item.key}</Option>;
  });
  labelOptions.unshift(<Option key={9999} value=''></Option>);
  const columns = [
    {
      title: '题目名称',
      dataIndex: 'title',
      key: 'title',
      width: '80px',
    },
    {
      title: '分类',
      dataIndex: 'label',
      key: 'label',
      width: '70px'
    },
    {
      title: '问题描述',
      dataIndex: 'question',
      key: 'question',
      width: '180px'
    },
    {
      title: '操作',
      width: '100px',
      render: (text, record, index) => {
        function add() {
          let question=JSON.parse(record.question);
          dispatch({
            type: "forms/addQuestion",
            payload: {
              question:question,
            }
          });
        }
        return <div>
          <Tooltip placement="top" title="添加">
            <Popconfirm placement="left" title="确认添加?" onConfirm={add} okText="确定"
                        cancelText="取消">
              <Link style={{marginRight: "5px"}} >
                <Icon type="toihk-add" />
              </Link>
            </Popconfirm>
          </Tooltip>
        </div>
      }
    }
  ];
  function onChange(page) {
    console.log(page);
    let pagination=forms.paginationQuestion;
    pagination.pageSize = page.pageSize;
    pagination.currentPage = page.current;
    dispatch({
      type: "forms/searchListQuestion",
      payload: {
        searchValuesQuestion:forms.searchValuesQuestion,
        ...forms.searchValuesQuestion,
        ...pagination,
      }
    });
  }

  return (
    <div>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col span={6}>
          {getFieldDecorator('title', {
            initialValue: ""
          })(
            <Input placeholder="题目名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={6}>
          {getFieldDecorator('label', {
            initialValue: ""
          })(
            <Select placeholder="分类" className="margin-right margin-bottom" style={{width: '100%'}} size='default'>
              {labelOptions}
            </Select>
          )}
        </Col>
        <Col span={6}></Col>
      </Row>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col>
          <Button type="primary" className="margin-right margin-bottom" size="default"
                  onClick={handleSubmit}>搜索</Button>
          <Button size="default" className="margin-right margin-bottom" onClick={handleReset}>重置</Button>
        </Col>
      </Row>
      <div className={styles.table}>
        <Table
          onChange={onChange}
          pagination={forms.paginationQuestion}
          bordered
          dataSource={forms.searchListQuestion}
          columns={columns}
          className="examQuestionList"
          simple
          rowKey={record => record.uuid}
          size="small"
          scroll={widths}
        />
      </div>
    </div>
  )
}


export default Form.create()(ExamQuestion)
