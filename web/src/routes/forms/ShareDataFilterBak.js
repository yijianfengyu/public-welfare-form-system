import React from 'react';
import {Form, Button, Row, Icon,Col, Input, Select,DatePicker,InputNumber} from 'antd';
import styles from "../../utils/commonStyle.less";
import TablesUtils from '../../utils/TableUtils'
const ShareDataFilter = ({
  dispatch,
  onFilterChange,
  filterColumns,
  tableDefine,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
    },
  }) => {
  const Option = Select.Option;
  const FormItem = Form.Item
  const OptGroup = Select.OptGroup;
  const handleSubmit = () => {
    let fields = getFieldsValue()
    onFilterChange(fields)
  }
  let orderSelectOptions = [];//排序下拉框值
  let groupSelectOptions = [];//分组下拉框值
  let countSelectOptions = [];//分组统计下拉框值
  let filterConditions = [];//其他默认搜索条件列
  let schemaColumns = tableDefine.schema;
  for (var i in schemaColumns) {
    //filterColumns[i].col_data=filterColumns[i].srcColData;
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
            <OptGroup label={title}>
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
            <OptGroup label={title}>
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





  //重置
  const handleReset = () => {
    resetFields();
    let schemaColumns=tableDefine.schema;
    tableDefine.groupBy=[];
    for(var i in schemaColumns){
      if(schemaColumns[i].value){
        schemaColumns[i].value="";
      }
      if(schemaColumns[i].visual){
        delete schemaColumns[i];//删除所有虚拟列
      }
    }
    dispatch({
      type: 'shareData/queryAllTempDataByPage',
      payload: {
        define:JSON.stringify(tableDefine),
      }
    })
  }



  function onDeselectChange(value){
    delete tableDefine.schema[value];//删除虚拟列定义
    //let filterFormValue=TablesUtils.filterForm(tableDefine);
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        tableDefine:tableDefine,
        //filterColumns: filterFormValue,
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
      type: 'shareData/querySuccess',
      payload: {
        tableDefine:tableDefine,
      }
    })
  }

  function handleChangeGroup(value, option) {
    //添加分组
    tableDefine.groupBy.push(value);
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        tableDefine:tableDefine,
      }
    })
  }

  function onDeselectChangeGroup(value) {
    tableDefine.groupBy.splice(tableDefine.groupBy.indexOf(value),1);//删除分组中的值
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        tableDefine:tableDefine,
      }
    })
  }
  function orderSelectChange(value, option){
    tableDefine.orderBy.push(value);
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        tableDefine:tableDefine,
      }
    })
  }
  function orderDeselectChange(value){
    tableDefine.orderBy.splice(tableDefine.orderBy.indexOf(value),1);//删除分组中的值
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        tableDefine:tableDefine,
      }
    })
  }

  return (
    <div className={styles.filterDiv} style={{marginBottom:'10px'}} tabIndex="1">
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        {filterConditions.map((itemCol, index)=> {
          let key = itemCol.col_data;
          if (itemCol.type == "Radio" || itemCol.type == "Checkboxes" || itemCol.type == "Select") {
            const options = itemCol.options
            return (
              <Col span={6} key={key}>
                <FormItem>
                  {getFieldDecorator(itemCol.col_data, {})(
                    <Select size='default' placeholder={itemCol.title} style={{width: '100%'}}>
                      {options.map(function (item) {
                        return <Option key={item}>{item}</Option>
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
                      <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={itemCol.title} size='default'
                                  style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    {getFieldDecorator(itemCol.col_data + "_max", {})(
                      <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder={itemCol.title} size='default'
                                  style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col></Col>);

          } else if (itemCol.type == "FormNumber" || itemCol.type == "FormInt") {

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
      <Row gutter={24} style={{maxWidth:'1080px'}}>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('selectGroupColDatas', {})(
              <Select
                mode="multiple"
                size="default"
                className="margin-right margin-bottom"
                style={{width:'100%' }}
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
          <FormItem>
            {getFieldDecorator('selectCountColDatas', {})(
              <Select
                mode="multiple"
                size="default"
                className="margin-right margin-bottom"
                style={{width:'100%' }}
                onSelect={handleChange}
                onDeselect={onDeselectChange}
                placeholder="要统计的列"
              >
                {countSelectOptions}
              </Select>
            )} </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('selectOrderColDatas', {})(
              <Select
                mode="multiple"
                size="default"
                className="margin-right margin-bottom"
                style={{width:'100%' }}
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
          <FormItem>
            {getFieldDecorator('selectOrderTypeColDatas', {initialValue: 'desc'})(
              <Select
                size="default"
                className="margin-right margin-bottom"
                style={{width:'100%' }}
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
          <Button type="primary" size="default" onClick={handleSubmit}>搜索</Button>
          <Button size="default" onClick={handleReset} style={{marginLeft: "15px"}}>重置</Button>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create()(ShareDataFilter)
