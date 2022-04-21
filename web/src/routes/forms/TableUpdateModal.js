import React from 'react'
import  stylesFrom from './index.less'
import {Link} from 'dva/router'
import ColumnUpdateModal from './TableColumnUpdateModal'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import {
  Form,
  Button,
  Modal,
  Input,
  Row,
  Col,
  Select,
  Icon,
  message,
  Table,
  Radio,
  Checkbox,
  Tooltip,
  Popconfirm,
  TreeSelect, InputNumber, Tabs,
} from 'antd'
import TableUtils from "../../utils/TableUtils";
import AntDraggableModal from '../../components/layer/AntDraggableModal'
import styles from '../../themes/index.less'
import ExamQuestion from './formData/ExamQuestion'
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const columnTypeLabels=TableUtils.getFormElementType();
const TabPane=Tabs.TabPane;
const TableUpdateModal = ({
  forms,questionKey,dropdownInitData,cascadeInitData,
  value,
  tableList,
  updateIndex,
  updateModalVisit,
  recordHideOne,
  contactSelectOptionsRecover,
  recordHide,
  keyss,
  inputTypeOption,
  inputNumberOne,
  inputNumberTwo,
  uuid,
  updateUuid,
  col_data,
  add,
  dispatch,
  inputOptions,
  location,
  editorStateOne,
  TelType,
  disabledSelect,
  buttonText,
  contactSelectOptions,
  recordIndex,
  tempTableList,
  isAuthorityForm,
  userList,
  onMouseDownValues,
  onMouseDownIndex,
  selectedTableColumns,lableClassifyTreeData,
  radioGroupList,delOptionUuid,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue
    },
  }) => {
  console.log("--updateFormModals--");
  let {labelList,inputLabelValue}=forms;
  const columns = [
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
      render: (text, record,index) => {
        if (record.validators != undefined) {
          if (record.validators.length > 0) {
            text = <p>{text}&nbsp;&nbsp;<span style={{color:'red',fontSize:'20px'}}>*</span></p>
          } else {
            text = text
          }
        } else {
          text = text
        }

        function onMouseDown() {
          dispatch({
            type: 'forms/querySuccess',
            payload: {
              onMouseDownValues: record,
              onMouseDownIndex: index,
            },
          })
        }

        function onMouseUp() {
          if (onMouseDownIndex != -1) {
            tableList.splice(onMouseDownIndex,1)
            tableList.splice(index,0,onMouseDownValues);
            dispatch({
              type: 'forms/querySuccess',
              payload: {
                tableList,
                onMouseDownValues: {},
                onMouseDownIndex: -1,
              },
            })
          }
        }
        return (
          <Tooltip placement="left" title="可拖拽排序">
            <div onMouseDown={onMouseDown} style={{mozUserSelect:'none',webkitUserSelect:'none',cursor:'move'}}
                 onMouseUp={onMouseUp}>
              {text}
            </div>
          </Tooltip>
        )
      }
    },
    {
      title: '选项类型',
      dataIndex: 'type',
      render: (text, record) => {
        text=TableUtils.parseLabel(columnTypeLabels,text)
        return (
          <div style={{mozUserSelect:'none',webkitUserSelect:'none'}}>
            {text}
          </div>
        )
      }
    },
    {
      title: '父单选题',
      dataIndex: 'p_option_uuid',
      width: '150px',
      render: (text, record) => {
        //console.log("=======0");
        function handleCheckboxOptionsChange (value,item){
          console.log("=======3",value,item);
          item.p_uuid=value;
          item.p_option_uuid=null;
          //刷新数据显示
          dispatch({
            type: 'forms/querySuccess',
            payload: {
            }
          });
        }
        //console.log("=======1");
        function handleCheckboxSubOptionsChange (value,item){
          item.p_option_uuid=value;
          //刷新数据显示
          dispatch({
            type: 'forms/querySuccess',
            payload: {
            }
          });
        }
        //console.log("=======2",radioGroupList);
        let checkboxSubOptions =[<Option value='' key='88888'></Option>];
        if(radioGroupList[record.p_uuid]&&radioGroupList[record.p_uuid].options){
          let mid = radioGroupList[record.p_uuid].options.map(item => <Option value={item.uuid} key={record.p_uuid+'_'+item.uuid}>{item.option}</Option>);
          checkboxSubOptions=checkboxSubOptions.concat(mid);
        }
        //console.log("=======",checkboxOptions,checkboxSubOptions,record.p_option_uuid,"0000");
        return (
          <div>
            <Select value={record.p_uuid?record.p_uuid:''} style={{ width: 90 }} onChange={(item)=>handleCheckboxOptionsChange(item,record)}>
              {checkboxOptions}
            </Select>
            <Select value={record.p_option_uuid?record.p_option_uuid:''} style={{ width: 90 }} onChange={(item)=>handleCheckboxSubOptionsChange(item,record)}>
              {checkboxSubOptions}
            </Select>
          </div>

        )
      }
    },
    {
      title: '操作',
      render: (text, record, index) => {
        function onClick() {
          let uuids
          const ii = []
          if (record.type == "FormRadioGroup"
            || record.type == "CheckboxGroup"
            || record.type == "Select"
            || record.type == "RadioAttach") {
            let options = record.options
            uuids = options.length + 1
            for (var i = 0; i <= options.length; i++) {
              let sha = new Object()
              sha["k"] = i
              sha["option"] = options[i]
              if (sha.option != undefined) {
                ii.push(sha)
              }
            }
          } else {
            ii.push()
          }
          console.log("----单击更新更新列----",record);
          let payload={};
          if (record.contactType != undefined) {
            if (record.contactType != ""&&record.contactType != "-不关联-") {

                payload={
                  updateIndex: index,
                  recordHideOne: record,
                  inputTypeOption: record.type,
                  updateUuid: ii.length,
                  inputOptions: ii,
                  //inputNumberTwo: text,
                  disabledSelect: true,
                  TelType: true,
                  buttonText: record.contactType,
                };

            } else {
                payload= {
                  updateIndex: index,
                  recordHideOne: record,
                  inputTypeOption: record.type,
                  updateUuid: ii.length,
                  inputOptions: ii,
                  //inputNumberTwo: text,
                  disabledSelect: false,
                  TelType: false,
                  buttonText: "",
                }

            }
          } else {
              payload={
                updateIndex: index,
                recordHideOne: record,
                inputTypeOption: record.type,
                updateUuid: ii.length,
                inputOptions: ii,
                //inputNumberTwo: text,
                disabledSelect: false,
                TelType: false,
                buttonText: "",
              }

          }
          dispatch({
            type: 'forms/showUpdateModalVisit',
            payload:{
              updateModalVisit:true,
              dropdownTableName:record.value,
              ...payload,
            }
          })
        }

        function deleteClick() {
          if (record.contactType != undefined) {
            let contactIndex = record.contactType.split("@@")[3]
            let obj = {
              title: record.contactType.split("@@")[2],
              key: record.contactType.split("@@")[1],
              type: record.contactType.split("@@")[0],
            }
            contactSelectOptions.splice(contactIndex, 1, obj);
          }
          tableList.splice(index, 1);
          tableList.map((item)=>{
            if(item.p_uuid&&item.p_uuid==record.uuid){
              item.p_uuid=null;
              item.p_option_uuid=null;
            }
          });
          if(record.type=="FormRadioGroup"){
            //删除对应可以作为跳表的选项
            delete radioGroupList[record.uuid];
          }
          dispatch({
            type: 'forms/querySuccess',
            payload: {
              tableList,
              contactSelectOptions,
              radioGroupList,
            }
          })
        }

        return <div>
          <Tooltip placement="top" title="修改字段">
            <Link onClick={onClick} style={{marginRight: "5px"}}>
              <Icon type="toihk-edit"></Icon></Link>
          </Tooltip>
          <Tooltip placement="top" title="删除">
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
  ];
  const viewPeopleChild = [];
  for (let i in userList) {
    viewPeopleChild.push(<Option key={userList[i].id}>{userList[i].userName}</Option>);
  }
  const viewPeopleAndAllChild = [];
  viewPeopleAndAllChild.push(<Option key={"All"}>{"All"}</Option>);
  for (let j in userList) {
    viewPeopleAndAllChild.push(<Option key={userList[j].id}>{userList[j].userName}</Option>);
  }

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 3},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 20},
    },
  };
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
      sm: {span: 20, offset: 3},
    },
  };
  const formItemLayoutWithOutLabelOne = {
    wrapperCol: {
      xs: {span: 24, offset: 0},
      sm: {span: 16, offset: 8},
    },
  };

  const concatList = TableUtils.createConcatSelectOptions(contactSelectOptions);

  //生成数据下拉菜单的dropdownInitData， @TODO 地区需要做解析cascadeInitData
  const  dropdownInitDataOptions=!dropdownInitData?[]:dropdownInitData.map((item, index) => {
    return <Option key={'ddo_'+index} value={item.value}>{item.name}</Option>;
  });

  const  dropdownColumnOptions=!selectedTableColumns?[]:selectedTableColumns.map((item, index) => {
    return <Option key={'dco_'+index} value={item}>{item}</Option>;
  });

  //自动生成input
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
        //console.log("-置空了-",item);
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
    //把数字索引存储起来
    //dispatch({type: 'forms/querySuccess', payload: {}});
  };
  const getTableMatchColumns = (value)=>{
    dispatch({type: 'forms/getTableMatchColumns', payload: {
        dropdownTableName:value
      }});
  }
  const keys = getFieldValue('keys');
  const formItems = keys.map((item, index) => {
    return TableUtils.createOptions(getFieldDecorator,item,index,deleteInput);
  });


//提交到后台
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }

      if (values.formTitle == null || values.formTitle == "") {
        message.error("表单标题不能为空");
      } else {
        if (values.viewPeople == null || values.viewPeople == "") {
          message.error("可视人不能为空");
          return;
        }
        let formSynopsis;
        if (values.formSynopsis == undefined) {
          formSynopsis = recordHide.formDescription
        } else {
          formSynopsis = draftToHtml(values.formSynopsis)
        }
        let shuju = {};
        const fieldset = [];
        const filed = [];
        for (var i in tableList) {
          //联系人
          if (tableList[i].contactType != undefined) {
            tableList[i].contactType = tableList[i].contactType.split("@@")[1]
          }
          //小标题
          if (tableList[i].type == "Content") {
            tableList[i].title = false
          }
          //tableList[i].value = "";
          filed.push(tableList[i].col_data)
          shuju[tableList[i].col_data] = tableList[i]////利用方括号法添加属性和属性值
        }
        let but = {
          legend: " ",
          fields: filed,
          buttons: [
            {
              "label": "提交",
              "action": "submit",
              "type": "button",
              "buttonClass": "btn btn-primary"
            }
          ]
        };

        let de = {schema: shuju, fieldsets: but};
        de.label=forms.labelList?forms.labelList:[];
        let obj = JSON.parse(sessionStorage.getItem("UserStrom"));
        let user1 = obj.id;
        if (tableList.length != 0) {
          //console.log("----更新表---",de);
          dispatch({
            type: 'forms/updateTempTable',
            payload: {
              tableName: values.tableName,
              id: recordHide.id,
              formTitle: values.formTitle,
              formDescription: formSynopsis,
              define: JSON.stringify(de),
              label:JSON.stringify(forms.labelList?forms.labelList:[]),
              usableRange: values.formRidio,
              sub: values.sub,
              viewPeople: values.viewPeople.toString(),
            }
          })
          dispatch({
            type: 'forms/querySuccess',
            payload: {
              recordIndex: recordIndex,
              tempTableList: tempTableList,
            }
          })
          handleCancel()
        } else {
          message.error("表单内容不能为空")
        }
      }
    })
  }

//保存列描述到表格
  function save() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }

      //生成字段json描述
      let columnsTemp=TableUtils.createFormColumnJson(values, values.columnName,null);
      //console.log("--打印生成的字段描述表单update--",columnsTemp);
      if(columnsTemp.type=="FormRadioGroup"){
        radioGroupList[columnsTemp.uuid]=columnsTemp;
      }
      //保存时去联系人
      let index = values.contactType.split("@@")[3];

      contactSelectOptions.splice(index, 1, "");

      dispatch({
        type: 'forms/querySuccess',
        payload: {
          tableList: tableList.concat(columnsTemp),
          value: 1,
          contactSelectOptions: contactSelectOptions,
          disabledSelect: false,
          inputTypeOption: "",
          inputNumberTwo: "Text",
          TelType: false,
          buttonText: "",
          radioGroupList,
        }
      })
      setFieldsValue({
        keys: []
      });
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
    setFieldsValue({ keys: [],inputType:value})
   /* setFieldsValue({
      keys: [],
    });*/
  }


  function onInsert() {
    if (tableList.length >= 60) {
      message.warning("最多只能添加35列")
    } else {
      dispatch({
        type: 'forms/addColumn', payload: {
          value: 2,
        }
      })
    }
  }

  function onClear() {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        value: 1,
      }
    })
  }

  function deleteContact() {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        inputTypeOption: "",
        inputNumberTwo: "Text",
        disabledSelect: false,
        TelType: false,
        buttonText: "",
        inputOptions:[],
      }
    })
    setFieldsValue({contactType: "-不关联-",inputType:"Text"})
  }

  const updateModalProps = {
    labelList:forms.labelList,
    inputLabelValue:forms.inputLabelValue,
    dropdownInitData,cascadeInitData,
    location,
    dispatch,
    value,
    tableList,
    updateIndex,
    updateModalVisit,
    recordHideOne,
    recordHide,
    contactSelectOptions,
    keyss,
    inputTypeOption,
    inputNumberOne,
    inputNumberTwo,
    updateUuid,
    col_data,
    add,
    inputOptions,
    TelType,
    disabledSelect,
    buttonText,
    concatList,
    selectedTableColumns,
    lableClassifyTreeData,
    radioGroupList,
  }

  function handleCancel() {
    dispatch({
      type: 'forms/hideUpdateOneModalVisitVisit',
      payload: {
        value: 1,
        recordHideOne: {},
        recordHide: {},
        tableList: [],
        col_data: 1,
        uuid: 0,
        editorStateOne: "",
        contactSelectOptionsUpdate: TableUtils.getContactTypeDefineForUpdate(),
      }
    })
  }
  function handleChangeContant(value) {
    let text = value.split("@@")[0]
    let name = value.split("@@")[1]
    let title = value.split("@@")[2]
    setFieldsValue({inputType:text})
    if (title == "-不关联-") {
      dispatch({
        type: 'forms/querySuccess',
        payload: {
          inputNumberTwo: "Text",
          inputTypeOption: "Text",
          disabledSelect: false,
          TelType: false,
          buttonText: ""
        }
      })
    } else {
      let s
      let c
      if (value.split("@@")[0] == "Radio") {
        s = [{k: 0, option: '男'}, {k: 1, option: "女"}]
        c = "Radio"
      } else {
        s = []
        c = text
      }
      dispatch({
        type: 'forms/querySuccess',
        payload: {
          inputTypeOption: text,
          inputNumberTwo: c,
          disabledSelect: true,
          TelType: true,
          inputOptions: s,
          buttonText: title,
        }
      })
    }
  }

  const questionTabClick=(key)=>{
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        questionKey: key,
      }
    })
  }
  const checkboxOptions = Object.values(radioGroupList).map(item => <Option value={item.uuid} key={item.col_data+item.uuid}>{item.title}</Option>);
  //console.log('--radioGroupList--',radioGroupList,'checkboxOptions',checkboxOptions);
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
  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="1000px"
      maskClosable={false}
      title="修改表单"
    >
      <div>
        <form className={stylesFrom.form}>
          <FormItem
            {...formItemLayout}
            label="表单标题"
          >
            {getFieldDecorator('formTitle', {
              initialValue: recordHide.formTitle
            })(<Input placeholder="表单标题"/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表单英文缩写"
          >
            {getFieldDecorator('tableName', {
              initialValue: recordHide.tableName,
              required:true,
            })(<Input placeholder="表单英文标签,请仅使用26个字母和下划线,可不填写"/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表单类型"
          >
            {getFieldDecorator('formType', {})(
              <RadioGroup>
                <Radio value={0}>教育</Radio>
                <Radio value={1}>基本</Radio>
                <Radio value={3}>水质</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否可作为子表"
          >
            {getFieldDecorator('sub', {
              initialValue: recordHide.sub? parseInt(recordHide.sub) : 0
            })(
              <RadioGroup>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表单简介"
          >
            {getFieldDecorator('formSynopsis', {})(
              <Editor
                wrapperClassName={stylesFrom.wysiwyg_wrapper}
                defaultEditorState={editorStateOne}
                localization={{
                  locale: 'zh',
                }}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker','image','link','remove', 'history'],
                  fontFamily:{
                    options:['宋体','新宋体','黑体','楷体','华文行楷','华文楷体','微软雅黑','幼圆','Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana']
                  },
                  link:{
                  popupClassName:stylesFrom.rdwLinkModal,
                 }
                }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="使用范围"
          >
            {getFieldDecorator('formRidio', {
              initialValue: recordHide.usableRange ? parseInt(recordHide.usableRange) : 1
            })(
              <RadioGroup>
                <Radio value={0}>内部访问</Radio>
                <Radio value={1}>内、外部访问</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="可视人:" {...formItemLayout}>
            {getFieldDecorator('viewPeople', {
              initialValue: (null == recordHide.viewPeople || recordHide.viewPeople == "" || recordHide.viewPeople == undefined) ? "" : recordHide.viewPeople.split(',')
            })(<Select mode="multiple" size='default'>
              {viewPeopleAndAllChild}
            </Select>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表单内容"
          >
            <Tabs onTabClick={questionTabClick} style={{minWidth: '540px',marginTop:'40px'}}>
              <TabPane tab="题目列表" key="1" style={{paddingTop:'15px'}}>
              <Table
                bordered
                columns={columns}
                dataSource={tableList}
                pagination={false}
              />
              </TabPane>
              <TabPane tab="题库" key="2" style={{paddingTop:'15px'}}>
                <ExamQuestion forms={forms} dispatch={dispatch}  />
              </TabPane>
            </Tabs>
          </FormItem>
          <FormItem
            {...formItemLayoutWithOutLabel}
          >
            {getFieldDecorator('insertContent', {})(
              <div>
                {value === 2 ?
                  <div className={stylesFrom.divTwo}>
                    <form>
                      <FormItem
                        {...formItemLayoutOne}
                        label="选项标题"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('optionTitle', {
                          rules: [{required: true, message: '请输入选项标题'}],
                        })(<Input style={{ width: '60%' }}/>)}
                      </FormItem>
                      {TelType == true && <Row span={24}>
                        <Col span={16} style={{float:'right'}}>
                          <span>已关联联系人选项：</span>
                          <Button type="primary" size="small" onClick={deleteContact}>
                            {buttonText.split("@@")[2] != undefined ? buttonText.split("@@")[2] : buttonText}<Icon
                            type="close"/>
                          </Button>
                        </Col>
                      </Row>}
                      <FormItem
                        {...formItemLayoutOne}
                        label={<span>收录进联系人档案选项 <Icon type="question-circle-o" style={{color:"#428BCA"}}/></span>}
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('contactType', {
                          initialValue: buttonText == "" ? "-不关联-" : buttonText,
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
                        {getFieldDecorator('validators', {})(<Checkbox style={{ width: '60%' }}/>)}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutOne}
                        label="输入类型"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('inputType', {
                          initialValue: inputNumberTwo,
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
                      {inputTypeOption === "Select" ? <FormItem
                        {...formItemLayoutWithOutLabelOne}
                        style={{marginBottom:'10px' }}
                      >
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
                      </FormItem> : null}
                      {inputTypeOption === "FormRadioGroup" ? <FormItem
                        {...formItemLayoutWithOutLabelOne}
                        style={{marginBottom:'10px' }}
                      >
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
                      </FormItem> : null}
                      {inputTypeOption === "CheckboxGroup"  || inputTypeOption === "RadioAttach"? <FormItem
                        {...formItemLayoutWithOutLabelOne}
                        style={{marginBottom:'10px' }}
                      >
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
                      </FormItem> : null}

                      {inputTypeOption === "FormLink" ? <FormItem
                        {...formItemLayoutWithOutLabelOne}
                        style={{marginBottom:'10px' }}
                      >

                          <div>
                            <p>请输入链接地址,注意带http://前缀</p>
                            <FormItem
                              style={{marginBottom:'10px' }}
                            >
                              {getFieldDecorator('defaultLink', {})(<Input style={{ width: '60%' }}/>)}
                            </FormItem>
                          </div>

                      </FormItem> : null}
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
                                  <InputNumber  step="1" style={{ width: '40%' }}/>)}
                              </FormItem>
                              <FormItem  label={"最大值"}
                                         style={{marginBottom:'10px' }}
                              >
                                {getFieldDecorator('max', {initialValue: recordHideOne.max ?  recordHideOne.max:"",})(
                                  <InputNumber  step="1" style={{ width: '40%' }}/>)}
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
                                  <InputNumber  step="1" style={{ width: '40%' }}/>)}
                              </FormItem>
                              <FormItem  label={"最大长度"}
                                         style={{marginBottom:'10px' }}
                              >
                                {getFieldDecorator('max', {initialValue: recordHideOne.max ?  recordHideOne.max:"",})(
                                  <InputNumber  step="1" style={{ width: '40%' }}/>)}
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
                                    <InputNumber  step="1" style={{ width: '40%' }}/>)}
                                </FormItem>
                                <FormItem  label={"仪表读数最大值"}
                                           style={{marginBottom:'10px' }}
                                >
                                  {getFieldDecorator('readingsMax', {initialValue: recordHideOne.readingsMax ?  recordHideOne.readingsMax:"",})(
                                    <InputNumber  step="1" style={{ width: '40%' }}/>)}
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
                      {inputTypeOption === "FormDropdown" ? <FormItem
                        {...formItemLayoutWithOutLabelOne}
                        style={{marginBottom:'10px' }}
                      >

                          <div>
                            <p>选择数据表单</p>
                            <FormItem
                              style={{marginBottom:'10px' }}
                            >
                              {getFieldDecorator('value', {})(
                                <Select style={{ width: '60%' }}  onChange={getTableMatchColumns}>
                                  {dropdownInitDataOptions}
                                </Select>
                                )}
                            </FormItem>
                            <p>选择表中显示列</p>
                            <FormItem
                              style={{marginBottom:'10px' }}
                            >
                              {getFieldDecorator('dropdownValue', {initialValue: ""})(
                                <Select style={{ width: '60%' }}>
                                  {dropdownColumnOptions}
                                </Select>
                              )}

                            </FormItem>
                          </div>

                      </FormItem> : null}

                      <FormItem
                        {...formItemLayoutOne}
                        label="提示文字"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('alt', {})(<TextArea rows={4} style={{ width: '60%' }}/>)}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutOne}
                        label="系统外部是否隐藏?"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('outHiden',{initialValue:false})(
                          <RadioGroup>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </RadioGroup>)}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutOne}
                        label="分享数据搜索条件隐藏?"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('searchHiden',{initialValue:false})(
                          <RadioGroup>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </RadioGroup>)}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutOne}
                        label="分享数据排序条件隐藏?"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('orderHiden',{initialValue:false})(
                          <RadioGroup>
                          <Radio value={true}>是</Radio>
                          <Radio value={false}>否</Radio>
                        </RadioGroup>)}
                      </FormItem>
                      <FormItem
                        {...formItemLayoutOne}
                        label="数据公开隐藏?"
                        style={{marginBottom:'10px' }}
                      >
                        {getFieldDecorator('columnHiden',{initialValue:false})(
                          <RadioGroup>
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
                          rules: [{ required:true,message: '请输入字段英文名称'}],
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
                      <FormItem {...formItemLayoutWithOutLabelOne} style={{marginBottom:'10px' }}>
                        <Button type="primary" onClick={save} style={{marginRight:'10px' }}>保存</Button>
                        <Button onClick={onClear}>取消</Button>
                      </FormItem>
                    </form>
                  </div> :
                  <div className={stylesFrom.divOne}><Link onClick={onInsert} style={{color:"#909090"}}><Icon
                    type="plus"></Icon>添加新题目</Link></div>}
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" style={{marginLeft:'2%'}} onClick={handleOk}>提交</Button>
          </FormItem>
        </form>
        {updateModalVisit && <ColumnUpdateModal {...updateModalProps}/>}
      </div>
    </Modal>
  )
}

export default Form.create()(TableUpdateModal)
