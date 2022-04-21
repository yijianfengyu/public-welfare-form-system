import React from 'react';
import {Form, Button, Row, Icon,Col, Input, Select,DatePicker,InputNumber,Tag,Tooltip,Tabs  } from 'antd';
import styles from "../../utils/commonStyle.less";
import TablesUtils from '../../utils/TableUtils'
const TabPane = Tabs.TabPane;
const ShareDataFilter = ({
  dispatch,
  onFilterChange,
  filterColumns,
  tableDefine, showConditions, orderByStatus,cityList,selectedCitySearch,
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
    let fields = getFieldsValue();
    TablesUtils.getTableDefineValues(tableDefine,fields);
    onFilterChange(fields)
  }
  const showMoreConditions = () => {

    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        showConditions:!showConditions,
      }
    })

  }

  function tagOnchange(obj){
    //排序被点击

    let fields = getFieldsValue();
    fields.selectOrderColDatas =[obj.col_data];
    fields.selectOrderTypeColDatas =orderByStatus?"desc":"asc";

    TablesUtils.getTableDefineValues(tableDefine,fields);//把特殊存储在tableDefine的值取出来传上去

    onFilterChange(fields);
  }
  function cityTagOnclick(obj,city){
    //城市tag被点击
    let fields = getFieldsValue();
    fields[obj.col_data]=city;
    TablesUtils.getTableDefineValues(tableDefine,fields,[obj.col_data]);//把特殊存储在tableDefine的值取出来传上去

    onFilterChange(fields);
  }

  let orderSelectOptions = [];//排序下拉框值
  let groupSelectOptions = [];//分组下拉框值
  let countSelectOptions = [];//分组统计下拉框值
  let filterConditions = [];//其他默认搜索条件列
  let cityBoxCondition=null;//如果有地址类型会默认生成地址快速搜索的
  let schemaColumns = tableDefine.schema;
  let k=0;
  for (var i in schemaColumns) {
    //filterColumns[i].col_data=filterColumns[i].srcColData;

    let itemCol = schemaColumns[i];
    if (itemCol.type != "Content") {
      if (itemCol.searchHiden||itemCol.visual=="static") {
        //如果设置了在搜索条件中隐藏就隐藏,静态添加的途径渠道等也隐藏
      } else if (itemCol.type == "Radio" || itemCol.type == "Checkboxes" || itemCol.type == "Select") {
        filterConditions.push(itemCol)
      } else if (itemCol.type == "DataTimes") {
        filterConditions.push(itemCol)
      } else if (itemCol.type == "FormDate") {
        filterConditions.push(itemCol)
      }else if (itemCol.type == "FormInt" || itemCol.type == "FormNumber") {
        filterConditions.push(itemCol)
      }else if (itemCol.type == "FormInput" || itemCol.type == "FormText"|| itemCol.type == "FormDaily") {
        filterConditions.push(itemCol)
      }else if(itemCol.type == "Cascade") {

        let cityTabs = [];
        for (let h = 0; h < cityList.length; h++) {
          let hightLightselectedCity = itemCol.value == cityList[h] ? "red" : "";
          cityTabs.push(<TabPane tab={<Tag id={'ct_' + h} onClick={cityTagOnclick.bind(this,itemCol,cityList[h])} color={hightLightselectedCity}>{cityList[h]}</Tag>}
                                 key={'city_' + h}></TabPane>);
        }
        if (cityTabs.length>0) {
          cityBoxCondition = (<Tabs
            tabPosition={1}>
            {cityTabs}
          </Tabs>);
        }
        filterConditions.push(itemCol);//虽然有快捷方式，还是需要输入框
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
        if (type === "FormInt" || type === "FormNumber") {
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
      let color = tableDefine.orderBy&&tableDefine.orderBy[0]==itemCol.col_data?"blue":"";//#2db7f5
      let orderFlag= tableDefine.orderBy&&tableDefine.orderBy==itemCol.col_data?tableDefine.orderType=="desc"?
        <Icon style={{marginLeft: "2px"}} type="down" />:<Icon style={{marginLeft: "2px"}} type="up" />:null;
      if (!itemCol.orderHiden) {
        if (k > 3 && !showConditions) {
        } else {
          //默认显示4个其余隐藏
          if (!visual && visual != "static") {
            orderSelectOptions.push(
              <Tag style={{marginBottom: "5px"}}
                   color={color} onClick={tagOnchange.bind(this, itemCol)} key={"dd_" + col_data}>
              {title}{orderFlag}
            </Tag>);
          } else {

          }
          k++;//每显示一个计数加1
        }
      }


    }
  }

  //重置
  const handleReset = () => {
    resetFields();
    TablesUtils.resetDefineValues(tableDefine);
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

  let inputs=null;



  return (
    <div className={styles.filterDiv} style={{marginBottom:'6px'}}>

      <div style={{maxWidth: '1080px'}}>
        <Row gutter={24} style={{width:'100%'}}>
        {cityBoxCondition}
        <Col span={24} style={{marginTop:'5px'}}>
          <span style={{fontSize:'12px'}}>排序:</span>{orderSelectOptions}
        </Col>
        </Row>
        <div style={{display: 'flex',flexDirection: 'row',alignItems: 'flex-start',flexWrap: 'wrap'}}>
        {filterConditions.map((itemCol, index)=> {
          if(index>2 && !showConditions){
            return null;
          }

          let key = itemCol.col_data;
          if (itemCol.type == "Radio" || itemCol.type == "Checkboxes" || itemCol.type == "Select") {
            const options = itemCol.options

            return (
              <div style={{marginRight:'15px',width:'27%'}} span={8} key={key}>
                <FormItem>
                  {getFieldDecorator(itemCol.col_data, {})(
                    <Select size='default' placeholder={itemCol.title} style={{width: '100%'}}>
                      {options.map(function (item) {
                        let oDiv = document.createElement('div');
                        oDiv.innerHTML = item;
                        let text = oDiv.innerText;
                        return <Option key={text}>{text}</Option>
                      })}
                    </Select>
                  )}
                </FormItem>
              </div>
            )

          } else if (itemCol.type == "DataTimes" || itemCol.type == "FormDatetime" || itemCol.type == "FormDate") {

            return (
              <div style={{marginRight:'15px',width:'27%'}} span={8} key={key}>
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
                </Col></div>);

          } else if (itemCol.type == "FormInt" || itemCol.type == "FormNumber") {

            return (
              <div style={{marginRight:'15px',width:'27%'}} span={8} key={key}>
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
              </div>
            );

          } else {
            return (
              <div style={{marginRight:'15px',width:'27%'}} span={8} key={key}>
                <FormItem>
                  {getFieldDecorator(itemCol.col_data, {})(
                    <Input placeholder={itemCol.title} size='default' maxLength="30" style={{width: '100%'}}/>
                  )}
                </FormItem>
              </div>
            )


          }

        })}
        </div>
      </div>

      <div style={{maxWidth:'1080px'}}>
        <Col span={6} style={{display:'none'}}>
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
        <Col span={6} style={{display:'none'}}>
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

        <Col span={6} style={{display:"none"}}>
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
      </div>
      <div>
        <Col>
          <Button style={{width:'27%'}} type="primary" size="default" onClick={handleSubmit}>搜索</Button>
          <Button style={{width:'27%'}} type="default" size="default" onClick={showMoreConditions} style={{marginLeft: "15px"}}>更多搜索条件</Button>
          <Button style={{width:'27%'}} size="default" onClick={handleReset} style={{marginLeft: "15px"}}>重置</Button>
        </Col>
      </div>
    </div>
  )
}

export default Form.create()(ShareDataFilter)
