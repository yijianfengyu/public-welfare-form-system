import {Form, Button, Row, Icon, Col, Input, Select, Upload, DatePicker, InputNumber, Tooltip} from 'antd';
import echarts from 'echarts/lib/echarts';
import  '../map/js/china';
import {download} from '../utils/config';
import {Link} from 'dva/router'
import React from "react";
const OptGroup = Select.OptGroup;
const Option = Select.Option;
const FormItem = Form.Item;
export default class TableUtils {
  constructor() {
  }

  //生成查询条件表单字段的定义对象
  static filterForm(define) {

    let schemaColumns = define.schema;
    let filterForm = [];
    for (var i in schemaColumns) {
      //条件的列
      let dataObj = new Object()
      dataObj.title = schemaColumns[i].title;
      dataObj.dataIndex = schemaColumns[i].col_data
      dataObj.key = schemaColumns[i].col_data
      dataObj.type = schemaColumns[i].type
      dataObj.srcColData = schemaColumns[i].col_data;
      dataObj.visual = schemaColumns[i].visual;
      if (schemaColumns[i].type == "Radio"
        || schemaColumns[i].type == "Checkboxes"
        || schemaColumns[i].type == "Select"
        || schemaColumns[i].type == "RadioAttach") {
        dataObj.options = schemaColumns[i].options
      }
      filterForm.push(dataObj)
    }
    return filterForm
  }

  //联系人处理
  static columnRelateContact(params) {
    let schemaColumns = JSON.parse(params.temp.define).schema
    let columnRelateContact = {};//导入时指定哪些列数据是联系人，以便后台处理
    for (var i in schemaColumns) {
      //所有关联联系人过滤字段定义
      if (schemaColumns[i].contactType != undefined) {
        columnRelateContact[schemaColumns[i].col_data] = schemaColumns[i].contactType;
      }
    }
    return columnRelateContact
  }

  //数据表的所有列的定义和
  static tableDataAnalysis(params) {
    let tableRenderDefine = this.parseTableDefine(params);
    return tableRenderDefine;
  }
  static regBlankEx = /\s+/g;

  //数据表列值显示解析方法的定义生成
  static parseTableDefine(params) {
    let define = JSON.parse(params);
    let schemaColumns = define.schema;
    let groupby = define.groupBy;
    let tableRenderDefine = [];
    let countCols = [];//虚拟列
    let groupCols = [];//参与分组列
    let otherCols = [];//其他列
    for (var i in schemaColumns) {
      //表格的列
      //console.log("----------",schemaColumns[i].type);
      let dataObjLine = new Object()
      if (schemaColumns[i].type == "PhoneNumber") {
        dataObjLine.title = schemaColumns[i].title;
      } else {
        dataObjLine.title = schemaColumns[i].title;
      }
      //dataObjLine.title = schemaColumns[i].title
      dataObjLine.dataIndex = schemaColumns[i].col_data;
      dataObjLine.key = schemaColumns[i].col_data;
      dataObjLine.type = schemaColumns[i].type;
      dataObjLine.outHiden = schemaColumns[i].outHiden;
      dataObjLine.searchHiden = schemaColumns[i].searchHiden;
      dataObjLine.orderHiden = schemaColumns[i].orderHiden;
      dataObjLine.columnHiden = schemaColumns[i].columnHiden;
      dataObjLine.columnName = schemaColumns[i].columnName;
      dataObjLine.columnScore = schemaColumns[i].columnScore;
      dataObjLine.label = schemaColumns[i].label;
      dataObjLine.labelId = schemaColumns[i].labelId;

      dataObjLine.width = 150;
      if ( schemaColumns[i].type == "UploadsImg") {
        dataObjLine.render = (text, record) => {
          let content="";
          if(text){
            let linkList= Object.prototype.toString.call(text ) === '[object Object]'
              ||Object.prototype.toString.call(text ) === '[object Array]'
              ?text:JSON.parse(text);
            if(Object.prototype.toString.call(linkList ) === '[object Array]'){
                content=linkList.map((item,index)=>{
                  return (<Link to={item} target="_blank">
                    <img height={30} width={30} src={item+'?x-oss-process=image/resize,m_fill,h_30,w_30'} />
                  </Link>)
                })
            }else{
              content=text;
            }
          }
          return (content);
        }
      }else if (schemaColumns[i].type == "Uploads" ) {
        dataObjLine.render = (text, record) => {
          let content="";
          if(text){
            let linkList= Object.prototype.toString.call(text ) === '[object Object]'
            ||Object.prototype.toString.call(text ) === '[object Array]'
              ?text:JSON.parse(text);
            if(Object.prototype.toString.call(linkList ) === '[object Array]'){
              content=linkList.map((item,index)=>{
                return (<Link to={item} target="_blank">
                  <span>点击下载文件</span>
                </Link>)
              })
            }else{
              content=text;
            }
          }
          return (content);
        }
      } else if (schemaColumns[i].type == "DataTimes") {
        dataObjLine.render = (text, record) => {
          /*var link = "" + download + "<a target='_blank' href='/'>" + text + "" + text + "</a>";*/
          let content="";
          if(text){
            let dateList = text&&(typeof text)!="string"?text:JSON.parse(text);//更新时不经后台的数据本身就是数组
            content=<span>{dateList[0]+'至'+dateList[1]}</span>
          }

          return (content);
        }
      }else if (schemaColumns[i].type == "Cascade" || schemaColumns[i].type == "FormRegion") {
        dataObjLine.render = (text, record) => {
          if (!text) {
            return <span></span>;
          }else if(text&&(typeof text)=='string'&&text.indexOf('{')==-1){
            return <span>{text}</span>;
          }

          let json = Object.prototype.toString.call(text ) === '[object Object]'?text:JSON.parse(text);
          let province = json.province? json.province : "";
          let city = json.city? " "+json.city : "";
          let county = json.county? " "+json.county : "";
          let town = json.town? " "+json.town : "";
          let village = json.village? " "+json.village : "";
          let others = json.others? " "+json.others : "";
          let txt = province +  city +  county + town + village + others;
          return <Tooltip key={i} placement="top" title={txt}><span>{txt}</span></Tooltip>;
        }
      } else if (schemaColumns[i].type == "FormMeasurement") {
        dataObjLine.render = (text, record) => {
          if (!text) {
            return <span></span>;
          }else if(text&&(typeof text)=='string'&&text.indexOf('{')==-1){
            return <span>{text}</span>;
          }
          let json = Object.prototype.toString.call(text ) === '[object Object]'?text:JSON.parse(text);
          let readings = json.readings? json.readings : "";
          let dilution = json.dilution? ","+json.dilution : "";
          let actuals = json.actuals? ","+json.actuals : "";
          let tooltip = "仪表读数:"+readings + ", 稀释倍数:" + dilution + ", 实际值:" + actuals;
          let txt="("+readings+dilution+actuals+")"
          return <Tooltip key={i} placement="top" title={tooltip}><span>{txt}</span></Tooltip>;
        }
      } else if(schemaColumns[i].type == "Select"||schemaColumns[i].type == "FormRadioGroup"){
        dataObjLine.render = (text, record) => {
          let txt='';
          if(!text){
            txt='';
          }else{
            txt = Object.prototype.toString.call(text) === '[object Object]'?text.option:text.indexOf("{")!=-1?JSON.parse(text).option:text;
          }
          //let txt=text&&text.indexOf("{")!=-1?JSON.parse(text).option:text;
          return <Tooltip key={i} placement="top" title={text}>
            <span>{txt}</span>
          </Tooltip>;
        }
      }else if (schemaColumns[i].type == "CheckboxGroup") {
        dataObjLine.render = (text, record) => {
          if (!text) {
            text = "[]";
          }
          let dd= Object.prototype.toString.call(text ) === '[object Object]'
            || Object.prototype.toString.call(text ) === '[object Array]'
            ?text:JSON.parse(text);
          let label="";
          if(Object.prototype.toString.call(dd )==="[object Array]"){
            for(let k=0;k<dd.length;k++){
              label+=k!=0?","+dd[k].score:""+dd[k].score;
            }
          }else{
            label=text;
          }

          return <Tooltip key={i} placement="top" title={text}><span>{label}</span></Tooltip>;
        }
      } else if (schemaColumns[i].type == "FormLink") {
        dataObjLine.defaultLink = schemaColumns[i].defaultLink;
        dataObjLine.placeholder = schemaColumns[i].placeholder;

         /*** 默认值从配置变量中获取，所以上面定义 dataObjLine.defaultLink***/
         dataObjLine.render = (text, record) => {
           //rowDataId配合服务气端使用，方便后端根据此id可以追溯到是哪条数据点击进入的

           let link=dataObjLine.defaultLink.indexOf("?")==-1?dataObjLine.defaultLink+"?rowDataId="+record.id
             :dataObjLine.defaultLink+"&rowDataId="+record.id;

          return <a target="_blank" href={link}>{dataObjLine.placeholder}</a>;
        }
      } else if (schemaColumns[i].type == "RadioAttach") {
        dataObjLine.render = (text, record) => {
          //console.log("------RadioAttach------1");
          let txt=text?(typeof text)=='string'&&text.indexOf('{')!=-1?JSON.parse(text):text:'';
          let option=txt?(typeof txt)=="object"?txt[dataObjLine.dataIndex].option:txt:'';

          let images="";
          if(txt.picture){
            images=txt.picture.map((item,index)=>{
              return (<Link to={item} target="_blank">
                <img height={30} width={30} src={item+'?x-oss-process=image/resize,m_fill,h_30,w_30'} />
              </Link>);
            })
          }
          //console.log("------RadioAttach------2");
          return (<p><div><Tooltip key={i} placement="top" title={text}><span>{option}</span></Tooltip></div><div>{images}</div></p>)
        }
      }else if (schemaColumns[i].type == "FormDropdown") {
        dataObjLine.defaultLink = schemaColumns[i].defaultLink;
        dataObjLine.placeholder = schemaColumns[i].placeholder;

         /*** 默认值从配置变量中获取，所以上面定义 dataObjLine.defaultLink***/
         dataObjLine.render = (text, record) => {

           let obj=text?(typeof text)=='string'?JSON.parse(text):text:'';
           //rowDataId配合服务气端使用，方便后端根据此id可以追溯到是哪条数据点击进入的

          return <Tooltip key={i} placement="top" title={obj.label}><span>{obj.label}</span></Tooltip>;
        }
      } else if(schemaColumns[i].type == "FormPercentage") {
        dataObjLine.render = (text, record) => {
          let formatText=text&&""!=text?isNaN(text)?text:(text*100).toFixed(4)+"%":text;
          return <Tooltip key={i} placement="top" title={text}><span>{formatText}</span></Tooltip>
        }
      }else if(schemaColumns[i].type == "FormPhone"){
        //href="tel:123456789"
        dataObjLine.render = (text, record) => {
          let tipTxt=text&&""!=text?"拨打:":"";
          if(text){
            text= text.trim().replace(this.regBlankEx, ',');
            text= text.indexOf(",")!=-1?text.split(","):
                text.indexOf("，")!=-1?text.split("，"):text;
          }

          if(Array.isArray(text)){
            let innerText=[];
            for(let i=0;i<text.length;i++){
              let end=i==text.length-1?"":",";
              innerText.push(<a target="_blank" href={'tel:' + text[i]}><span>{text[i]}{end}</span></a>);
            }
            return <span>{tipTxt}{innerText}</span>;
          }else{
            return <span>{tipTxt}<a target="_blank" href={'tel:' + text}><span>{text}</span></a></span>;
          }

        }
      }else if(schemaColumns[i].type == "FormGps"){
        dataObjLine.render = (text, record) => {
          return <Tooltip key={i} placement="top" title={text}><span>{text}</span></Tooltip>
        }
      } else {
        dataObjLine.render = (text, record) => {
          return <Tooltip key={i} placement="top" title={text}><span>{text}</span></Tooltip>
        }
      }

      //虚拟列
      dataObjLine.visual=schemaColumns[i].visual;
      if (schemaColumns[i].visual && schemaColumns[i].visual != "static") {
        countCols.push(dataObjLine);
      }

      if (groupby && groupby.length > 0 && groupby.indexOf(schemaColumns[i].col_data) != -1) {
        //参与了分组的列
        groupCols.push(dataObjLine);
      } else {
        //没参与分组列
        otherCols.push(dataObjLine);
      }
    }
    if (countCols.length > 0) {
      return groupCols.concat(countCols);
    }
    return groupCols.concat(otherCols);
  }

  /**
   * 取出第一层无上级的题目
   * @param cols
   * @param value
   * @param obj
   */
  static getShowColumn(cols,value,obj){
    let p=[];
    //第一层的
    for(let key in cols){
      if(cols[key].type=="FormRadioGroup"
        &&!cols[key].p_option_uuid){
        let options=cols[key].options?cols[key].options:[];
        for(let i=0;i<options.length;i++){
          let val=Object.prototype.toString.call(value[key] ) === '[object Object]'?value[key]:JSON.parse(value[key]);
          if(value[key]&&options[i].uuid==val.uuid){
            //subFormShow[cols[key].uuid]=options[i].uuid;
            p.push({subUuid:options[i].uuid})
            obj[cols[key].uuid]=options[i].uuid;
          }
        }
      }
    }
    if(p.length>0){
      TableUtils.sonShowColumn(p,cols,value,obj);
    }
    return obj;
  }

  /**
   * 在点击更新某问卷时预载入取出所有应该显示的单选子题目。存在多层父子树形关系，所以使用迭代。
   * 我这里是js实现，如果是后端java实现再传入前端，算法应该一样的
   * @param p 记录某单选题目下面有哪些子单选题目，并且子题目已经选中了，已选中需要继续迭代循环它的子题目
   * @param cols 所有的列，这里没考虑性能，TODO 如果需要考虑性能则在循环子题目时移除父题目,再传入下一次迭代。
   * @param value 所有题目的值
   * @param obj object，收集器，传入每日一次迭代，作为map类型存储所有已经答题的单选题
   */
  static sonShowColumn(p,cols,value,obj){
    let kk=[];
    for(let k=0;k<p.length;k++){
      for(let key in cols){
        if(cols[key]&&cols[key].type=="FormRadioGroup"&&p[k].subUuid==cols[key].p_option_uuid){
          let options=cols[key].options?cols[key].options:[];
          for(let i=0;i<options.length;i++){
            let val=Object.prototype.toString.call(value[key] ) === '[object Object]'?value[key]:JSON.parse(value[key]);
            if(value[key]&&options[i]&&options[i].uuid==val.uuid){
              kk.push({subUuid:options[i].uuid})
              obj[cols[key].uuid]=options[i].uuid;
            }
          }

        }
      }
      if(kk.length>0){
        TableUtils.sonShowColumn(kk,cols,value,obj);
      }
    }
  }
  /**
   * 带有最大值最小值的类型判断
   * @param schema
   * @param value
   * @returns {{result: boolean, mes: string}}
   */
  static checkInputMaxAndMin(schema,value){
    for(let item in schema){
      if(schema[item].type=="FormInt" ||schema[item].type=="FormNumber"){
        let min=schema[item].min;
        let max=schema[item].max;
        if(""!=min&&value[item]&&parseFloat(value[item])<min){
          return {result:false,mes:schema[item].title+"最小值必须大于："+min};
        }
        if(max!=""&&value[item]&&parseFloat(value[item])>max){
          return {result:false,mes:schema[item].title+"最大值必须小于："+max};
        }
      }
      if(schema[item].type=="FormInput" || schema[item].type=="FormText"|| schema[item].type=="FormDaily"){
        let min=schema[item].min;
        let max=schema[item].max;
        if(min!=""&&value[item]&&value[item].length<min){
          return {result:false,mes:schema[item].title+"最小长度必须大于"+min};

        }
        if(max!=""&&value[item]&&value[item].length>max){
          return {result:false,mes:schema[item].title+"最大长度必须小于"+max};

        }
      }
      if(schema[item].type=="FormMeasurement"){
        let readingsMin=schema[item].readingsMin;
        let readingsMax=schema[item].readingsMax;
        if(""!=readingsMin&&value[item]&&value[item].readings&&parseFloat(value[item].readings)<readingsMin){
          return {result:false,mes:schema[item].title+"仪表读数最小值必须大于："+readingsMin};
        }
        if(readingsMax!=""&&value[item]&&value[item].readings&&parseFloat(value[item].readings)>readingsMax){
          return {result:false,mes:schema[item].title+"仪表读数最大值必须小于："+readingsMax};
        }

        let dilutionMin=schema[item].dilutionMin;
        let dilutionMax=schema[item].dilutionMax;
        if(dilutionMin!=""&&value[item]&&value[item].dilution&&parseFloat(value[item].dilution)<dilutionMin){
          return {result:false,mes:schema[item].title+"稀释倍数最小值必须大于："+dilutionMin};
        }
        if(dilutionMax!=""&&value[item]&&value[item].dilution&&parseFloat(value[item].dilution)>dilutionMax){
          return {result:false,mes:schema[item].title+"稀释倍数最大值必须小于："+dilutionMax};
        }

      }
    }
    return {result:true,mes:''};
  }

  /**
   * 将界面查询条件的值放入标准格里面进行赋值
   * @param tableDefine 表定义
   * @param value form查询表单的值
   */
  static settingTableDefineValues(tableDefine, value) {
    let schemaColumns = tableDefine.schema;
    for (var k in schemaColumns) {
      schemaColumns[k].value = "";//如果定义中值存在则清空
      if (value[schemaColumns[k].col_data]) {

        schemaColumns[k].value = value[schemaColumns[k].col_data];
      }
      //特别注意下下面的判断,一定要null和undefined判断，因为值可能为0，那么会导致被过滤
      if (value[schemaColumns[k].col_data.concat("_min")] != null
        && typeof value[schemaColumns[k].col_data.concat("_min")] != "undefined") {
        if ((typeof schemaColumns[k].value) != "object") {
          schemaColumns[k].value = {};
        }

        if ((typeof value[schemaColumns[k].col_data.concat("_min")].isValid) != "undefined"
          && (typeof value[schemaColumns[k].col_data.concat("_min")].isValid) == "function") {
          schemaColumns[k].value.min = value[schemaColumns[k].col_data.concat("_min")].format('YYYY-MM-DD HH:mm:ss');
        } else {
          schemaColumns[k].value.min = value[schemaColumns[k].col_data.concat("_min")];
        }

      }
      if (value[schemaColumns[k].col_data.concat("_max")] != null
        && typeof value[schemaColumns[k].col_data.concat("_max")] != "undefined") {
        if ((typeof schemaColumns[k].value) != "object") {
          schemaColumns[k].value = {};
        }
        if ((typeof value[schemaColumns[k].col_data.concat("_max")].isValid) != "undefined"
          && (typeof value[schemaColumns[k].col_data.concat("_max")].isValid) == "function") {
          schemaColumns[k].value.max = value[schemaColumns[k].col_data.concat("_max")].format('YYYY-MM-DD HH:mm:ss');
        } else {
          schemaColumns[k].value.max = value[schemaColumns[k].col_data.concat("_max")];
        }
      }

    }
    tableDefine.groupBy = value.selectGroupColDatas ? value.selectGroupColDatas : [];
    tableDefine.orderBy = value.selectOrderColDatas ? value.selectOrderColDatas : [];
    tableDefine.orderType = value.selectOrderTypeColDatas;
    tableDefine.countBy = value.selectCountColDatas ? value.selectCountColDatas : [];

  }
  /**
   * 将界面查询条件的值放入标准格里面进行赋值
   * @param tableDefine 表定义
   * @param value form查询表单的值
   * @param notValues 排除的,是个列表
   */
  static getTableDefineValues(tableDefine, value,notValues) {
    let schemaColumns = tableDefine.schema;

    for (var k in schemaColumns) {
      if(notValues&&notValues.length>0){
        //有需要排除的
        for(let m=0;m<notValues.length;m++){
          if (schemaColumns[k].col_data!=notValues[m]&&schemaColumns[k].type=="Cascade"&&schemaColumns[k].value&&schemaColumns[k].value!="") {
            value[schemaColumns[k].col_data]=schemaColumns[k].value;
          }
        }
      }else{
        //没有需要排除的
        if (schemaColumns[k].type=="Cascade"&&schemaColumns[k].value&&schemaColumns[k].value!="") {
          value[schemaColumns[k].col_data]=schemaColumns[k].value;
        }
      }
    }

    //不存在，而定义中有值
    if(!value.selectOrderColDatas&&tableDefine.orderBy&&tableDefine.orderBy.length>0){
      value.selectOrderColDatas=tableDefine.orderBy;
    }
    //不存在值，而定义中有值
    if(!value.selectOrderTypeColDatas&&tableDefine.orderType&&""!=tableDefine.orderType){
      value.selectOrderTypeColDatas=tableDefine.orderType;
    }

  }

  /**
   * 表定义
   * @param tableDefine
   */
  static resetDefineValues(tableDefine){
    let schemaColumns=tableDefine.schema;
    tableDefine.groupBy=[];
    tableDefine.orderBy=[];
    for(var i in schemaColumns){
      if(schemaColumns[i].value){
        schemaColumns[i].value="";
      }
      if(schemaColumns[i].visual){
        delete schemaColumns[i];//删除所有虚拟列
      }
    }
  }
  /**
   * 根据定义创建一个新的表值对象给form用
   * @param tableDefine
   */
  static createSchemalValues(tableDefine){
    let schemaColumns=tableDefine.schema;
    let values={};
    let columns=[];
    for(var i in schemaColumns){
      if(schemaColumns[i].visual){
        delete schemaColumns[i];//删除所有虚拟列
        continue;
      }
      values[schemaColumns[i].col_data]="";
      columns.push(schemaColumns[i].col_data);
    }
    return {values:values,fieldsets:{legend:'',fields:columns,buttons:[{label:"提交",action:"submit",type:"button",buttonClass:"btn btn-primary"}]}};
  }

  /**
   * 根据定理的统计列拿到图表显示的维度
   * @param define
   */
  static getDataLegend(define) {
    let countBy = define.countBy;
    let columns = define.schema;
    let dataLegend = {};
    for (var i = 0; i < countBy.length; i++) {
      dataLegend[countBy[i]] = columns[countBy[i]].title;
    }

    return dataLegend;
  }
  //返回表单可选的类型
  static getFormElementType(){
    return [
      {type:'FormInput',name:'单行文字'},
      {type:'FormText',name:'多行文字'},
     // {type:'FormDaily',name:'日志文字'},
      {type:'FormInt',name:'整数'},
      {type:'FormNumber',name:'小数'},
      {type:'FormRegion',name:'地址'},
      {type:'FormGps',name:'GPS坐标'},
      {type:'FormMeasurement',name:'水质监测'},
      {type:'Select',name:'下拉菜单'},
      {type:'FormRadioGroup',name:'单选'},
      {type:'CheckboxGroup',name:'多项选择'},
      {type:'Uploads',name:'上传文件'},
      {type:'UploadsImg',name:'上传图片'},
      {type:'FormDate',name:'日期'},
      {type:'FormDatetime',name:'日期时间'},
      {type:'Password',name:'密码'},
      {type:'DataTimes',name:'日期范围'},
      {type:'Cascade',name:'-地址'},
      {type:'Content',name:'-小标题'},
      {type:'FormLink',name:'-外部链接'},
      {type:'FormPercentage',name:'-数字转百分比显示'},
      {type:'FormPhone',name:'-手机号码'},
      {type:'FormDropdown',name:'-数据下拉菜单'},
      {type:'RadioAttach',name:'-单向选择附加选项'},
    ]
  }
  static parseLabel(arr,label){
    let txt="未定义类型";
    for(let i=0;i<arr.length;i++){
      if(arr[i].type==label){
        txt=arr[i].name
        break;
      }
    }
    return txt;
  }
  static getFormElementOptions(){
    return TableUtils.getFormElementType().map((item,index)=>{
      return <Option key={'det'+index} value={item.type}>{item.name}</Option>;
    });
  }
  //获取联系人相关字段定义
  static contactTypeList=[
    {
      title: "-不关联-",
      key: "",
      type: "",
    }, {
      title: "姓名",
      key: "name",
      type: "Text",
    }, {
      title: "邮箱",
      key: "email",
      type: "Text",
    }, {
      title: "手机",
      key: "tel",
      type: "Text",
    }, {
      title: "出生日期",
      key: "birthdate",
      type: "FormDate",
    }, {
      title: "性别",
      key: "sex",
      type: "Radio",
    }, {
      title: "身份证",
      key: "identityCard",
      type: "Text",
    }, {
      title: "编号",
      key: "serialNumber",
      type: "Text",
    }, {
      title: "地区",
      key: "area",
      type: "Cascade",
    },
    {
      title: "机构名称",
      key: "organizationNames",
      type: "Text",
    }, {
      title: "地址",
      key: "address",
      type: "Text",
    }, {
      title: "邮编",
      key: "postcode",
      type: "Text",
    }, {
      title: "单位职务",
      key: "unitPosition",
      type: "Text",
    }, {
      title: "所在部门",
      key: "department",
      type: "Text",
    }, {
      title: "单位电话",
      key: "workTelephone",
      type: "Text",
    }, {
      title: "传真",
      key: "fax",
      type: "Text",
    }, {
      title: "备用手机",
      key: "secondPhone",
      type: "Text",
    }, {
      title: "备用邮箱",
      key: "secondaryEmail",
      type: "Text",
    }, {
      title: "QQ",
      key: "qq",
      type: "Text",
    }, {
      title: "微信",
      key: "wechat",
      type: "Text",
    },

    {
      title: "描述",
      key: "description",
      type: "Text",
    }, {
      title: "省份",
      key: "province",
      type: "Text",
    }, {
      title: "负责人",
      key: "principalName",
      type: "Text",
    }, {
      title: "星座",
      key: "constellation",
      type: "Text",
    }, {
      title: "创建日期",
      key: "createDate",
      type: "FormDate",
    }, {
      title: "修改日期",
      key: "updateDate",
      type: "FormDate",
    }, {
      title: "标签一",
      key: "other1",
      type: "Text",
    }, {
      title: "标签二",
      key: "other2",
      type: "Text",
    }, {
      title: "标签三",
      key: "other3",
      type: "Text",
    }, {
      title: "标签四",
      key: "other4",
      type: "Text",
    }, {
      title: "标签五",
      key: "other5",
      type: "Text",
    }
  ]
  static getContactTypeDefineForUpdate(){
    //返回副本
    return this.contactTypeList.concat([]);
  }
  static getContactTypeDefine(){
    //返回副本，并把不需要的设置为空
    let temp=this.contactTypeList.concat([]);
    temp.splice(1,3);
    return temp;
  }

  /**
   * 生成收入进联系人的相关选项
   */
  static createConcatSelectOptions(contactSelectOptions){
    let concatList = [];
    for (let i in contactSelectOptions) {
      if (contactSelectOptions[i] !== "") {
        concatList.push(<Option key={'csv_'+i}
                                value={contactSelectOptions[i].type+"@@"+contactSelectOptions[i].key+"@@"+contactSelectOptions[i].title+"@@"+i}>{contactSelectOptions[i].title}</Option>)
      }
    }
    return concatList;
  }

  static uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }

  /**
   *
   * @param getFieldDecorator form对对应的函数
   * @param item
   * @param index
   * @param deleteInput 删除函数
   */
  static createOptions(getFieldDecorator,item,index,deleteInput){
    return (
      <Row gutter={24} key={item.k+"_opt"}>
        <Col span={13}>
          <FormItem
            key={item.k}
            style={{marginBottom:'10px' }}
          >
            {getFieldDecorator(`options[${item.k}]`, {
              initialValue: item.option && item.option.option?item.option.option:null
            })(
              <Input placeholder="填写名称" style={{ width: '100%'}} size='default'/>
            )}
          </FormItem>
        </Col>
        <Col span={4} style={{padding:'0'}}>
          <FormItem
            key={item.k}
            style={{marginBottom:'10px' }}
          >
            {getFieldDecorator(`scores[${item.k}]`, {
              initialValue: item.option && item.option.score?item.option.score:null,
              rules: [{ message: '输入得分'}],
            })(
              <Input placeholder="填写答题得分" type="number" style={{ width: '100%'}} size='default'/>
            )}

          </FormItem>
        </Col>
        <Col span={4} style={{padding:'0'}}>
          <Link onClick={() =>deleteInput(item.k)}><Icon type="minus-circle-o"/></Link>
        </Col>
      </Row>
    );
  }

  /**
   * 后台传回的列定义需要格式化修正为js表单组件使用的
   * 2022.3.12为了可以进行调表，添加获取所有FormRadioGroup类型
   * @param columns
   */
  static fomatDefineColumnJson(columns){
    let objList = [];
    let radioGroupList={'':{uuid:'',p_option_uuid:null,p_uuid:null,options:[{option:'',score:'',uuid:''}],col_data:''}};
    let contactSelectOptionsUpdate=this.getContactTypeDefineForUpdate();
    for (let i in columns) {
      let objOnes = new Object()
      //小标题
      if (columns[i].type == "Content") {
        objOnes.title = columns[i].content;
        objOnes.className = "col-sm-offset-2";
        objOnes.content = columns[i].content;
      } else {
        objOnes.title = columns[i].title;
      }
      if (columns[i].dropdownValue){
        objOnes.dropdownValue= columns[i].dropdownValue;
        objOnes.tName= columns[i].tName;
      }

      objOnes.type = columns[i].type
      objOnes.options = columns[i].options
      objOnes.col_data = columns[i].col_data
      objOnes.validators = columns[i].validators
      objOnes.placeholder = columns[i].placeholder
      objOnes.outHiden = columns[i].outHiden
      objOnes.searchHiden = columns[i].searchHiden
      objOnes.orderHiden = columns[i].orderHiden
      objOnes.columnHiden = columns[i].columnHiden
      objOnes.columnName = columns[i].columnName
      objOnes.columnScore = columns[i].columnScore
      objOnes.label = columns[i].label
      objOnes.labelId= columns[i].labelId
      objOnes.value = columns[i].value
      objOnes.uuid = columns[i].uuid
      objOnes.p_uuid = columns[i].p_uuid
      objOnes.p_option_uuid = columns[i].p_option_uuid


      if (columns[i].defaultLink) {
        objOnes.defaultLink = columns[i].defaultLink;
      }
      if (columns[i].max) {
        objOnes.max = columns[i].max;
      }
      if (columns[i].min) {
        objOnes.min = columns[i].min;
      }

      if (columns[i].readingsMin) {
        objOnes.readingsMin = columns[i].readingsMin;
      }
      if (columns[i].readingsMax) {
        objOnes.readingsMax = columns[i].readingsMax;
      }
      if (columns[i].dilutionMin) {
        objOnes.dilutionMin = columns[i].dilutionMin;
      }
      if (columns[i].dilutionMax) {
        objOnes.dilutionMax = columns[i].dilutionMax;
      }

      //绑定联系人的列
      if (columns[i].contactType) {
        for (let k in contactSelectOptionsUpdate) {
          if (columns[i].contactType === contactSelectOptionsUpdate[k].key) {
            let contType = contactSelectOptionsUpdate[k].type + "@@" + contactSelectOptionsUpdate[k].key + "@@" + contactSelectOptionsUpdate[k].title + "@@" + k
            objOnes.contactType = contType
            delete contactSelectOptionsUpdate[k]
          }
        }
      }

      if (!columns[i].visual && columns[i].visual != "static") {
        if(columns[i].type == "FormRadioGroup"){
          radioGroupList[objOnes.uuid]=objOnes;
        }
        objList.push(objOnes)
      }
    }

    return {contactSelectOptionsUpdate:contactSelectOptionsUpdate,objList:objList,radioGroupList}
  }

  /**
   * 根据自定义列的表单值创建存储数据库的列描述json
   * @param values 表单中的列值
   * @param col_datla 默认的列名
   * @param old l的列名
   */
  static createFormColumnJson(values,col_data,old){
    let col = col_data?col_data:"col_"+(new Date().getTime());

    let options = []
    for (let i=0; i<values.keys.length;i++) {
      if (values.options[values.keys[i].k]) {
        options.push({
          option:values.options[values.keys[i].k],
          score:values.scores[values.keys[i].k],
          uuid:values.keys[i].option.uuid,
        })
      }
    }
    let CheckboxValues
    if (values.validators == true) {
      if (values.inputType == "FormRadioGroup"
        || values.inputType == "CheckboxGroup"
        || values.inputType == "Select"
        || values.inputType == "Uploads"
        || values.inputType == "FormDropdown"
        || values.inputType == "UploadsImg") {
        let message1 = "请选择" + values.optionTitle + "!"
        CheckboxValues = [{
          "type": "required",
          "message": message1
        }]
      } else {
        let message = "请输入" + values.optionTitle + "!"
        CheckboxValues = [{
          "type": "required",
          "message": message
        }]
      }
    }
    let column=old?old:{};//json格式的列定义
    if (values.inputType == "Select") {
      values.alt=values.alt?"请选择":values.alt;
    }
    if (values.inputType == "FormDropdown") {
      column.dropdownValue=values.dropdownValue;
      //column.value=values.value
      column.tName=values.value
    }

    //if((!values.contactType == "@@@@-不关联-" || buttonText == "")){
    if((!values.contactType == "@@@@-不关联-")){
      column.contactType=values.contactType
    }
    if(values.validators){
      column.validators=CheckboxValues
    }
    if(values.inputType === "Content" ){
      column.className="col-sm-offset-2"
      column.content=values.optionTitle
    }
    if(values.inputType === "FormLink"){
      column.defaultLink=values.defaultLink
    }
    if(values.inputType === "FormInt"||values.inputType === "FormNumber"
      ||values.inputType === "FormInput"||values.inputType === "FormText"
      ||values.inputType === "FormDaily"){
      column.min=values.min
      column.max=values.max
    }
    if(values.inputType === "FormMeasurement"){
      column.readingsMin=values.readingsMin
      column.readingsMax=values.readingsMax
      column.dilutionMin=values.dilutionMin
      column.dilutionMax=values.dilutionMax
    }
    column.options=options
    column.title=values.optionTitle
    column.type=values.inputType
    column.col_data=col
    column.placeholder=values.alt
    column.outHiden = values.outHiden
    column.searchHiden = values.searchHiden
    column.orderHiden = values.orderHiden
    column.columnHiden = values.columnHiden
    column.columnName = values.columnName
    column.columnScore = values.columnScore
    column.label = values.label
    column.labelId = values.labelId
    //column.uuid = old&&old.uuid&&old.uuid!=""?old.uuid:new Date().getTime();
    if( !old){
      column.uuid =(new Date()).getTime()+'';
    }else{
      column.uuid =old.uuid;
    }
    return column;
  }

  /**
   *
   * @param dataXAxis
   * @param seriesBar
   * @returns echarts折线图和柱形图图表配置
   * */
  static createBarLineSetting(dataXAxis, seriesBar) {
    let legend = [];
    for (let i = 0; i < seriesBar.length; i++) {
      legend.push(seriesBar[i].name);
    }
    let setting = {
      title: {
        text: '',
        subtext: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: legend,  //最大值，最小值...
        x: 'center',
        show: 'true',
        top: '1%'
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true},

        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          left: '97%',
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: 0,
          end: 100
        }
      ],
      calculable: true,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          rotate: -30,
          textStyle: {
            color: '#ababab'
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#dedede'],
            width: 1,
            type: 'dashed'
          }
        },
        axisTick: {    // 轴标记
          show: true,
          length: 10,
          inside: true,
          lineStyle: {
            color: ['#dedede'],
            type: 'solid',
            width: 1
          }
        },

        data: dataXAxis  //比如团队：团队1，团队2，团队3
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#ababab'
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#dedede'],
            width: 1,
            type: 'dashed'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: [
              'rgba(250,250,250,0.3)',
              'rgba(235,235,235,0.3)'
            ]
          }
        },
      },
      series: seriesBar
    }
    return setting;
  }

  /**
   * 饼图
   * @param seriesPie
   * @returns echarts饼图配置
   * */
  static createPieSetting(seriesPie) {
    let legend = [];

    //每个维度数据太多，保留前20项，合并其他项的值
    for (let i = 0; i < seriesPie.length; i++) {
      legend.push(seriesPie[i].name);
      let overTwenty = 0;
      let targetData = [];

      if (seriesPie[i].data && seriesPie[i].data.length > 0) {
        //排序
        let data = seriesPie[i].data.sort(function (a, b) {
          return b.value - a.value;
        });
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
          if (dataIndex <= 20) {
            targetData.push(data[dataIndex])
          } else {
            overTwenty += parseFloat(data[dataIndex].value);
          }
        }
      }
      //将新数据装入
      targetData = targetData.slice(0, 20);
      if (overTwenty > 0) {
        targetData.push({name: "其他:排名20以后值合并", value: overTwenty});
      }
      seriesPie[i].data = targetData;

    }


    return {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        top: '4%',
        orient: 'horizontal',
        x: 'center',
        data: legend,
      },
      toolbox: {
        show: true,
        top: '4%',
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {
            show: true,
            type: ['pie', 'funnel']
          },
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      series: seriesPie,
    };
  }

  /**
   * 根据维度数量计算返回各圆的宽度数组，最大90
   * @param max最大圆半径百分比
   * @param lengtt
   */
  static caculatorPieRadius(max, len) {
    let result = [];
    let init = max / len;
    let gap = len == 1 ? 0 : 5;//间隙
    for (; 0 < len; len--) {
      result.push([(init * (len - 1) + gap) + "%", init * len + "%"]);
    }
    return result;
  }

  static createAreaHotSetting(concatMapData) {

    var convertData = function (data) {
      var res = [];
      //丛婷加的地图数据为空时的判断
      if(data!=undefined&&data.length>0){

        for (var i = 0; i < data.length; i++) {
          var geoCoord = data[i].geo;
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
      }
      return res;
    };
    function renderItem(params, api) {
      var coords = [
        [116.7, 39.53],
        [103.73, 36.03],
        [112.91, 27.87],
        [120.65, 28.01],
        [119.57, 39.95]
      ];
      var points = [];
      for (var i = 0; i < 5; i++) {
        //丛婷加的地图数据为空时的判断
        if (concatMapData.length>0) {

          points.push(api.coord(concatMapData[i].geo));
        }
      }
      var color = api.visual('color');

      return {
        type: 'polygon',
        shape: {
          points: echarts.graphic.clipPointsByRect(points, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          })
        },
        style: api.style({
          fill: color,
          stroke: echarts.color.lift(color)
        })
      };
    }

    let option = {
      // backgroundColor: '#404a59',
      title: {
        text: '联系人分布图',
        subtext: '数据模型',
        sublink: 'http://www.pm25.in',
        left: 'center',
        top: '5%',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.name + ' : ' + params.value[2];
        }
      },
      visualMap: {
        min: 0,
        max: 300,
        calculable: true,
        inRange: {
          color: ['#eac736', '#eac736', '#d94e5d']
        },
        textStyle: {
          color: '#fff'
        }
      },
      aria: {
        show: true
      },
      geo: {
        map: 'china',
        roam: true,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false,
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#031525',
            borderColor: '#097bba',
          },
          emphasis: {
            areaColor: '#2B91B7',
          }
        }
      },
      bmap: {
        zoom: -20,
        roam: false,
        mapStyle: {
          styleJson: [
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": {
                "color": "#044161"
              }
            },
            {
              "featureType": "land",
              "elementType": "all",
              "stylers": {
                "color": "#004981"
              }
            },
            {
              "featureType": "boundary",
              "elementType": "geometry",
              "stylers": {
                "color": "#064f85"
              }
            },
            {
              "featureType": "railway",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "highway",
              "elementType": "geometry",
              "stylers": {
                "color": "#004981"
              }
            },
            {
              "featureType": "highway",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#005b96",
                "lightness": 1
              }
            },
            {
              "featureType": "highway",
              "elementType": "labels",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "arterial",
              "elementType": "geometry",
              "stylers": {
                "color": "#004981"
              }
            },
            {
              "featureType": "arterial",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#00508b"
              }
            },
            {
              "featureType": "poi",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "green",
              "elementType": "all",
              "stylers": {
                "color": "#056197",
                "visibility": "off"
              }
            },
            {
              "featureType": "subway",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "manmade",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "local",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "arterial",
              "elementType": "labels",
              "stylers": {
                "visibility": "off"
              }
            },
            {
              "featureType": "boundary",
              "elementType": "geometry.fill",
              "stylers": {
                "color": "#029fd4"
              }
            },
            {
              "featureType": "building",
              "elementType": "all",
              "stylers": {
                "color": "#1a5787"
              }
            },
            {
              "featureType": "label",
              "elementType": "all",
              "stylers": {
                "visibility": "off"
              }
            }
          ]
        }
      },
      series: [
        {
          name: '志愿者活跃度',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(concatMapData),
          symbolSize: function (val) {
            if (val[2] > 100) {
              return (val[2] / 10);
            } else if (val[2] <= 100 && val[2] >= 30) {
              return (val[2] / 6);
            } else {
              return 4;
            }
            //return parseInt(val[2])>100?(val[2] / 10):val[2];
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ddb926'
            }
          },
          zlevel: 1
        },
        {
          name: '前5名',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          animation: true,
          data: convertData(concatMapData.sort(function (a, b) {
            return b.value - a.value;
          }).slice(0, 6)),
          symbolSize: function (val) {
            return val[2] / 10;
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 2
        },
        {
          type: 'custom',
          coordinateSystem: 'geo',
          renderItem: renderItem,
          itemStyle: {
            normal: {
              opacity: 0.5
            }
          },
          animation: false,
          silent: true,
          data: [0],
          z: 20,
          zlevel: 3
        }
      ]
    };
    return option;
  }
}


