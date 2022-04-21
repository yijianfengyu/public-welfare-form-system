import React from 'react'
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Modal,
  Tree,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Upload,
  Icon,
  Tabs,
  Transfer,
  Button,
  message,
  Select,
} from 'antd'
import {warning} from '../../utils/common'
import moment from "moment"
import {request, config} from 'utils'
const {api} = config
const {pohtoUpload} = api
const {dingding} = api
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;

//当前角色当前用户的权限

const x = 3;
const y = 2;
const z = 1;
let gData = [];
let lastSelectMenu = '';

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({title: key, key});
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const loop = menus2 => menus2.map((item) => {
  if (item.children) {
    return (
      <TreeNode key={item.key} title={item.title}>
        {loop(item.children)}
      </TreeNode>
    );
  }
  return <TreeNode key={item.key} title={item.title}/>;
});

const DetailModal = ({
  mockData, targetKeys, roleMenu,
  salesUnderling, accountantUnderling, purchaserUnderling, warehouseUnderling,
  treeMenu, roleName, defaultMenu, data, companyList, dateTime, modalType,
  dispatch, fileList,currentItem={},
  form: {
    getFieldDecorator,
    validateFields,
  },
  ...modalProps
}) => {
  const TabPane = Tabs.TabPane;
  let roleOptionsbyBoss = ["sales","warehouse","boss","accountant","purchaser"];
  let roleOptionsbyAccountant = ["sales","warehouse","accountant","purchaser"];
  let ownerOptions = [];
  let roleOptions;
  //穿梭框
  const staffStatusOptions = ['ACTIVE', 'INACTIVE'];
  const dataStatusOptions = ['VISIBLE', 'INVISIBLE'];
  let roles = JSON.parse(sessionStorage.getItem("userStorage")).role
  let isBoss = roles.toString().indexOf("boss") >= 0       //是否Boss
  let isAccountant = roles.toString().indexOf("accountant") >= 0       //是否财务
  //currentItem = JSON.parse(sessionStorage.getItem("currentUser"))
  if (isBoss) {
    roleOptions = roleOptionsbyBoss
  } else if(isAccountant){
    roleOptions = roleOptionsbyAccountant
  } else{
    roleOptions = roles
  }
  let company=[]
  if(companyList != ""){
    company.push(companyList[0].code)
  }
  for (var j in companyList) {
    ownerOptions.push(<Option key={companyList[j].code}>{companyList[j].code}</Option>);
  }

  function onSave() {
    validateFields((errors, value) => {
      if (errors) {
        return
      }
      value.birthday = (value.birthday == "" || null == value.birthday) ? null : (dateTime == "" || dateTime == null ? currentItem.birthday : dateTime)
      let photot
      if (value.photo != undefined) {
        photot = value.photo.file.response
      }
      value.photo = photot
      value.dateTime = (value.dateTime == "" || null == value.dateTime) ? null : (dateTime == "" || dateTime == null ? currentItem.dateTime : null)
      if (modalType == "update") {
        value.id = currentItem.id
        if(value.photo != undefined){
            value.photo= value.photo
        }else{
          value.photo=currentItem.photo
        }
      }

      value.password = value.password == "" ? null : value.password
      value.confirmPw = value.confirmPw == "" ? null : value.confirmPw
      value.oldEmail = currentItem.email
      value.oldUserName = currentItem.userName
      if (value.password == value.confirmPw) {
        dispatch({
          type: `user/${modalType}`,
          payload: {value}
        })
        dispatch({
          type: "user/userDetail", payload: {
            defaultMenu: [],

          }
        })
      } else {
        warning("两次密码不一样，请重新输入！")
      }
    })

  }

  function handleCancel() {
    dispatch({
      type: "user/hideDetailModal", payload: {
        currentItem: [],
        dateTime: "",
        targetKeys: [],
        filelist: '',
      }
    })

    dispatch({
      type: "userDetail/querySuccess", payload: {
        defaultMenu: [],
        mockData: [],
        targetKeys: [],
      }
    })


  }

  const modalOpts = {
    ...modalProps,
    onCancel: handleCancel,
  }

  function dateChange(data, dataString) {
    dispatch({
      type: "user/querySuccess", payload: {
        dateTime: dataString
      }
    })
  }

  //菜单名称点击事件  由于连续点击同一菜单选项时，结果不一样，所以下面对于连续点击同一菜单做了处理
  function onSelect(selectedKeys, e) {
    if (selectedKeys != 'root') {
      let thisSelect = '';
      if (e.selected && selectedKeys != '') {
        lastSelectMenu = selectedKeys;
      } else {
        selectedKeys = lastSelectMenu;
      }
      if (selectedKeys != '') {
        thisSelect = selectedKeys;
      } else {
        thisSelect = lastSelectMenu;
      }
      //判断当前选中菜单的状态  为空：设为YES 不为空 设为NO
      let selection = defaultMenu.filter(item=> {
        return item == thisSelect
      })
      let display;
      if (selection == '') {
        display = 'YES';
      } else {
        display = 'NO';
      }
      dispatch({
        type: 'userDetail/updateMenu',
        payload: {
          staffId: data.id,
          display: display,
          menuId: thisSelect[0],
          roleName: roleName,
        },
      })
    }

  }

  //菜单复选框点击事件
  function onCheck(checkedKeys, e) {
    if (e.node.props.eventKey != 'root') {
      let display;
      if (e.checked) {
        display = 'YES';
      } else {
        display = 'NO';
      }
      dispatch({
        type: 'userDetail/updateMenu',
        payload: {
          staffId: data.id,
          display: display,
          menuId: e.node.props.eventKey,
          roleName: roleName,
        },
      })
    }


  }

  //角色radio点击事件
  function onSearch(value) {
    let role;
    if (value.target == 'undefined') {
      role = value;
    } else {
      role = value.target.value;
    }

    const o = document.getElementsByClassName("tree")
    o[0].style.display = 'block';
    dispatch({
      type: 'userDetail/queryMenu',
      payload: {
        id: data.id,
        roleName: role,
      },
    })
  }

  function searchUnderlying(target) {

    let mockDatas = []
    let targetKey = []
    let unUnderling = []
    let underlings = []

    if ("sales" == target.target.value) {
      unUnderling = salesUnderling
    } else if ("purchaser" == target.target.value) {
      unUnderling = purchaserUnderling
    } else if ("warehouse" == target.target.value) {
      unUnderling = warehouseUnderling
    } else if ("accountant" == target.target.value) {
      unUnderling = accountantUnderling
    }

    //穿梭框左边的数据构造  下属
    for (let i = 0; i < unUnderling.length; i++) {
      mockDatas.push({
        key: i.toString(),
        title: `${unUnderling[i]}`,
        description: `${unUnderling[i]}`,
      });
    }
    if (null != currentItem.underling) {
      underlings = currentItem.underling.split(",")
      //穿梭框右边的数据构造  已有下属
      targetKey = mockDatas.filter(v => underlings.includes(v.title))
        .map(item => item.key);
    }


    dispatch({
      type: 'userDetail/querySuccess',
      payload: {
        mockData: mockDatas,
        targetKeys: targetKey,
      },
    })
  }

  function setUnderlying(nextTargetKeys, direction, moveKeys) {
    let sub = [];

    let u = mockData.filter(v => moveKeys.includes(v.key))
      .map(item => item.title);
    // 判断当前员工是否已有下属，并且是否数量已达上限
    if (null != currentItem.underling && "" != currentItem.underling || "left" == direction) {
      if (currentItem.underling.split(",").length < currentItem.underlingMaxNum || "left" == direction) {

        if (moveKeys.length <= currentItem.underlingMaxNum - currentItem.underling.split(",").length || "left" == direction) {
          sub = currentItem.underling.split(",").concat(u).filter(function (v) {
            return currentItem.underling.split(",").indexOf(v) === -1 || u.indexOf(v) === -1
          })

          if (sub.toString().indexOf("") >= 0) {
            sub = sub.filter(s=>s != "")
          }

          dispatch({
            type: "userDetail/updateUnderling",
            payload: {
              underling: sub.toString(),
              id: currentItem.id
            }
          });

          dispatch({
            type: 'userDetail/querySuccess',
            payload: {
              targetKeys: nextTargetKeys,
              currentItem: currentItem
            },
          })
        } else if ("right" == direction) {
          message.info("当前选择的下属数量已达上限");
        }
      } else if ("right" == direction) {
        message.info("下属数量已达上限");
      }

    } else if ("right" == direction && currentItem.underlingMaxNum > 0) {
      if (moveKeys.length <= currentItem.underlingMaxNum) {
        sub = u

        if (sub.toString().indexOf("") >= 0) {
          sub = sub.filter(s=>s != "")
        }

        dispatch({
          type: "userDetail/updateUnderling",
          payload: {
            underling: sub.toString(),
            id: currentItem.id
          }
        });

        dispatch({
          type: 'userDetail/querySuccess',
          payload: {
            targetKeys: nextTargetKeys,
            currentItem: currentItem
          },
        })
      } else if ("right" == direction) {
        message.info("当前选择的下属数量已达上限");
      }

    } else if ("right" == direction) {
      message.info("下属数量已达上限");
    }


    currentItem.underling = sub.toString()
    sessionStorage.setItem("currentUser", JSON.stringify(currentItem))

  }

  //上传图片
  function filter(file) {
    const {name, response, uid, status} = file;
    return {name, url: response.data, uid, status};
  };
  function Change1(info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-2);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });
    if (info.file.status === 'done') {
      message.info("上传log成功！");
    } else if (info.file.status === 'error') {
      message.info("上传log失败！");
    }
    dispatch({
      type: 'customer/querySuccess',
      payload: {
        fileList: fileList,
      },
    })
  }

  function beforeUpload(file){
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (isJPG || isPNG) {
      return isJPG || isPNG
    } else {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isPNG;
  }

  fileList = [{
    uid: -1,
    name: currentItem.photo,
    status: 'done',
    url: dingding + currentItem.photo + "?code_key=" + sessionStorage.getItem("code"),
    thumbUrl: dingding + currentItem.photo + "?code_key=" + sessionStorage.getItem("code"),
  }]
  let code = sessionStorage.getItem("code")
  let user=new Object()
  user.code_key=code
  let aa=pohtoUpload+"?code_key="+code
  const props = {
    name: 'file',
    action:aa ,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'authorization': 'authorization-text'
    },
    method: 'get',
    showUploadList: true,
    multiple: true,
    listType: 'picture',
    onChange: Change1,
    data:user,
    defaultFileList: currentItem.photo == undefined ? null : fileList,
    beforeUpload: beforeUpload,
  }
  return (
    <Modal {...modalOpts}>
      <div>
        <Tabs type="card" defaultActiveKey={"1"}>
          <TabPane tab="Basic Info" key="1">
            <Row>
              <Button style={{marginLeft: "93px", marginBottom: "10px"}} onClick={onSave}>Save Edit</Button>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="RealName" labelCol={{span: "6"}}>
                  {getFieldDecorator('realName', {
                    initialValue: currentItem.realName,
                    rules: [{required: true,},],
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="UserName" labelCol={{span: "6"}}>
                  {getFieldDecorator('userName', {
                    initialValue: currentItem.userName,
                    rules: [{required: true,},],
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Tel" labelCol={{span: "6"}}>
                  {getFieldDecorator('tel', {
                    initialValue: currentItem.tel,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="PW" labelCol={{span: "6"}}>
                  {getFieldDecorator('password', {
                    //initialValue: currentItem.password,
                    rules: [{required: modalType == "update" ? false : true},],
                  })(<Input size="default" type="password" style={{width: "250px"}}
                            disabled={modalType == "update" && isAccountant && !isBoss }/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="ConfirmPW" labelCol={{span: "6"}}>
                  {getFieldDecorator('confirmPw', {
                    //initialValue: currentItem.password,
                    rules: [{required: modalType == "update" ? false : true},],
                  })(<Input size="default" type="password" style={{width: "250px"}}
                            disabled={modalType == "update" && isAccountant && !isBoss }/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Cell" labelCol={{span: "6"}}>
                  {getFieldDecorator('cell', {
                    initialValue: currentItem.cell,
                    rules: [{required: modalType == "update" ? false : true}]
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="Email" labelCol={{span: "6"}}>
                  {getFieldDecorator('email', {
                    initialValue: currentItem.email,
                    rules: [{
                      required: true,
                      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                      message: "The input is not valid E-mail!"
                    }]
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Email PW" labelCol={{span: "6"}}>
                  {getFieldDecorator('emailPassword', {
                    initialValue: currentItem.emailPassword,
                  })(<Input size="default" type="password" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="MSN" labelCol={{span: "6"}}>
                  {getFieldDecorator('msn', {
                    initialValue: currentItem.msn,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="入职日期" labelCol={{span: "6"}}>
                  {getFieldDecorator('birthday', {
                    initialValue: currentItem.birthday == "" || currentItem.birthday == null ? null : moment(currentItem.birthday),
                    rules: [{required: modalType == "update" ? false : true},],
                  })(<DatePicker size="default" onChange={dateChange} style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Title" labelCol={{span: "6"}}>
                  {getFieldDecorator('title', {
                    initialValue: currentItem.title,
                    rules: [{required: modalType == "update" ? false : true}]
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Fax" labelCol={{span: "6"}}>
                  {getFieldDecorator('fax', {
                    initialValue: currentItem.fax,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="Salary" labelCol={{span: "6"}}>
                  {getFieldDecorator('salary', {
                    initialValue: currentItem.salary,
                    rules: [{required: true}],
                  })(<Input size="default" style={{width: "250px"}} disabled={!(isBoss || isAccountant)}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="下属数量" labelCol={{span: "6"}}>
                  {getFieldDecorator('underlingMaxNum', {
                    initialValue: modalType == "update" ? currentItem.underlingMaxNum : 0,
                    rules: [{required: true,},],
                  })(<InputNumber size="default" min={0} max={1000} type="number" id="maxNum"
                                  style={{width: "250px"}} disabled={!isBoss}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="Roles" labelCol={{span: "3"}}>
                  {getFieldDecorator('role', {
                    initialValue: modalType == "update" ? currentItem.role.split(",") : ["sales"],
                    rules: [{required: true}]
                  })(<CheckboxGroup size="default" options={roleOptions}
                                    disabled={modalType == "update" && !isAccountant && !isBoss } />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Status" labelCol={{span: "6"}}>
                  {getFieldDecorator('staffStatus', {
                    initialValue: modalType == "update" ? currentItem.staffStatus : "ACTIVE",
                    rules: [{required: true,},],
                  })(
                    <Radio.Group size="default" options={staffStatusOptions}
                                 disabled={modalType == "update" && !isAccountant && !isBoss } >
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="所属分公司" labelCol={{span: "3"}}>
                  {getFieldDecorator('companyBranch', {
                    initialValue: modalType == "update" ? currentItem.companyBranch.split(",") : company,
                    rules: [{required: true}]
                  })(
                    <Select mode="multiple" size='default' style={{width: "620px"}}  disabled={modalType == "update" && isAccountant && !isBoss } >
                  {ownerOptions}
                    </Select>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="DataStatus" labelCol={{span: "6"}}>
                  {getFieldDecorator('dataStatus', {
                    initialValue: modalType == "update" ? currentItem.dataStatus : "VISIBLE",
                    rules: [{required: true}],
                  })(<Radio.Group size="default" options={dataStatusOptions}
                                  disabled={modalType == "update" && isAccountant && !isBoss }>
                  </Radio.Group>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="EmergencyTel" labelCol={{span: "6"}}>
                  {getFieldDecorator('emergeTel', {
                    initialValue: currentItem.emergeTel,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="City" labelCol={{span: "6"}}>
                  {getFieldDecorator('city', {
                    initialValue: currentItem.city,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Home Tel" labelCol={{span: "6"}}>
                  {getFieldDecorator('homeTel', {
                    initialValue: currentItem.homeTel,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="Signture" labelCol={{span: "6"}}>
                  {getFieldDecorator('signature', {
                    initialValue: currentItem.signature,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Address" labelCol={{span: "6"}}>
                  {getFieldDecorator('address', {
                    initialValue: currentItem.address,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="Bank Card No" labelCol={{span: "6"}}>
                  {getFieldDecorator('cardNo', {
                    initialValue: currentItem.cardNo,
                  })(<Input size="default" style={{width: "250px"}} disabled={!(isBoss || isAccountant)}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="身份证照片" labelCol={{span: "6"}}>
                  {getFieldDecorator('photo', {})(
                    <Upload {...props}>
                      <Button style={{width: "250px"}}>
                        <Icon type="upload"/> Click to Upload
                      </Button>
                    </Upload>
                  )}
                </FormItem>
              </Col>
              <Col span={8}></Col>
              <Col span={8}></Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="Card Address" labelCol={{span: "6"}}>
                  {getFieldDecorator('cardAddress', {
                    initialValue: currentItem.cardAddress,
                  })(<Input size="default" style={{width: "250px"}}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="身份证" labelCol={{span: "6"}}>
                  {getFieldDecorator('creditNo', {
                    initialValue: currentItem.creditNo,
                  })(<Input size="default" style={{width: "250px"}} disabled={!(isBoss || isAccountant)}/>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="身份证地址" labelCol={{span: "6"}}>
                  {getFieldDecorator('creditAddress', {
                    initialValue: currentItem.creditAddress,
                  })(<Input size="default" style={{width: "250px"}} disabled={!(isBoss || isAccountant)}/>)}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          {modalType == "update" && (isBoss || isAccountant) &&
          <TabPane tab="Permission Info" key="2">
            <Row>
              <Col style={{textAlign: "center"}} span={11}>
                <span style={{fontSize: "16", fontWeight: "bold"}}>菜单管理</span>
              </Col>
              <Col style={{textAlign: "center"}} span={13}>
                <span style={{fontSize: "16", fontWeight: "bold"}}>下属管理</span>
              </Col>
            </Row>
            <Row>
              <Col style={{textAlign: "left"}} span={11}>
                <Radio.Group size="default" options={roleMenu} onChange={onSearch}>
                </Radio.Group>
              </Col>
              <Col style={{textAlign: "left"}} span={13}>
                <Radio.Group size="default" options={roleMenu.filter(item=>item != "boss")} onChange={searchUnderlying}>
                </Radio.Group>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <div style={{
                  border: "1px solid gainsboro",
                  width: "250px",
                  height: "425px",
                  margin: "10px auto 0px auto",
                  overflowY:"scroll"
                }}>
                  <div className="tree" style={{

                    display: "none",

                  }}>
                    <Tree
                      checkable
                      checkedKeys={defaultMenu}
                      checkStrictly
                      onSelect={onSelect}
                      onCheck={onCheck}
                    >
                      {loop(treeMenu)}
                    </Tree>
                  </div>
                </div>
              </Col>
              <Col span={13}>
                <Transfer
                  showSearch
                  titles={['非下属', '下属']}
                  dataSource={mockData}
                  targetKeys={targetKeys}
                  operations={["设为下属", '取消下属']}
                  render={mockData =>mockData.title}
                  onChange={setUnderlying}
                  listStyle={{
                    marginTop: 10,
                    width: 180,
                    height: 425
                  }}
                />
              </Col>
            </Row>
          </TabPane>
          }

        </Tabs>
      </div>
    </Modal>
  )
}


export default Form.create()(DetailModal)
