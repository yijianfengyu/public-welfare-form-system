import React from 'react'
import {Form,loader} from 'subschema';
import {message,Icon } from 'antd';
import  styless from './formStyle.less'
import {connect} from 'dva'
const EditForm = ({
  dispatch,selectForm,
  }) => {

  const {tempTableListId,query,createFlag,columnsValue,subFormShow}=selectForm;
  console.log("------用户填数据表单2------");
  let obj;
  let form;

  if (tempTableListId.define == undefined) {
    obj = null;
  } else {

    obj = JSON.parse(tempTableListId.define);
    console.log("---schema---",obj.schema);
    for(let item in obj.schema){
        if(obj.schema[item].outHiden){
          //控制外部不登录是否显示
          obj.fieldsets.fields.splice(obj.fieldsets.fields.indexOf(item),1);
          delete obj.schema[item];
          continue;
        }else{
          if(obj.schema[item].type=="FormRadioGroup"){
            //方便从表单里面发出事件到外部
            obj.schema[item].dispatch=function(params){
              dispatch({
                type: 'selectForm/subFormShowAdd',
                payload: {
                  uuid:params.uuid,
                  subUuid:params.subUuid,
                }
              });
            };
          }
          let col=obj.schema[item];
          if(col.p_option_uuid
            &&!(subFormShow&&subFormShow[col.p_uuid]&&subFormShow[col.p_uuid]==col.p_option_uuid)){
            delete obj.schema[item];
            obj.fieldsets.fields.splice(obj.fieldsets.fields.indexOf(item),1);
          }
        }

    }

    form = <div className={styless.from}>
      <div className={styless.divTitleTwo}>
        <span>{tempTableListId.formTitle}</span>
      </div>
      <div>
        <div dangerouslySetInnerHTML={{__html:tempTableListId.formDescription }} />
      </div>
      <Form schema={obj} onSubmit={handleSubmit} disabled="true"/>
    </div>
  }
  if (createFlag == "0") {
    form = <div className="content-inner">
      <div className={styless.error}>
        <Icon type="frown-o"/>
        <h1>模板不存在</h1>
      </div>
    </div>
  }
  function aa(){
    var browser = {
      versions: function () {
        var u = navigator.userAgent;
        var ua = navigator.userAgent.toLocaleLowerCase();
        var app = navigator.appVersion;
        return {
          trident: u.indexOf('Trident') > -1, // IE内核
          presto: u.indexOf('Presto') > -1, // opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // IOS终端
          android: u.indexOf('Android') > -1, // 安卓终端
          iPhone: u.indexOf('iPhone') > -1, // 是否为iphone或QQHD浏览器
          iPad: u.indexOf('iPad') > -1, // 是否为iPad
          webApp: u.indexOf('Safari') == -1, // 是否web应用程序，没有头部与底部
          QQbrw: u.indexOf('MQQBrowser') > -1, // QQ浏览器
          weiXin: u.indexOf('MicroMessenger') > -1, // 微信
          QQ: u.indexOf('QQ') > -1, // QQ
          weiBo: u.indexOf('Weibo') > -1, // 微博
          ucLowEnd: u.indexOf('UCWEB7.') > -1, //
          ucSpecial: u.indexOf('rv:1.2.3.4') > -1,
          webview: !(u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/)) && u.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
          ucweb: function () {
            try {
              return parseFloat(u.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2
            } catch (e) {
              if (u.indexOf('UC') > -1) {
                return true;
              }
              return false;
            }
          }(),
          Symbian: u.indexOf('Symbian') > -1,
          ucSB: u.indexOf('Firofox/1.') > -1
        };
      }()
    };
    let systemEnvironment
    let channel
    //判断是否是手机设备打开
    if (browser.versions.android) {
      //是否在安卓浏览器打开
      systemEnvironment="android"
      if (browser.versions.weiXin) {
        //在微信中打开
        channel="微信"
      }else if (browser.versions.weiBo) {
        //在新浪微博客户端打开
        channel="微博"
      }else if (browser.versions.QQ) {
        //在QQ空间打开
        channel="QQ"
      }else{
        channel="其他渠道"
      }
    }else if (browser.versions.iPhone) {
      //是否在IOS浏览器打开
      systemEnvironment="ios"
      if (browser.versions.weiXin) {
        //在微信中打开
        channel="微信"
      }else if (browser.versions.weiBo) {
        //在新浪微博客户端打开
        channel="微博"
      }else if (browser.versions.QQ) {
        //在QQ空间打开
        channel="QQ"
      }else{
        channel="其他渠道"
      }
    }
    //判断是否是pc设备打开
    else{
      systemEnvironment="windows"
      if (browser.versions.trident||browser.versions.webKit||browser.versions.gecko) {
        //IE内核,谷歌内核，火狐内核
        channel="其他渠道"
      }else if (browser.versions.weiBo) {
        //在新浪微博客户端打开
        channel="微博"
      }else if (browser.versions.QQ) {
        //在QQ空间打开
        channel="QQ"
      }else if (browser.versions.weiXin) {
        //在微信中打开
        channel="微信"
      }else if (browser.versions.QQbrw) {
        //在QQ空间打开
        channel="QQ浏览器"
      }else{
        channel="其他渠道"
      }
    }

    let obj=new Object()
    obj.systemEnvironment=systemEnvironment
    obj.channel=channel
    return obj
  }

  function handleSubmit(e, errors, value) {
    let obj = JSON.parse(tempTableListId.define);
    var arr = Object.getOwnPropertyNames(errors);
    if (arr.length > 0) {
    } else if (arr.length == 0) {
      if (tempTableListId.status == 1) {
        message.warning("已审核不能添加")
      } else {
        if (obj != null) {
          console.log("--提交数据--:",value);
          // 添加数据到定义文件中"values":{"col_data1":"ltl","col_data2":"ltl@qq.com","col_data3":"152"}
          obj["values"] = value;
          for (let item in value){
            for (let colItem in obj["schema"]){
              if (item==colItem){
                obj["schema"][colItem]["value"]=value[item];
              }
            }
          }

        }
        var obj1 = JSON.parse(sessionStorage.getItem("userStorage"))
        var user1
        if (obj1 == null) {
          user1 = "";
        } else {
          user1 = obj1.id;
        }
        let browser=aa()
        if(query.projectId!=undefined){
          dispatch({
            type: 'selectForm/createTempDatas',
            payload: {
              formTitle: tempTableListId.formTitle,
              formSynopsis: tempTableListId.formDescription,
              status: tempTableListId.status,
              define: JSON.stringify(obj),
              creator: user1,
              companyCode: query.code,
              data_uuid: query.UUID,
              define_id: query.id,
              method: "create",
              usableRange: tempTableListId.usableRange,
              code_key:query.code,
              projectId:query.projectId,
              columns:columnsValue,
              systemEnvironment:browser.systemEnvironment,
              channel:browser.channel,
              rowDataId:selectForm.rowDataId,
            }
          })
        }else{
          dispatch({
            type: 'selectForm/createTempDatas',
            payload: {
              formTitle: tempTableListId.formTitle,
              formSynopsis: tempTableListId.formDescription,
              status: tempTableListId.status,
              define: JSON.stringify(obj),
              creator: user1,
              companyCode: query.code,
              data_uuid: query.UUID,
              define_id: query.id,
              method: "create",
              usableRange: tempTableListId.usableRange,
              code_key:query.code,
              columns:columnsValue,
              systemEnvironment:browser.systemEnvironment,
              channel:browser.channel,
              rowDataId:selectForm.rowDataId,
            }
          })
        }

        dispatch({
          type: 'selectForm/querySuccess',
          payload: {
            query: query,
            isQuery: "create"
          }
        })
      }
    }
  }

  document.title = tempTableListId.formTitle;
  return (
      <div className={styless.fromDiv}>
        {form}
      </div>
  )
}

export default connect(({selectForm, loading}) => ({selectForm, loading}))((EditForm))

