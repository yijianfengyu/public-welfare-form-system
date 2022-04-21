import React from 'react'
import { Link } from 'dva/router'
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
  InputNumber,
} from 'antd'
import TableUtils from '../../utils/TableUtils'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const { TextArea } = Input
const UpdateModal = ({

  dispatch,
  examQuestion,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
    setFieldsValue,
  },
}) => {
  const {
    defaultColumnType,
    column,
    inputOptions,
    dropdownInitData,
    columnLabel,
  } = examQuestion
  column.oldColumnName = column.columnName
  console.log('888888', defaultColumnType, inputOptions)

  let labelOptions = examQuestion.labelList.map((item, index) => {
    return <Option key={index} value={item.key}>{item.key}</Option>
  })
  labelOptions.unshift(<Option key={9999} value=''></Option>)

  const formItemLayoutOne = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    },
  }

  //自动生成input
  // console.log("---传入的更新列----",inputOptions);
  getFieldDecorator('keys', { initialValue: [] })
  if (inputOptions.length != 0) {
    getFieldDecorator('keys', { initialValue: inputOptions })
  }
  //删除input
  const deleteInput = (k) => {
    const keys = getFieldValue('keys')
    let delOptionUuid = keys[k].option.uuid
    setFieldsValue({
      keys: keys.filter(key => key.k !== k),
    })
    console.log('--删除了单选选项--')
  }
  //添加input
  const addInput = () => {
    const keys = getFieldValue('keys')
    const options = getFieldValue('options')
    let index = options ? options.length + 1 : 0
    let uuid = new Date().getTime() + ''
    const nextKeys = keys.concat({ k: index, option: { option: '', score: '', uuid } })
    setFieldsValue({
      keys: nextKeys,
    })
  }

  const getTableMatchColumns = (value) => {
    dispatch({
      type: 'examQuestion/getTableMatchColumns', payload: {
        dropdownTableName: value,
      },
    })
  }
  const keys = getFieldValue('keys')
  const formItems = keys.map((item, index) => {
    return TableUtils.createOptions(getFieldDecorator, item, index, deleteInput)
  })

  //生成数据下拉菜单的dropdownInitData， @TODO 地区需要做解析cascadeInitData
  const dropdownInitDataOptions = !dropdownInitData ? [] : dropdownInitData.map((item, index) => {
    return <Option key={'ddo_' + index} value={item.value}>{item.name}</Option>
  })

  //格式化并保存列描述的json格式
  function save () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      //生成字段json描述
      let columnTemp = TableUtils.createFormColumnJson(values, column.col_data, column)
      console.log('---字段修改----生成的字段描述---', columnTemp)
      if (!columnTemp.uuid) {
        columnTemp.uuid = new Date().getTime();
      }
      dispatch({
        type: 'examQuestion/updateExamQuestion',
        payload: {
          column: columnTemp,
          inputOptions: [],
          defaultColumnType: 'FormInput',
          updateIndex: examQuestion.updateIndex,
          updateType: examQuestion.updateType,
        },
      })
      setFieldsValue({
        keys: [],
      })
    })
  }

  function handleChange (value) {
    dispatch({
      type: 'examQuestion/querySuccess',
      payload: {
        defaultColumnType: value,
        inputOptions: [],
      },
    })
    setFieldsValue({
      keys: [],
      inputType: value,
    })
  }

  function handleCancel () {
    dispatch({
      type: 'examQuestion/querySuccess',
      payload: {
        column: {},
        defaultColumnType: 'FormInput',
        inputOptions: [],
        updateModalVisit: false,
        updateType: '',
        /*        inputNumberTwo: "Text",
                disabledSelect: false,
                TelType:false,
                buttonText:""*/
      },
    })

  }


  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="500px"
      title="修改答卷题目"
      maskClosable={false}
    >
      <form>
        <FormItem
          {...formItemLayoutOne}
          label="选项标题"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('optionTitle', {
            initialValue: column.title,
            rules: [{ required: true, message: '请输入选项标题' }],
          })(<Input style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="选择分类"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('label', {
            initialValue: columnLabel,
            rules: [{ message: '请选择分类' }],
          })(
            <Select placeholder="请选择分类" className="margin-right margin-bottom" style={{ width: '60%' }} size='default'>
              {labelOptions}
            </Select>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayoutOne}
          label="必填选项"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('validators', {
            initialValue: column.validators != undefined ? true : false,
          })(<Checkbox defaultChecked={column.validators != undefined ? true : false}
                       style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="输入类型"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('inputType', {
            initialValue: defaultColumnType,
            rules: [{ required: true, message: '请选择输入类型' }],
          })(
            <Select
              style={{ width: 200 }}
              onChange={handleChange}
              //disabled={disabledSelect}
            >
              {TableUtils.getFormElementOptions()}
            </Select>)}
        </FormItem>
        {defaultColumnType === 'Select' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{ marginBottom: '10px' }}>
                {getFieldDecorator('InputOption', {})(
                  <div>
                    <p>请输入选择项</p>
                    {formItems}
                    <FormItem
                      style={{ marginBottom: '10px' }}
                    >
                      {getFieldDecorator('optionZiDong', {
                        initialValue: '',
                      })(
                        <div>
                          <Button type="dashed" onClick={addInput} style={{ width: '60%' }}>
                            <Icon type="plus"/> 添加
                          </Button>
                        </div>,
                      )}
                    </FormItem>
                  </div>,
                )}
              </FormItem>
            </Col></Row> : null}
        {defaultColumnType === 'FormRadioGroup' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{ marginBottom: '10px' }}>
                {getFieldDecorator('InputOption', {})(
                  <div>
                    <p>请输入选择项</p>
                    {formItems}
                    <FormItem
                      style={{ marginBottom: '10px' }}
                    >
                      {getFieldDecorator('optionZiDong', {})(
                        <div>
                          <Button type="dashed" onClick={addInput} style={{ width: '60%' }}>
                            <Icon type="plus"/> 添加
                          </Button>
                        </div>,
                      )}
                    </FormItem>
                  </div>,
                )}
              </FormItem>
            </Col></Row> : null}
        {defaultColumnType === 'CheckboxGroup' || defaultColumnType === 'RadioAttach' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{ marginBottom: '10px' }}>
                {getFieldDecorator('InputOptions', {})(
                  <div>
                    <p>请输入选择项</p>
                    {formItems}
                    <FormItem
                      style={{ marginBottom: '10px' }}
                    >
                      {getFieldDecorator('addFile', {})(
                        <div>
                          <Button type="dashed" onClick={addInput} style={{ width: '60%' }}>
                            <Icon type="plus"/> 添加
                          </Button>
                        </div>,
                      )}
                    </FormItem>
                  </div>,
                )}
              </FormItem>
            </Col></Row> : null}

        {defaultColumnType === 'FormLink' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{ marginBottom: '10px' }}>
                <div>
                  <p>请输入链接地址,注意带http://前缀</p>
                  <FormItem
                    style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('defaultLink', { initialValue: column.defaultLink ? column.defaultLink : '' })(
                      <Input style={{ width: '60%' }}/>)}
                  </FormItem>
                </div>
              </FormItem>
            </Col></Row> : null}
        {defaultColumnType === 'FormInt' || defaultColumnType === 'FormNumber' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <div>
                <FormItem label={'最小值'}
                          style={{ marginBottom: '10px' }}
                >
                  {getFieldDecorator('min', { initialValue: column.min ? column.min : '' })(
                    <InputNumber key={'min'} step="1" style={{ width: '40%' }}/>)}
                </FormItem>
                <FormItem label={'最大值'}
                          style={{ marginBottom: '10px' }}
                >
                  {getFieldDecorator('max', { initialValue: column.max ? column.max : '' })(
                    <InputNumber key={'max'} step="1" style={{ width: '40%' }}/>)}
                </FormItem>
              </div>
            </Col></Row> : null}

        {defaultColumnType === 'FormInput' || defaultColumnType === 'FormText' || defaultColumnType === 'FormDaily' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <div>
                <FormItem label={'最小长度'}
                          style={{ marginBottom: '10px' }}
                >
                  {getFieldDecorator('min', { initialValue: column.min ? column.min : '' })(
                    <InputNumber step="1" style={{ width: '40%' }}/>)}
                </FormItem>
                <FormItem label={'最大长度'}
                          style={{ marginBottom: '10px' }}
                >
                  {getFieldDecorator('max', { initialValue: column.max ? column.max : '' })(
                    <InputNumber step="1" style={{ width: '40%' }}/>)}
                </FormItem>
              </div>
            </Col></Row> : null}
        {defaultColumnType === 'FormMeasurement' ?
          <div>
            <Row gutter={24}>
              <Col span={8}>
              </Col>
              <Col span={16}>
                <div>
                  <FormItem label={'仪表读数最小值'}
                            style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('readingsMin', { initialValue: column.readingsMin ? column.readingsMin : '' })(
                      <InputNumber step="1" style={{ width: '40%' }}/>)}
                  </FormItem>
                  <FormItem label={'仪表读数最大值'}
                            style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('readingsMax', { initialValue: column.readingsMax ? column.readingsMax : '' })(
                      <InputNumber step="1" style={{ width: '40%' }}/>)}
                  </FormItem>
                </div>
              </Col></Row>
            <Row gutter={24}>
              <Col span={8}>
              </Col>
              <Col span={16}>
                <div>
                  <FormItem label={'稀释倍数最小值'}
                            style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('dilutionMin', { initialValue: column.dilutionMin ? column.dilutionMin : '' })(
                      <InputNumber style={{ width: '40%' }}/>)}
                  </FormItem>
                  <FormItem label={'稀释倍数最大值'}
                            style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('dilutionMax', { initialValue: column.dilutionMax ? column.dilutionMax : '' })(
                      <InputNumber style={{ width: '40%' }}/>)}
                  </FormItem>
                </div>
              </Col></Row>
          </div>

          : null}

        {defaultColumnType === 'FormDropdown' ?
          <Row gutter={24}>
            <Col span={8}>
            </Col>
            <Col span={16}>
              <FormItem style={{ marginBottom: '10px' }}>
                <div>
                  <p>选择数据表</p>
                  <FormItem
                    style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('value', { initialValue: column.value ? column.value : '' })(
                      <Select style={{ width: '60%' }} onChange={getTableMatchColumns}>
                        {dropdownInitDataOptions}
                      </Select>,
                    )}

                  </FormItem>
                  <p>选择表中显示列</p>
                  <FormItem
                    style={{ marginBottom: '10px' }}
                  >
                    {getFieldDecorator('dropdownValue', { initialValue: column.dropdownValue ? column.dropdownValue : '' })(
                      <Select style={{ width: '60%' }}>
                        {dropdownColumnOptions}
                      </Select>,
                    )}

                  </FormItem>
                </div>
              </FormItem>
            </Col></Row> : null}

        <FormItem
          {...formItemLayoutOne}
          label="提示文字"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('alt', {
            initialValue: column.placeholder == undefined ? '' : column.placeholder,
          })(<TextArea rows={4} style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="系统外部是否隐藏?"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('outHiden', {
            initialValue: column.outHiden ? column.outHiden : false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="分享数据搜索条件隐藏?"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('searchHiden', {
            initialValue: column.searchHiden ? column.searchHiden : false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="分享数据排序条件隐藏?"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('orderHiden', {
            initialValue: column.orderHiden ? column.orderHiden : false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="数据公开隐藏?"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('columnHiden', {
            initialValue: column.columnHiden ? column.columnHiden : false,
          })(<RadioGroup>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="字段英文名称(注意规范，中文无效)"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('columnName', {
            initialValue: column.columnName,
            rules: [{ message: '请输入字段英文名称' }],
          })(<Input style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem
          {...formItemLayoutOne}
          label="填写答案分值"
          style={{ marginBottom: '10px' }}
        >
          {getFieldDecorator('columnScore', {
            initialValue: column.columnScore,
            rules: [{ message: '请输入填写答案分值' }],
          })(<Input style={{ width: '60%' }}/>)}
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel} style={{ marginBottom: '10px' }}>
          <Button type="primary" onClick={save} style={{ marginRight: '10px' }}>保存</Button>
          <Button onClick={handleCancel}>取消</Button>
        </FormItem>
      </form>
    </Modal>
  )
}

export default (Form.create())(UpdateModal)

