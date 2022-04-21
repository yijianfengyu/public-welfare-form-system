import React from 'react';
import {Form,loader} from 'subschema';
import {Modal,message} from 'antd';
import styless from '../../../routes/operationFrom/formStyle.less'
import 'subschema-css-bootstrap/lib/style.css'
import TableUtils from '../../../utils/TableUtils'
const UpdateFormDataModal = ({
  location,dispatch,reacdDefind,reacdData,dataObjValue,subFormShow,
  }) => {

  let obj
  if (reacdDefind == "") {
    obj = null
  } else {
    obj = JSON.parse(reacdDefind);
    //console.log("----更新自定义表单数据:表定义：----",reacdDefind);
    for(let item in obj.schema){
      //let item=obj.schema[item];
      if(obj.schema[item].type=="FormRadioGroup"){
        //方便从表单里面发出事件到外部 TODO 需要改成函数，以适应用户端提交数据和管理端提交数据
        obj.schema[item].dispatch=function(params){
          dispatch({
            type: 'forms/subFormShowAdd',
            payload: {
                uuid:params.uuid,
                subUuid:params.subUuid,
            }
          });
        };
      }
      //TODO 都添加一个全局对象，包含要跳题的选项

      let col=obj.schema[item];
      if(col.p_option_uuid
        &&!(subFormShow&&subFormShow[col.p_uuid]&&subFormShow[col.p_uuid]==col.p_option_uuid)){
        delete obj.schema[item];
        obj.fieldsets.fields.splice(obj.fieldsets.fields.indexOf(item),1);
      }
    };
    //console.log("---跳表项处理后----",obj);

  }
  function handleOk(e, errors, value) {
    let arr = Object.getOwnPropertyNames(errors);
    let obj = JSON.parse(reacdDefind);
    if (arr.length > 0) {
      console.log("----修改后提交自定义表单数据发生异常----",errors,arr,value);
    } else if (arr.length == 0) {
      if (reacdData.status == 1) {
        message.warning("已审核不能修改")
      } else {
        console.log("----更新的数据为:",value);
        if (obj != null) {
          obj["values"] = value
        }
        console.log(obj);
        let check=TableUtils.checkInputMaxAndMin(obj.schema,value);
        if(!check.result){
          alert(check.mes);
          return
        }
        //TODO 校验数字大小字母长度
        if(location.state!=null){
          dispatch({
            type: 'forms/updateTempDatas',
            payload: {
              id: reacdData.id,
              define: JSON.stringify(obj),
              status: reacdData.status,
              //creator: user1,
              method: "update",
              define_id:location.state.id?location.state.id:reacdData.define_id,
              projectId:location.state.projectId,
              columns:JSON.stringify(dataObjValue),
              updateIndex:reacdData.updateIndex,
              value,
            }
          })
        }else {
          dispatch({
            type: 'forms/updateTempDatas',
            payload: {
              id: reacdData.id,
              define_id:reacdData.define_id,
              define: JSON.stringify(obj),
              status: reacdData.status,
              //creator: user1,
              method: "update",
              columns:JSON.stringify(dataObjValue),
              updateIndex:reacdData.updateIndex,
              value,
            }
          })
        }

        dispatch({
          type: 'forms/querySuccess',
          payload: {
            dataId: reacdData.define_id,
            reacdData: value,
            queryStata:location.state
          }
        })
      }
    }
  }

  function handleCancel(value) {
    dispatch({
      type: 'forms/querySuccess',
      payload: {
        OneTempDatasListsUpdate: [],
        reacdData: {},
        queryStata:{},
        UpdateDataModalVisit: false,
      }
    })
  }

 function changeValue(value){
    console.log("--form change---");
 }
  return (
    <Modal
      visible
      footer={null}
      onCancel={handleCancel}
      width="900px"
      maskClosable={false}
    >
      <div>
      <div className={styless.divTitleTwo}>
        <span>{reacdData.formTitle}</span>
      </div>
        <Form onChange={changeValue} key="update_form_data" schema={obj} onSubmit={handleOk} value={reacdData} />
      <div style={{clear:'both'}}></div>
    </div>
    </Modal>

  )
}

export default (UpdateFormDataModal)

