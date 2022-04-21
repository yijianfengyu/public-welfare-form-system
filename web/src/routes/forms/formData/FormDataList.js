import React from 'react';
import {Table, Tooltip, Icon, Popconfirm, Form, Popover, Button, Input, Row, Tabs, Col} from 'antd';
import styles from './../../forms/List.less';
import classnames from 'classnames';
import {DropOption} from 'components';
import {connect} from 'dva'
import {Link} from 'dva/router'
import {changeTableColorByClick, getQueryVariable} from '../../../utils/common'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const FormDataList = ({
                     subDataDefine,formDetailSelectRow, location, dispatch, vFilterData, pagination, columns, tableDefine, popoverVisible, ...tableProps,
                     form: {
                       getFieldDecorator,
                       validateFieldsAndScroll,
                       resetFields,
                     },
                   }) => {
  let formLinksTabs = [];
  //console.log("--selectAll--",columns);
  if (columns.length != 0) {
    const l = columns.length
    var isFixd = columns.length <= 7 ? false : "right"
    //添加remark列
    for (let i in columns) {
      columns[i].rowKey='rk_'+i;//
      if (columns[i].dataIndex == "remark" && columns[i].type == "TextArea") {
        columns[i].render = (text, record, index) => {
          //显示的文字
          if (text == null || text == undefined || text == "") {
            text = "点击添加";
          } else {
            text = text;
          }

          //修改备注的方法
          function onClick() {
            validateFieldsAndScroll((errors, values) => {
              if (errors) {
                return
              }
              record.remark = values.remark
              dispatch({
                type: 'forms/updateTempDataRemark',
                payload: {
                  method: "update",
                  id: record.id,
                  remark: values.remark,
                  define_id: record.define_id,
                  updateIndex: index,
                  value: record,
                }
              });
              onClose();
            })
          };

          //关闭修改备注框
          function onClose() {
            popoverVisible["visible" + index] = false;
            dispatch({
              type: 'forms/querySuccess',
              payload: {
                popoverVisible: popoverVisible
              }
            });
            resetFields();
          };

          //打开修改备注框
          function onRemark() {
            popoverVisible["visible" + index] = true;
            dispatch({
              type: 'forms/querySuccess',
              payload: {
                popoverVisible: popoverVisible
              }
            });
          };

          //回车事件
          function onPressEnter(e) {

            if (e.key === "Enter") {
              onClick()
            }
          }

          function handleVisibleChange(visible) {
            if (visible) {
              onRemark();
            } else {
              onClose();
            }
          }

          return (
            <Popover key={'pv_'+index} trigger="click" onVisibleChange={handleVisibleChange}
                     visible={popoverVisible["visible" + index] != undefined ? popoverVisible["visible" + index] : false}
                     content={
                       <Row type="flex" justify="space-around">
                         <Col span={14}>
                           {getFieldDecorator("remark", {
                             initialValue: record.remark
                           })(
                             <Input placeholder="备注" size='default' onPressEnter={onPressEnter} autoFocus="autofocus"/>
                           )}
                         </Col>
                         <Col span={8} style={{textAlign: 'center', lineHeight: '28px'}}>
                           <Link onClick={onClick} style={{border: 'none', marginRight: "15px"}}>
                             <Button type="primary" size='small'><Icon type="check"/></Button>
                           </Link>
                           <Link onClick={onClose} style={{border: 'none'}}>
                             <Button size='small'><Icon type="close"/></Button>
                           </Link>
                         </Col>
                       </Row>
                     }>
              <Link onClick={onRemark}>{text}</Link>
            </Popover>
          );
        }
      } else if (columns[i].type === "Content") {
        //去掉小标题列
        delete columns[i];
      }
      if (columns[i].type == "FormLink") {
        formLinksTabs.push(columns[i]);
      }

    }

    //如果没有分组条件就要添加数据操作按钮
    if (tableDefine.groupBy.length == 0 && tableDefine.countBy.length == 0) {
      const operation = {
        title: "操作",
        width: 150,
        dataIndex: 'Operation',
        key: 'Operation',
        fixed: isFixd,
        render: (text, record, index) => {
          function onClick() {
            record.updateIndex = index,
              dispatch({
                type: 'forms/queryTempDataByIdsupdate',
                payload: {
                  id: record.id,
                  define_id: record.define_id,
                  reacdData: record,
                }
              })
          }

          function deleteClick() {
            dispatch({
              type: 'forms/deleteTempDatas',
              payload: {
                id: record.id,
                define_id: record.define_id,
                projectId: location.state != null ? location.state.projectId : undefined,
                deleteIndex: index,
              }
            })
          }

          return <div key={'h_'+record.id}>
            <Tooltip placement="top" title="修改此条数据">
              <Link onClick={onClick} disabled={record.dataCounts > "0" ? true : false} style={{marginRight: "5px"}}>
                <Icon type="toihk-edit"></Icon></Link>
            </Tooltip>
            <Tooltip placement="top" title="删除数据">
              <Popconfirm placement="left" title="你确定删除这个?" onConfirm={deleteClick} okText="确定"
                          cancelText="取消">
                <Link style={{marginRight: "5px"}}>
                  <Icon type="toihk-delete"/>
                </Link>
              </Popconfirm>
            </Tooltip>
          </div>
        }
      }
      if (columns[columns.length - 1].dataIndex != "Operation") {
        columns.push(operation);
      }
    }

  }

  function onRowClick(record, index) {
    changeTableColorByClick("fromTableDataLists", index);
    console.log("---------------click-------");
    if(formLinksTabs.length>0) {
      let defaultLink = formLinksTabs[0].defaultLink;
      let defineId = getQueryVariable(defaultLink, "id");
      let parentDefineId = record.define_id;
      let parentId = record.id;
      dispatch({
        type: 'forms/querySubData',
        payload: {
          define_id: defineId,
          parentDefineId: parentDefineId,
          parentId: parentId,
          formDetailSelectRow: record,
        }
      })
    }
  }

  function onChange(activeKey) {
    if(formDetailSelectRow){
      let defaultLink = formLinksTabs[activeKey].defaultLink;
      let defineId = getQueryVariable(defaultLink, "id");
      let parentDefineId = formDetailSelectRow.define_id;
      let parentId = formDetailSelectRow.id;
      dispatch({
        type: 'forms/querySubData',
        payload: {
          define_id:defineId,
          parentDefineId:parentDefineId,
          parentId:parentId,
          formDetailSelectRow: formDetailSelectRow,
        }
      })
    }
  }

  function addSubItem() {
    console.log("----------addSubItem----------");
    console.log(subDataDefine);
    console.log(formDetailSelectRow);
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        createTableDefine:subDataDefine,
        creatFormDataVisible:true,
        rowDataId:formDetailSelectRow.id,
      }
    })
  }

  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        pagination={pagination}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        size="small"
        scroll={{x: (columns.length - 1) * 150}}
        className="fromTableDataLists"
        onRowClick={onRowClick}
      />
      {formLinksTabs.length > 0 ? <Tabs
        onChange={onChange}
        type="card"
      >
        {formLinksTabs.map((pane, index) => <TabPane tab={pane.title} key={'tp_'+index}></TabPane>)}
      </Tabs> : null}
      <Table columns={tableProps.subDataColumn} pagination={false} dataSource={tableProps.subDataSource} scroll={{y: 250}}/>
     {/* <div><Button size="default" onClick={addSubItem}>新增数据</Button> </div>*/}
    </div>
  )
}

export default Form.create()(FormDataList)
