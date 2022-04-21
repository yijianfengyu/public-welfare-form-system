import React from 'react';
import {Form, Button, Row, Icon, Col, Input, Select, Upload, DatePicker, InputNumber} from 'antd';
import styles from "../../../utils/commonStyle.less";
import {request, config} from 'utils'
import ExcelModal from './Modal/ExcelModal'
import TableUtils from "../../../utils/TableUtils";
import {sharedLinks} from "../../../utils/config";
const {api} = config
const OptGroup = Select.OptGroup;
const Option = Select.Option;
const FormItem = Form.Item;
const FormDataFilter = ({
                  formRecord,
  dispatch,
  filertCol,
  onFilterChange,
  onAdd,
  excelModalVisit,
  fileList,
  location,
  locationId,
  dataObjValue,
  selectValues,
  activateKey,
  tableDefine,
  pagination,
  onFilterEchartsChange,
  echartsVisible,
  columns,
  dataSourceList,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    getFieldValue,
    },
  }) => {
  const FormItem = Form.Item;
  const excelModalProps = {
    dispatch,
    excelModalVisit,
    locationId,
    tableDefine,
    fileList,
    location,
    dataObjValue,
    filertCol,
  }

  const handleSubmit = () => {
    let fields = getFieldsValue();
    onFilterChange(fields);
  }
  const handleAdd=()=>{

    dispatch({
      type: 'forms/querySuccess',
      payload: {
        creatFormDataVisible:true,
        createTableDefine:JSON.stringify(tableDefine),
      }
    })
  }
  const handleReset = () => {
    resetFields();
    tableDefine.groupBy = [];
    tableDefine.orderBy = [];
    let schemaColumns = tableDefine.schema;
    for (var i in schemaColumns) {
      if (schemaColumns[i].value) {
        schemaColumns[i].value = "";
      }
      if (schemaColumns[i].visual && schemaColumns[i].visual != "static") {
        delete schemaColumns[i];//删除所有虚拟列
      }
    }
    dispatch({
      type: 'forms/queryAllTempDataByPage',
      payload: {
        define: JSON.stringify(tableDefine),
        activateKey: "2",
        listLoadingData: false,
        tabDisabled: false,
        pageSize: "10",
        currentPage: "1",
        echartsVisible: false,
      }
    })
  }


  function onExcel() {
    dispatch({
      type: "forms/showExcelModalVisit",
      payload: {
        fileList: []
      }
    })
  }

  function handleEchartsVisible() {
    let fields = getFieldsValue();
    onFilterEchartsChange(fields);
  }

  function onDeselectChange(value) {
    let orderVals = getFieldValue("selectOrderColDatas");
    if (orderVals && orderVals.length != 0 && orderVals.indexOf(value) != -1) {
      orderVals.splice(orderVals.indexOf(value), 1);
    }
    if (tableDefine.countBy) {
      tableDefine.countBy.splice(tableDefine.countBy.indexOf(value), 1);
    }
    //删除虚拟列定义
    delete tableDefine.schema[value];
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        tableDefine: tableDefine,
      }
    })
  }

  function handleChange(value, option) {
    //添加虚拟列定义
    let optionTitle = option.props.children
    let title = optionTitle[1] + optionTitle[2]
    let obj = {
      dataIndex: value,
      key: value,
      title: title,
      type: "FormInt",
      "col_data": value,
      "value": "",
      "visual": true,
      "srcColData": option.props.srcColData,
      "calMethod": option.props.calMethod,
    }
    let schemaColumns = tableDefine.schema;
    tableDefine.countBy.push(value);
    schemaColumns[value] = obj;//表定义里面添加表列定义
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        tableDefine: tableDefine,
      }
    })
  }

  function handleChangeGroup(value, option) {
    //添加分组
    tableDefine.groupBy.push(value);
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        tableDefine: tableDefine,
      }
    })
  }

  function onDeselectChangeGroup(value) {
    //删除分组
    tableDefine.groupBy.splice(tableDefine.groupBy.indexOf(value), 1);//删除分组中的值
    if (tableDefine.groupBy.length == 0) {
      //删除虚拟列以及排序中的虚拟列值
      let orderVals = getFieldValue("selectOrderColDatas");//排序的值
      let schemaColumns = tableDefine.schema;
      for (var i in schemaColumns) {
        if (schemaColumns[i].visual && schemaColumns[i].visual != "static") {
          if (orderVals && orderVals.indexOf(schemaColumns[i].col_data) != -1) {
            orderVals.splice(orderVals.indexOf(schemaColumns[i].col_data), 1);
          }
          delete schemaColumns[i];//删除所有虚拟列
        }
      }
      //tableDefine.orderBy=[];
      tableDefine.groupBy = [];
      //统计和排序下拉值清空
      resetFields(["selectCountColDatas"]);
    }

    dispatch({
      type: 'forms/querySuccess',
      payload: {
        tableDefine: tableDefine,
        echartsVisible: tableDefine.groupBy.length > 0 ? true : false,
      }
    })
  }

  function orderSelectChange(value, option) {
    //添加排序
    tableDefine.orderBy.push(value);
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        tableDefine: tableDefine,
      }
    })
  }

  function orderDeselectChange(value) {
    //删除排序
    tableDefine.orderBy.splice(tableDefine.orderBy.indexOf(value), 1);//删除分组中的值
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        tableDefine: tableDefine,
      }
    })
  }

  let orderSelectOptions = [];//排序下拉框值
  let groupSelectOptions = [];//分组下拉框值
  let countSelectOptions = [];//分组统计下拉框值
  let filterConditions = [];//其他默认搜索条件列
  let schemaColumns = tableDefine.schema;

  for (var i in schemaColumns) {
    let itemCol = schemaColumns[i];
    if (itemCol.type != "Content") {
      if (itemCol.type == "Radio" || itemCol.type == "Checkboxes" || itemCol.type == "Select") {
        filterConditions.push(itemCol)
      } else if (itemCol.type == "DataTimes") {
        filterConditions.push(itemCol)
      } else if (itemCol.type == "FormDate") {
        filterConditions.push(itemCol)
      } else if (itemCol.type == "FormNumber" || itemCol.type == "FormInt") {
        filterConditions.push(itemCol)
      }  else if (itemCol.type == "FormInput" || itemCol.type == "FormText"|| itemCol.type == "FormDaily") {
        filterConditions.push(itemCol)
      } else {
        filterConditions.push(itemCol)
      }
      //分组，计数
      let col_data = itemCol.col_data;
      let title = itemCol.title;
      let type = itemCol.type;
      let visual = itemCol.visual;
      if (!visual || visual == "static") {
        //不是虚拟列需要加入下拉框
        groupSelectOptions.push(<Option key={col_data}>{title}</Option>);
        if (type === "FormNumber" || type === "FormInt") {
          countSelectOptions.push(
            <OptGroup key={'og_'+itemCol.col_data} label={title}>
              <Option srcColData={itemCol.col_data} calMethod={"count"}
                      key={col_data + "_count"}>&nbsp;&nbsp;{title}-计数</Option>
              <Option srcColData={itemCol.col_data} calMethod={"sum"}
                      key={col_data + "_sum"}>&nbsp;&nbsp;{title}-求和</Option>
              <Option srcColData={itemCol.col_data} calMethod={"avg"}
                      key={col_data + "_avg"}>&nbsp;&nbsp;{title}-平均</Option>
              <Option srcColData={itemCol.col_data} calMethod={"max"}
                      key={col_data + "_max"}>&nbsp;&nbsp;{title}-最大</Option>
              <Option srcColData={itemCol.col_data} calMethod={"min"}
                      key={col_data + "_min"}>&nbsp;&nbsp;{title}-最小</Option>
            </OptGroup>
          );
        } else {
          countSelectOptions.push(
            <OptGroup key={'ogp_'+itemCol.col_data} label={title}>
              <Option srcColData={itemCol.col_data} calMethod={"count"}
                      key={col_data + "_count"}>&nbsp;&nbsp;{title}-计数</Option>
            </OptGroup>
          );
        }
      }
      //排序添加列
      if (!visual || visual == "static") {
        orderSelectOptions.push(<Option key={col_data}>{title}</Option>);
      } else {
        //虚拟列放前面
        orderSelectOptions.unshift(<Option key={col_data}>{title}</Option>);
      }

    }
  }

  if (activateKey != 2) {
    resetFields();
  }

  function downDataOnClick() {
    let obj = new Object();
    obj.columns = columns;
    dispatch({
      type: 'forms/downFromDataExcel',
      payload: {
        columns: JSON.stringify(obj),
        define: JSON.stringify(tableDefine),
      }
    })
  }

  //分享数据
  function handleShareVisible(){
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        shareDataModalVisible: true,
      }
    })
  }
  //分享数据
  function handleSetModifyPw(){
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        showSetPwModalVisible: true,
      }
    })
  }

  return (
    <div className={styles.filterDiv} style={{marginBottom: '10px'}} tabIndex="1">
      <Row gutter={24} style={{maxWidth: '1080px'}} className={styles.marginTop}>
        {filterConditions.map((itemCol, index)=> {
          let key = itemCol.col_data;
          if (itemCol.type == "Radio" || itemCol.type == "Checkboxes" || itemCol.type == "Select" || itemCol.type == "RadioAttach") {
            const options = itemCol.options
            return (
              <Col span={6} key={key}>
                <FormItem>
                  {getFieldDecorator(itemCol.col_data, {})(
                    <Select size='default' placeholder={itemCol.title} style={{width: '100%'}}>
                      {options.map(function (item) {
                        let oDiv = document.createElement('div');
                        oDiv.innerHTML = item.option;
                        let text = oDiv.innerText;
                        return <Option key={text}>{text}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            )

          } else if (itemCol.type == "DataTimes" || itemCol.type == "FormDatetime" || itemCol.type == "FormDate") {

            return (
              <Col span={6} key={key}>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator(itemCol.col_data + "_min", {})(
                      <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={itemCol.title+"_开始"} size='default'
                                  style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator(itemCol.col_data + "_max", {})(
                      <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={itemCol.title+"_结束"} size='default'
                                  style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col></Col>);

          } else if (itemCol.type == "FormNumber" || itemCol.type === "FormInt") {

            return (
              <Col span={6} key={key}>
                <Col span={12}>
                  <FormItem>
                    <InputNumber
                      {...getFieldDecorator(itemCol.col_data + "_min", {})}
                      placeholder={itemCol.title + "-最小"} size='default' style={{width: '100%'}}/>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    <InputNumber
                      {...getFieldDecorator(itemCol.col_data + "_max", {})}
                      placeholder={itemCol.title + "-最大"} size='default' style={{width: '100%'}}/>
                  </FormItem>
                </Col>
              </Col>
            );

          } else {
            return (
              <Col span={6} key={key}>
                <FormItem>
                  {getFieldDecorator(itemCol.col_data, {})(
                    <Input placeholder={itemCol.title} size='default' maxLength="30" style={{width: '100%'}}/>
                  )}
                </FormItem>
              </Col>
            )


          }

        })}
      </Row>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col span={6}>
          <FormItem key={'selectGroupColDatas'}>
            {getFieldDecorator('selectGroupColDatas', {})(
              <Select
                mode="multiple"
                size="default"
                className="margin-right margin-bottom"
                style={{width: '100%'}}
                placeholder="选择分组列"
                onSelect={handleChangeGroup}
                onDeselect={onDeselectChangeGroup}
              >
                {groupSelectOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem key={'selectCountColDatas'}>
            {getFieldDecorator('selectCountColDatas', {})(
              <Select

                mode="multiple"
                size="default"
                className="margin-right margin-bottom"
                style={{width: '100%'}}
                onSelect={handleChange}
                onDeselect={onDeselectChange}
                placeholder="要统计的列"
              >
                {countSelectOptions}
              </Select>
            )} </FormItem>
        </Col>
        <Col span={6}>
          <FormItem key={'selectOrderColDatas'}>
            {getFieldDecorator('selectOrderColDatas', {})(
              <Select

                mode="multiple"
                size="default"
                className="margin-right margin-bottom"
                style={{width: '100%'}}
                onSelect={orderSelectChange}
                onDeselect={orderDeselectChange}
                placeholder="排序列"
              >
                {orderSelectOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem key={'selectOrderTypeColDatas'}>
            {getFieldDecorator('selectOrderTypeColDatas', {initialValue: 'desc'})(
              <Select

                size="default"
                className="margin-right margin-bottom"
                style={{width: '100%'}}
                placeholder="排序方法"
              >
                <Option key={'desc'}>从大到小</Option>
                <Option key={'asc'}>从小到大</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
              <Button type="primary" className="margin-right" onClick={handleSubmit}>搜索</Button>
              <Button size="default" onClick={handleAdd}>新增</Button>
              <Button size="default" onClick={handleReset} style={{marginLeft: "15px"}}>重置</Button>
              <Button size="default" onClick={downDataOnClick} style={{marginLeft: "15px"}}>
                下载当前数据
              </Button>
              <Button size="default" onClick={onExcel} style={{marginLeft: "15px"}}>导入数据</Button>
              <Button size="default" onClick={handleEchartsVisible} style={{marginLeft: "15px"}}>生成图表</Button>
              <Button size="default" onClick={handleShareVisible} style={{marginLeft: "15px"}}>分享数据</Button>
              <Button size="default" onClick={handleSetModifyPw} style={{marginLeft: "15px"}}>设置修改密码</Button>
              <Button size="default" type="dashed" style={{marginLeft: "30px"}}>数据总量:{pagination.total}</Button>
            </div>
            {excelModalVisit && <ExcelModal {...excelModalProps}/>}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create()(FormDataFilter)
