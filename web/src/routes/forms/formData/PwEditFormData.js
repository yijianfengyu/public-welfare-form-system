import React from 'react'
import {Form as SchemaForm, loader} from 'subschema';
import {Button, Input, Row, Modal, Col,Form} from 'antd'
import styless from '../../operationFrom/formStyle.less'
import {connect} from 'dva'

const FormItem = Form.Item;
const PwEditFormData = ({
                          dispatch,
                          shareData,
                          form: {
                            getFieldDecorator,
                            validateFieldsAndScroll,
                            getFieldValue,
                            setFieldsValue
                          },
                        }) => {

  const {tempTableListId, rowData,vertifyError} = shareData;

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 6,
      },
    },
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  var obj;
  let form;
  if (!tempTableListId||!tempTableListId.define) {
    obj = null;
  } else {
    obj = JSON.parse(tempTableListId.define);
    form = <div>
      <div className={styless.divTitleTwo}>
        <span>{tempTableListId.formTitle}</span>
      </div>
      <SchemaForm schema={obj} onSubmit={handleSubmit} value={rowData} disabled="true"/>
      <div style={{clear: "both"}}></div>
    </div>
  }

  function handleSubmit(e, errors, value) {
    var arr = Object.getOwnPropertyNames(errors);
    if (arr.length > 0) {
    } else if (arr.length == 0) {
      if (obj != null) {
        // 添加数据到定义文件中"values":{"col_data1":"ltl","col_data2":"ltl@qq.com","col_data3":"152"}
        obj["values"] = value;
        for (let item in value) {
          for (let colItem in obj["schema"]) {
            if (item == colItem) {
              obj["schema"][colItem]["value"] = value[item];
            }
          }
        }

      }
      //修改数据要带上缓存值vertify_modify_pw，服务器上回对比，对不上不更新数据
      dispatch({
        type: 'shareData/modifyFormDataByPw',
        payload: {
          vertify_modify_pw:sessionStorage.getItem("vertify_modify_pw"),
          id: rowData.id,
          define_id: rowData.define_id,
          define: JSON.stringify(obj),
          isPwEditFormDataVisiable: false,
        }
      })
    }
  }

  function handleCancel() {
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        isPwEditFormDataVisiable: false,
      }
    })
  }

  function submitPw() {
    validateFieldsAndScroll(
      (err,values) => {
        if(err){
          return ;
        }else{
          dispatch({
            type: 'shareData/vertifyPw',
            payload: {
              ...values,
              id: rowData.id,
              define_id: rowData.define_id,
              define: obj!=null?JSON.stringify(obj):null,
            }
          })
        }
      },
    );
  }

  let showVertifyModal=true;
  if(sessionStorage.getItem("vertify_modify_pw")){
    showVertifyModal=false;
  }else{
    //没有缓存
    if(vertifyError){
      //验证不通过
      showVertifyModal=true;
    }
    if(!vertifyError){
      //验证通过
      showVertifyModal=false;
    }
  }

  return <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="300"
      style={{margin:"0px 15px",height:"400px",overflow: "scroll"}}
      title="修改表单数据"
      maskClosable={false}
    >
      {showVertifyModal?<Row gutter={24}>
        <Col lg={24} xs={24}>
          <FormItem
            {...formItemLayout}
            label="密码:"
            hasFeedback
          >
            {getFieldDecorator('modifyPw', { rules: [{
                required: true,
                len:8,
                whitespace:true,
                message: '请输入8位数字密码',
              }],})(
              <Input type="number" placeholder="请输入8位数字密码" />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={submitPw} htmlType="submit">保存</Button>
          </FormItem>
        </Col>
      </Row>:form}
    </Modal>;
}
export default connect(({shareData, loading}) => ({shareData, loading}))(Form.create()(PwEditFormData))

