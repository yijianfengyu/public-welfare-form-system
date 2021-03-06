import React from 'react'
import {Form,Modal,Row,Col,Select,Input,Radio,DatePicker} from 'antd'
import moment from 'moment';
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const CreateModal = ({
  dispatch,
  updateValue,
  optionItem,
  recordIndex,
  tableList,
  principalName,
  provinceData,
  cityData,
  countyData,
  cities,
  countys,
  form: {
    getFieldDecorator,
    validateFields,
    },
  }) => {
  const provinceOptions = provinceData.map(province => <Option key={province}>{province}</Option>);
  const cityOptions = cities.map(city => <Option key={city}>{city}</Option>);
  const countyOptions = countys.map(county => <Option key={county}>{county}</Option>);

  function handleCancel() {
    dispatch({
      type: 'contactManagement/hideCreateModalVisit',
      payload: {
        updateValue: {}
      }
    })
  }

  function handleOk() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      for (var i in value) {
        if (value[i] instanceof moment == true) {
          value[i] = value[i].format('YYYY-MM-DD HH:mm:ss');
        }
      }
      value.principalName = principalName;
      let province = value.province != undefined ? value.province : "";
      let city = value.city != undefined ? value.city : "";
      let county = value.county != undefined ? value.county : ""
      let others = value.others != undefined ? value.others : ""
      let obj = {
        province: province,
        city: city,
        county: county,
        others: others,
      }
      value.area = JSON.stringify(obj)
      dispatch({
        type: 'contactManagement/insertContactOne',
        payload: {
          value
        }
      })
    })
  }

  function handleUpdate() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      for (var i in value) {
        if (value[i] instanceof moment == true) {
          value[i] = value[i].format('YYYY-MM-DD HH:mm:ss');
        }
      }
      value.id = updateValue.id;
      value.principalName = principalName;
      let province = value.province != undefined ? value.province : "";
      let city = value.city != undefined ? value.city : "";
      let county = value.county != undefined ? value.county : ""
      let others = value.others != undefined ? value.others : ""
      let obj = {
        province: province,
        city: city,
        county: county,
        others: others,
      }
      value.area = JSON.stringify(obj)
      dispatch({
        type: 'contactManagement/UpdateContactOne',
        payload: {
          value,
          recordIndex: updateValue.recordIndex,
          tableList: tableList,
        }
      });
    })
  }

  function handleChange(value, option) {
    dispatch({
      type: 'contactManagement/querySuccess',
      payload: {
        principalName: option.props.children
      }
    })
  }

  const formItemLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 17},
  };

  function handleProvinceChange(value) {
    let provinceDataIndex;
    for (var i in provinceData) {
      if (value == provinceData[i]) {
        provinceDataIndex = i
      }
    }
    dispatch({
      type: 'contactManagement/querySuccess',
      payload: {
        cities: cityData[provinceData[provinceDataIndex]],
      }
    })
  }

  function onSecondCityChange(value) {
    dispatch({
      type: 'contactManagement/querySuccess',
      payload: {
        countys: countyData[value]
      }
    })
  }

  function onCountyChange(value) {

  }

  return (
    <Modal
      visible
      onCancel={handleCancel}
      okText="??????"
      width="1100px"
      onOk={JSON.stringify(updateValue) != '{}'?handleUpdate:handleOk}
      title={JSON.stringify(updateValue) != '{}'?"???????????????":"???????????????"}
      maskClosable={false}
    >
      <Row gutter={24}>
        <Col xs={24} sm={8}>
          <FormItem
            style={{backgroundColor: '#F2F4F6',textAlign:'center'}}>
            <span>????????????</span>
          </FormItem>

          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              initialValue: updateValue.name != undefined ? updateValue.name : "",
              rules: [{required: true, message: '???????????????'}],
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>


          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('email', {
              initialValue: updateValue.email != undefined ? updateValue.email : "",
              rules: [{required: true, message: '???????????????'}],
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>

          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('tel', {
              initialValue: updateValue.tel != undefined ? updateValue.tel : "",
              rules: [{required: true, message: '?????????????????????'}],
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>


          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('birthdate', {
              initialValue: updateValue.birthdate != undefined && updateValue.birthdate != "" ? updateValue.birthdate : "",
            })
            (<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" size='default' style={{width: "100%"}}/>)}
          </FormItem>


          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('sex', {
              initialValue: updateValue.sex != undefined ? updateValue.sex : "",
            })
            (
              <RadioGroup>
                <Radio value="???">???</Radio>
                <Radio value="???">???</Radio>
              </RadioGroup>
            )}
          </FormItem>


          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('identityCard', {
              initialValue: updateValue.identityCard != undefined ? updateValue.identityCard : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>


          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('serialNumber', {
              initialValue: updateValue.serialNumber != undefined ? updateValue.serialNumber : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>
          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('addDate', {
              initialValue: updateValue.addDate != undefined ? updateValue.addDate : "",
            })(
              <DatePicker showTime disabled={JSON.stringify(updateValue) != '{}'?true:false}
                          format="YYYY-MM-DD HH:mm:ss" size='default' style={{width: "100%"}}/>
            )}
          </FormItem>
          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('province', {
              initialValue: updateValue.province != undefined ? updateValue.province : "",
            })(
              <Select size='default' style={{ width: "30%",marginRight:'10px'}} onChange={handleProvinceChange}>
                {provinceOptions}
              </Select>
            )}
            {getFieldDecorator('city', {
              initialValue: updateValue.city != undefined ? updateValue.city : "",
            })(
              <Select size="default" onChange={onSecondCityChange} style={{ width: "30%",marginRight:'10px'}}>
                {cityOptions}
              </Select>
            )}
            {getFieldDecorator('county', {
              initialValue: updateValue.county != undefined ? updateValue.county : "",
            })(
              <Select size="default" onChange={onCountyChange} style={{ width: "30%"}}>
                {countyOptions}
              </Select>
            )}
            {getFieldDecorator('others', {
              initialValue: updateValue.others != undefined ? updateValue.others : "",
            })(
              <Input placeholder="????????????" size='default' style={{width: "100%"}}/>
            )}
          </FormItem>
          <FormItem
            label="??????????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('lastActiveDate', {
              initialValue: updateValue.lastActiveDate != undefined ? updateValue.lastActiveDate : "",
            })(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" size='default' style={{width: "100%"}}/>
            )}
          </FormItem>
        </Col>
        <Col xs={24} sm={8}>
          <FormItem
            style={{backgroundColor: '#F2F4F6',textAlign:'center'}}>
            <span>??????/????????????</span>
          </FormItem>

          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('secondPhone', {
              initialValue: updateValue.secondPhone != undefined ? updateValue.secondPhone : "",
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>


          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('secondaryEmail', {
              initialValue: updateValue.secondaryEmail != undefined ? updateValue.secondaryEmail : "",
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>


          <FormItem
            label="QQ"
            {...formItemLayout}
          >
            {getFieldDecorator('qq', {
              initialValue: updateValue.qq != undefined ? updateValue.qq : "",
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>

          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('wechat', {
              initialValue: updateValue.wechat != undefined ? updateValue.wechat : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )}
          </FormItem>


          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('description', {
              initialValue: updateValue.description != undefined ? updateValue.description : "",
            })
            (
              <TextArea rows={4} size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>

          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('principal', {
              initialValue: updateValue.principal != undefined ? updateValue.principal : "",
            })
            (
              <Select size="default" style={{width: "100%"}} onSelect={handleChange}>
                {optionItem}
              </Select>
            )
            }
          </FormItem>
          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('other1', {
              initialValue: updateValue.other1 != undefined ? updateValue.other1 : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>
          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('other2', {
              initialValue: updateValue.other2 != undefined ? updateValue.other2 : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>
          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('other3', {
              initialValue: updateValue.other3 != undefined ? updateValue.other3 : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>
          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('other4', {
              initialValue: updateValue.other4 != undefined ? updateValue.other4 : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>
          <FormItem
            label="?????????"
            {...formItemLayout}
          >
            {getFieldDecorator('other5', {
              initialValue: updateValue.other5 != undefined ? updateValue.other5 : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>

        </Col>
        <Col xs={24} sm={8}>
          <FormItem
            style={{backgroundColor: '#F2F4F6',textAlign:'center'}}>
            <span>????????????</span>
          </FormItem>

          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('organizationNames', {
              initialValue: updateValue.organizationNames != undefined ? updateValue.organizationNames : "",
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>

          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('address', {
              initialValue: updateValue.address != undefined ? updateValue.address : "",
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>

          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('postcode', {
              initialValue: updateValue.postcode != undefined ? updateValue.postcode : "",
            })
            (<Input size='default' style={{width: "100%"}}/>)}
          </FormItem>

          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('unitPosition', {
              initialValue: updateValue.unitPosition != undefined ? updateValue.unitPosition : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>

          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('department', {
              initialValue: updateValue.department != undefined ? updateValue.department : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>

          <FormItem
            label="????????????"
            {...formItemLayout}
          >
            {getFieldDecorator('workTelephone', {
              initialValue: updateValue.workTelephone != undefined ? updateValue.workTelephone : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>

          <FormItem
            label="??????"
            {...formItemLayout}
          >
            {getFieldDecorator('fax', {
              initialValue: updateValue.fax != undefined ? updateValue.fax : "",
            })
            (
              <Input size='default' style={{width: "100%"}}/>
            )
            }
          </FormItem>

        </Col>
      </Row>
    </Modal>
  )
}

export default Form.create()(CreateModal)
