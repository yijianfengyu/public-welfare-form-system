import React from 'react'
import {Link} from 'dva/router'
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  Icon,
  Radio,
  Checkbox,
  Popover,
  TreeSelect,
  InputNumber, Tooltip, message,
} from 'antd'
import TableUtils from "../../utils/TableUtils";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const TableColumnUpdateModal = ({
  inputLabelValue,labelList, dropdownInitData,cascadeInitData,
  dispatch,
  tableList,
  updateIndex,
  recordHideOne,
  contactSelectOptions,
  inputTypeOption,
  inputOptions,
  add,
  disabledSelect,
  TelType,
  buttonText,
  concatList,
  selectedTableColumns,lableClassifyTreeData,radioGroupList,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue
    },
  }) => {
  console.log("99999",inputTypeOption);
  recordHideOne.oldColumnName=recordHideOne.columnName
  const formItemLayoutOne = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 16, offset: 8},
    },
  };
  function deleteContact() {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        inputNumberTwo: "Text",
        disabledSelect: false,
        TelType:false,
        buttonText:"",
        inputTypeOption:"Text",
        inputOptions:[],
      }
    })
    setFieldsValue({contactType: "-不关联-",inputType:"Text"})
  }
  //自动生成input
 // console.log("---传入的更新列----",inputOptions);
  getFieldDecorator('keys', {initialValue: []});
  if (inputOptions.length != 0) {
    getFieldDecorator('keys', {initialValue: inputOptions});
  }
  //删除input
  const deleteInput = (k) => {
    const keys = getFieldValue('keys');
    //console.log("删除了某个选项",keys,k);
    let delOptionUuid=keys[k].option.uuid;
    setFieldsValue({
      keys: keys.filter(key => key.k !== k),
    });
    //删除了某个健，对应的后端使用此选项做跳表的都要更新
    //console.log("更新列数据",tableList);
    tableList.map((item)=>{
      if(item.p_option_uuid&&item.p_option_uuid==delOptionUuid){
        item.p_option_uuid=null;
        console.log("-置空了-",item);
      }
    });
    dispatch({type: 'forms/querySuccess', payload: {tableList}});
  }
  //添加input
  const addInput = () => {
    const keys = getFieldValue('keys');
    const options = getFieldValue('options');
    let index=options?options.length+1:0;
    let uuid=new Date().getTime()+'';
    const nextKeys = keys.concat({k:index,option:{option:'',score:'',uuid}});
    setFieldsValue({
      keys: nextKeys,
    });
    //dispatch({type: 'forms/querySuccess', payload: {}});
    //dispatch({type: 'forms/querySuccess', payload: {updateUuid: updateUuid + 1}})
  }

  const getTableMatchColumns = (value)=>{
    dispatch({type: 'forms/getTableMatchColumns', payload: {
        dropdownTableName:value
    }});
  }
  const keys = getFieldValue('keys');
  const formItems = keys.map((item, index) => {
    return TableUtils.createOptions(getFieldDecorator,item,index,deleteInput);
  });

  //生成数据下拉菜单的dropdownInitData， @TODO 地区需要做解析cascadeInitData
  const  dropdownInitDataOptions=!dropdownInitData?[]:dropdownInitData.map((item, index) => {
    return <Option key={'ddo_'+index} value={item.value}>{item.name}</Option>;
  });
  const  dropdownColumnOptions=!selectedTableColumns?[]:selectedTableColumns.map((item, index) => {
    return <Option key={'dco_'+index} value={item}>{item}</Option>;
  });
  const labelOptions=!labelList?[]:labelList.map((item, index) => {
    return <Option key={'llo_'+index} value={item}>{item}</Option>;
  });
  function setLabelSelect(value){
    //设置分组标签label的值
    console.log("--输入", value);
    setFieldsValue({
      label: value,
    });

  }
  function inputLabel(e){
    //设置分组标签label的值
    console.log("--输入", e);
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        inputLabelValue:e.target.value
      }
    });
  }
  const addLabel =()=>{
    //设置分组标签label的值
    console.log("--输33入",inputLabelValue);
    //lableList
    if(labelList.indexOf(inputLabelValue)==-1){
      labelList.push(inputLabelValue);
      message.success('已添加');
    }else{
      message.success('已有一样的章节，请勿重复添加');
    }
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        labelList:labelList
      }
    });
  }

//格式化并保存列描述的json格式
  function save() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      //生成字段json描述
      console.log("---字段修改----原始值---",values);
      let columnsTemp=TableUtils.createFormColumnJson(values,recordHideOne.col_data,recordHideOne);
      console.log("---字段修改----生成的字段描述---",columnsTemp);
      if(columnsTemp.type=="FormRadioGroup"){
        radioGroupList[columnsTemp.uuid]=columnsTemp;
      }
      tableList.splice(updateIndex, 1, columnsTemp)
      //绑定联系人的下拉框显示值
      let indexValue = values.contactType.split("@@")[3]
      if (recordHideOne.contactType != undefined) {
        let indexValueOne = recordHideOne.contactType.split("@@")[3];
        let irrelevancy = {
          title: recordHideOne.contactType.split("@@")[2],
          key: recordHideOne.contactType.split("@@")[1],
          type: recordHideOne.contactType.split("@@")[0],
        }
        if (values.contactType == "@@@@-不关联-@@0") {
          contactSelectOptions.splice(indexValueOne, 1, irrelevancy)
        } else {
          contactSelectOptions.splice(indexValueOne, 1, irrelevancy)
          contactSelectOptions.splice(indexValue, 1, "")
        }
      } else {
        if (values.contactType != "@@@@-不关联-@@0") {
          contactSelectOptions.splice(indexValue, 1, "")
        }
      }

      dispatch({
        type: 'forms/querySuccess',
        payload: {
          tableList: tableList,
          recordHideOne: {},
          inputOptions: [],
          updateUuid: 0,
          inputTypeOption: "Text",
          inputNumberTwo: "Text",
          disabledSelect: false,
          TelType:false,
          buttonText:"",
          contactSelectOptions,
          radioGroupList,
        }
      })
      setFieldsValue({
        keys: []
      });
      dispatch({
        type: 'forms/hideUpdateModalVisit',
      })
    })
  }

  function handleChange(value) {
    dispatch({
      type: 'forms/initFormType',
      payload: {
        inputTypeOption: value,
        uuid: 0,
        inputOptions:[],
      }
    })
    setFieldsValue({
      keys: [],
      inputType:value
    });
  }

  function handleCancel() {
    dispatch({
      type: 'forms/hideUpdateModalVisit',
      payload: {
        recordHideOne: {},
        uuid: 0,
        inputTypeOption: "Text",
        inputOptions: [],
        inputNumberTwo: "Text",
        disabledSelect: false,
        TelType:false,
        buttonText:""
      }
    })

}
  function handleChangeContant(value) {
    let text = value.split("@@")[0]
    let name = value.split("@@")[1]
    let title=value.split("@@")[2]
    setFieldsValue({inputType:text})
    if(title=="-不关联-"){
      dispatch({
        type: 'forms/querySuccess',
        payload: {
          inputNumberTwo: "Text",
          disabledSelect: false,
          inputTypeOption:"Text",
          TelType:false,
          buttonText:"",
          inputOptions:[],
        }
      })
    }else{
      let s
      let c
      if(value.split("@@")[0] == "Radio"){
        s=[{k:0,option:'男'},{k:1,option:"女"}]
        c="Radio"
      }else {
        c=text
        s=[]
      }
      dispatch({
        type: 'forms/querySuccess',
        payload: {
          inputTypeOption: c,
          disabledSelect: true,
          TelType:true,
          buttonText:title,
          inputOptions:s,
        }
      })
    }
  }

  const questionContent = (
    <div>
      <span>用户在选项中填写的内容，会自动成为联系人的信息项</span>
    </div>
  );

  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="500px"
      title="修改表单内容"
      maskClosable={false}
    >
      <form>
        <FormItem
          {...formItemLayoutOne}
          label="选项标题"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('optionTitle', {
            initialValue: recordHideOne.title,
            rules: [{required: true, message: '请输入选项标题'}],
          })(<Input style={{ width: '60%' }}/>)}
        </FormItem>
        {TelType==true && <Row span={24}>
          <Col span={16} style={{float:'right',marginBottom:'10px'}}>
            <span>已关联联系人选项：</span>
            <Button type="primary" size="small" onClick={deleteContact}>
              {TelType == true && buttonText.split("@@")[2] != undefined ? buttonText.split("@@")[2] : buttonText}
              <Icon type="close"/>
            </Button>
          </Col>
        </Row>}
        <FormItem
          {...formItemLayoutOne}
          label={<span>收录进联系人档案选项
                  <Popover content={questionContent}  trigger="hover">
                   <Icon type="question-circle-o" style={{color:"#428BCA",marginLeft:'5px',cursor:'help'}}/>
                  </Popover>
          </span>}
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('contactType', {
            initialValue:buttonText == "" ? "-不关联-" : buttonText.split("@@")[2],
          })(
            <Select
              style={{ width: 200 }}
              onChange={handleChangeContant}
            >
              {concatList}
            </Select>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="必填选项"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('validators', {
            initialValue: recordHideOne.validators != undefined ? true : false
          })(<Checkbox defaultChecked={recordHideOne.validators!=undefined?true:false}
                       style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="输入类型"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('inputType', {
            initialValue:inputTypeOption,
            rules: [{required: true, message: '请选择输入类型'}],
          })(
            <Select
              style={{ width: 200 }}
              onChange={handleChange}
              disabled={disabledSelect}
            >
              {TableUtils.getFormElementOptions()}
            </Select>)}
        </FormItem>
        {inputTypeOption === "Select" ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{marginBottom:'10px' }}>
                {getFieldDecorator('InputOption', {})(
                  <div>
                    <p>请输入选择项</p>
                    {formItems}
                    <FormItem
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('optionZiDong', {
                        initialValue: add
                      })(
                        <div>
                          <Button type="dashed" onClick={addInput} style={{ width: '60%' }}>
                            <Icon type="plus"/> 添加
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            </Col></Row> : null}
        {inputTypeOption === "FormRadioGroup" ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{marginBottom:'10px' }}>
                {getFieldDecorator('InputOption', {})(
                  <div>
                    <p>请输入选择项</p>
                    {formItems}
                    <FormItem
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('optionZiDong', {})(
                        <div>
                          <Button type="dashed" onClick={addInput} style={{ width: '60%' }}>
                            <Icon type="plus"/> 添加
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            </Col></Row> : null}
        {inputTypeOption === "CheckboxGroup"  || inputTypeOption === "RadioAttach"?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{marginBottom:'10px' }}>
                {getFieldDecorator('InputOptions', {})(
                  <div>
                    <p>请输入选择项</p>
                    {formItems}
                    <FormItem
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('addFile', {})(
                        <div>
                          <Button type="dashed" onClick={addInput} style={{ width: '60%' }}>
                            <Icon type="plus"/> 添加
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            </Col></Row> : null}

        {inputTypeOption === "FormLink" ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{marginBottom:'10px' }}>
                  <div>
                    <p>请输入链接地址,注意带http://前缀</p>
                    <FormItem
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('defaultLink', {initialValue: recordHideOne.defaultLink ?  recordHideOne.defaultLink:"",})(
                        <Input style={{ width: '60%' }}/>)}
                    </FormItem>
                  </div>
              </FormItem>
            </Col></Row> : null}
            {inputTypeOption === "FormInt"||inputTypeOption === "FormNumber" ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
                  <div>
                    <FormItem label={"最小值"}
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('min', {initialValue: recordHideOne.min ?  recordHideOne.min:"",})(
                        <InputNumber  key={'intmin'} step="1" style={{ width: '40%' }}/>)}
                    </FormItem>
                    <FormItem  label={"最大值"}
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('max', {initialValue: recordHideOne.max ?  recordHideOne.max:"",})(
                        <InputNumber key={'intmax'} step="1" style={{ width: '40%' }}/>)}
                    </FormItem>
                  </div>
            </Col></Row> : null}

        {inputTypeOption === "FormInput"||inputTypeOption === "FormText"||inputTypeOption === "FormDaily" ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <div>
                <FormItem label={"最小长度"}
                          style={{marginBottom:'10px' }}
                >
                  {getFieldDecorator('min', {initialValue: recordHideOne.min ?  recordHideOne.min:"",})(
                    <InputNumber key={'imin'} step="1" style={{ width: '40%' }}/>)}
                </FormItem>
                <FormItem  label={"最大长度"}
                           style={{marginBottom:'10px' }}
                >
                  {getFieldDecorator('max', {initialValue: recordHideOne.max ?  recordHideOne.max:"",})(
                    <InputNumber  key={'imax'} step="1" style={{ width: '40%' }}/>)}
                </FormItem>
              </div>
            </Col></Row> : null}
            {inputTypeOption === "FormMeasurement" ?
          <div>
            <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <div>
                <FormItem label={"仪表读数最小值"}
                          style={{marginBottom:'10px' }}
                >
                  {getFieldDecorator('readingsMin', {initialValue: recordHideOne.readingsMin ?  recordHideOne.readingsMin:"",})(
                    <InputNumber key={'readingsMin'} step="1" style={{ width: '40%' }}/>)}
                </FormItem>
                <FormItem  label={"仪表读数最大值"}
                           style={{marginBottom:'10px' }}
                >
                  {getFieldDecorator('readingsMax', {initialValue: recordHideOne.readingsMax ?  recordHideOne.readingsMax:"",})(
                    <InputNumber  key={'readingsMax'} step="1" style={{ width: '40%' }}/>)}
                </FormItem>
              </div>
            </Col></Row>
            <Row gutter={24}>
              <Col span={8}>
              </Col>
              <Col span={16}>
                <div>
                  <FormItem label={"稀释倍数最小值"}
                            style={{marginBottom:'10px' }}
                  >
                    {getFieldDecorator('dilutionMin', {initialValue: recordHideOne.dilutionMin ?  recordHideOne.dilutionMin:"",})(
                      <InputNumber style={{ width: '40%' }}/>)}
                  </FormItem>
                  <FormItem  label={"稀释倍数最大值"}
                             style={{marginBottom:'10px' }}
                  >
                    {getFieldDecorator('dilutionMax', {initialValue: recordHideOne.dilutionMax ?  recordHideOne.dilutionMax:"",})(
                      <InputNumber style={{ width: '40%' }}/>)}
                  </FormItem>
                </div>
              </Col></Row>
          </div>

              : null}

            {inputTypeOption === "FormDropdown" ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{marginBottom:'10px' }}>
                  <div>
                    <p>选择数据表</p>
                    <FormItem
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('value', {initialValue: recordHideOne.value? recordHideOne.value:""})(
                        <Select style={{ width: '60%' }} onChange={getTableMatchColumns}>
                          {dropdownInitDataOptions}
                        </Select>
                        )}

                    </FormItem>
                    <p>选择表中显示列</p>
                    <FormItem
                      style={{marginBottom:'10px' }}
                    >
                      {getFieldDecorator('dropdownValue', {initialValue: recordHideOne.dropdownValue? recordHideOne.dropdownValue:""})(
                        <Select style={{ width: '60%' }}>
                          {dropdownColumnOptions}
                        </Select>
                      )}

                    </FormItem>
                  </div>
              </FormItem>
            </Col></Row> : null}

        <FormItem
          {...formItemLayoutOne}
          label="提示文字"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('alt', {
            initialValue: recordHideOne.placeholder == undefined ? "" : recordHideOne.placeholder,
          })(<TextArea rows={4} style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="系统外部是否隐藏?"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('outHiden', {
            initialValue: recordHideOne.outHiden  ? recordHideOne.outHiden:false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="分享数据搜索条件隐藏?"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('searchHiden', {
            initialValue: recordHideOne.searchHiden  ? recordHideOne.searchHiden:false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="分享数据排序条件隐藏?"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('orderHiden', {
            initialValue: recordHideOne.orderHiden  ? recordHideOne.orderHiden:false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="数据公开隐藏?"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('columnHiden', {
            initialValue: recordHideOne.columnHiden  ? recordHideOne.columnHiden:false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="选择章节"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('label', {
            initialValue: recordHideOne.label,
            rules: [{message: '请选择章节'}],
          })(
            <Select onChange={setLabelSelect}
                    placeholder="选择章节"
                    className="margin-right margin-bottom"
                    style={{width: '100%'}}
                    size='default'>
              {labelOptions}
            </Select>
          )}
          <div>
          <Input onChange={(e)=>inputLabel(e)} style={{ width: '60%' }}/>
          <Link onClick={addLabel}>
            <Icon style={{marginRight: "5px"}}  type="toihk-add" /><span>添加章节</span>
          </Link>
          </div>
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="字段英文名称(注意规范，中文无效)"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('columnName', {
            initialValue: recordHideOne.columnName,
            rules: [{ required:true, message: '请输入字段英文名称'}],
          })(<Input style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="填写答案分值"
          style={{marginBottom:'10px' }}
        >
          {getFieldDecorator('columnScore', {
            initialValue: recordHideOne.columnScore,
            rules: [{ message: '请输入填写答案分值'}],
          })(<Input style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel} style={{marginBottom:'10px' }}>
          <Button type="primary" onClick={save} style={{marginRight:'10px' }}>保存</Button>
          <Button onClick={handleCancel}>取消</Button>
        </FormItem>
      </form>
    </Modal>
  )
}

export default (Form.create())(TableColumnUpdateModal)

