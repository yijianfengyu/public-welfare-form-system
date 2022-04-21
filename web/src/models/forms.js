import {message, Modal} from 'antd'
import { routerRedux } from 'dva/router';
import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {EditorState} from 'draft-js';
import styles2 from '../utils/commonStyle.less'
import {download} from '../utils/config'
import TableUtils from '../utils/TableUtils'
import {request, config} from 'utils'
const {api} = config
const {dingding} = api
import {SelectPrincipal} from '../services/contactManagement'
import { insertFocusProject, deleteFocusProject, queryOptions } from '../services/projectManage'

import {
  downFromDataExcel,
  queryTempDataFrom,
  queryTempTables,
  onTempTableExcelModel,
  queryTempTableByIds,
  deleteTempTable,
  insertForm,
  updateTempTables,
  createTempData,
  deleteTempData,
  queryAllTempDataByPage,
  queryAllTempData,
  queryAllTempDataByDefineId,
  queryTempDataById,
  querySubTables,
  clearAllData,
  createShareUrl,
  updateIsConditions,
  updateTempDataRemark,
  queryAllActiveStaff, modifyPw, querySubData, getTableColumns, getLabelForSelect, queryExamQuestion,
} from '../services/createForm'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'forms',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    searchValuesQuestion: {},
    searchListQuestion: [],
    paginationQuestion: {},
    labelListQuestion: [],//题目分类
    questionKey:1,
    addQuestionStore:false,
    question:{},
    dropdownInitData:[],cascadeInitData:[],
    createTableDefine:'',
    subDataSource:[],
    formDetailSelectRow:null,
    creatFormDataVisible:false,
    showSetPwModalVisible:false,
    filterDate: '',
    vFilter: [],
    InsertFormModalVisit: false,
    previewFrom: [],
    isHide: 'none',
    OneTempDatasList: [],
    onRowList: [],
    selectFromTableVisit: false,
    columns: [],
    dataSourceList: [],
    columnsList: [],
    columnsOne: [],
    dataSourceListOne: [],
    tempTableListId: [],
    updateRowList: [],
    UpdateDataModalVisit: false,
    OneTempDatasListsUpdate: [],
    dataId: '',
    locationId: '',
    editDisabled: false,
    reacdData: {},
    reacdDefind: "",
    isValidate: false,
    activateKey: "1",
    tabDisabled: true,
    value: 1,
    tableList: [],
    keyss: '',
    inputTypeOption: [],
    inputNumberOne: false,
    inputNumberTwo: "Text",
    uuid: 0,
    col_data: 1,
    tempTableList: [],
    initialDefinde: {},
    add: '',
    recordHide: {},
    recordHideOne: {},
    updateModalVisit: false,
    updateOneModalVisit: false,
    updateIndex: [],
    createModalVisit: false,
    eyeModalVisit: false,
    eyeLink: "",
    editValue: {},
    markdownContent: "",
    contentLzEditor: '',
    editorState: EditorState.createEmpty(),
    editorStateOne: "",
    inputOptions: [],
    queryStata: {},
    listLoading: false,
    fileList: [],
    excelModalVisit: false,
    disabledSelect: false,
    TelType: false,
    buttonText: "",
    selectValues: '',
    contactSelectOptions: TableUtils.getContactTypeDefine(),
    contactSelectOptionsUpdate:TableUtils.getContactTypeDefineForUpdate(),
    checked: false,
    dataObjValue: {},
    dataOne: [],
    dataTwo: [],
    vFilterData: [],//表单数据的条件
    optionItem: [],//负责人下拉框
    listLoadingData: false,//表单数据的圈圈
    updateUuid: 0,//修改时生成下拉框的key
    tablePage: {},
    dataPage: {},//表单数据的页数
    schemaColumns: [],
    filertCol: [],
    define: null,
    eyeRecord: [],
    popoverVisible: {},
    echartsVisible: false,
    dataLegend: {},
    dataXAxis: [],
    seriesBar: [],
    seriesPie: [],
    excelFormModalVisit: false,
    isAuthorityForm: false,
    userList: [],
    onMouseDownValues: {},
    onMouseDownIndex: -1,
    shareDataModalVisible: false,
    shareDataValue: {},
    //groupSelectOptions:[],countSelectOptions:[],filterConditions:[],//表单数据浏览时过滤条件生成的参数
    selectedTableColumns:[],//dropdown下拉对应标的列，选择列作为呈现
    lableClassifyTreeData:[],//题型分类
    radioGroupList:{'':{uuid:'',p_option_uuid:null,p_uuid:null,options:[{option:'',score:'',uuid:''}],col_data:''}},//所有的checkgroup类型,是一个对象，不是数组
    delOptionUuid:null,//如果删除了某个单选，则匹配的配置了跳表的都要更新
    subFormShow:{},//容纳被选中的跳题条件选项的uuid
    labelList:[],//存储章节section的数组
    inputLabelValue:'',//存储新建的章节临时数据
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {

      history.listen((location) => {
      if (location.pathname.indexOf('/visit/forms')!=-1) {

          if (location.state != null) {
            dispatch({
              type: 'queryAllTempDataByDefineId',
              payload: {
                define_id: location.state.id,
                projectId: location.state.projectId,
              }
            })
          } else {
            let user = JSON.parse(sessionStorage.getItem("UserStrom"))

            if (user == null) {
              dispatch({
                type: 'app/querys',
                payload: {}
              })
            } else {
              let isAuthorityForm = false;
              if (JSON.parse(sessionStorage.getItem("UserStrom")).roleType == "admin") {
                isAuthorityForm = true
              }

              let activateKey=location.hash=="#2"?"2":"1";
              if(activateKey==1){
                dispatch({
                  type: 'queryTempTable',
                  payload: {
                    activateKey: activateKey,
                    tabDisabled: true,
                    listLoading: true,
                  }
                });
                //初始化
                dispatch({
                  type: 'initFormType',
                  payload: {
                    inputTypeOption: "FormDropdown",
                    uuid: 0,
                    isAuthorityForm:isAuthorityForm
                  }
                });
                /*dispatch({
                  type:'querySuccess',
                  payload:{
                    isAuthorityForm:isAuthorityForm
                  }
                })*/
              }

            }
          }
        }else if(location.pathname.indexOf('/visit/table')!=-1){
        dispatch({
          type: 'queryAllTempDataByDefineId',
          payload: {
            define_id: location.pathname.split("/")[3],
            projectId: null,
          }
        })
      }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *searchListQuestion ({ payload }, { call, put, select }) {
      let labelListQuestion = yield select(({ forms }) => forms.labelListQuestion)
      if (labelListQuestion && labelListQuestion.length < 1) {
        //如果没有缓存则后台查询
        let data = yield call(queryOptions, { id: 4 })
        labelListQuestion = data.list
      }
      const data = yield call(queryExamQuestion, payload)
      if (data.success == true) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchValuesQuestion:payload.searchValuesQuestion,
            searchListQuestion: data.resultList,
            labelListQuestion,
            paginationQuestion: {
              current: data.currentPage,
              pageSize: data.pageSize,
              total: data.total,
              totalPage: data.totalPages,
              showSizeChanger: false,
            },
          },
        })
      }
    },
    *addQuestion({ payload }, {select,put, call}) {
      console.log("---addQuestion---",payload.question);
      let tableList = yield select(({ forms }) => forms.tableList);
      let flag=false;
      for(let i=0;i<tableList.length;i++){
        if(tableList[i].uuid==payload.question.uuid){
          flag=true;
          break;
        }
      }
      if(!flag){
        tableList.push(payload.question);
        message.success('已添加');
      }else{
        message.success('重复添加无效');
      }

      yield put({
        type: 'querySuccess',
        payload: {
          tableList,
        }
      })
    },
    *subFormShowAdd({payload,}, {select,put, call}){
      const subFormShow = yield select(({forms}) => forms.subFormShow);
      //记录是哪个单选控件的，哪个选项被选中
      subFormShow[payload.uuid]=payload.subUuid;
      //console.log("---显示的跳表---",subFormShow);
      yield put({
        type: 'querySuccess',
        payload: {
          subFormShow
        }
      })

    },
    *changeHashPath({payload,}, {put, call}){
      yield put(routerRedux.push('/visit/forms#2'));
    },
    *insertForms({payload,}, {put, call}) {
      //@TODO qq 2020.4.13添加了tableName,对应后台需要修改为create数据库表，修改时同样要用alter修改表名
      //console.log("-------insert form-------");
      const data = yield call(insertForm, payload)
      if (data.flag == '1') {
        yield put({
          type: 'hideCreateModalVisit',
        })
        yield put({
          type: 'queryTempTable',
          payload: {}
        })
        yield put({
          type: 'querySuccess',
          payload: {
            tableList: [],
            keyss: '',
            inputNumberOne: false,
            inputNumberTwo: "Text",
            add: '',
            editorState: EditorState.createEmpty()
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    *updateTempTable({payload,}, {put, call, select}) {
      //@TODO qq 2020.4.13添加了tableName,对应后台需要修改为create数据库表，修改时同样要用alter修改表名
      //console.log("------updateTempTable form--------");
      //console.log(payload);
      const data = yield call(updateTempTables, payload)
      const tablePage = yield select(({forms}) => forms.tablePage)
      const vFilter = yield select(({forms}) => forms.vFilter)

      if (data.flag == '1') {
        yield put({
          type: 'hideUpdateOneModalVisitVisit',
        })
        let value = new Object()
        value = vFilter
        value.pageSize = tablePage.pageSize
        value.currentPage = tablePage.current
        yield put({
          type: 'queryTempTable',
          payload: {
            value
          }
        })
        yield put({
          type: 'querySuccess',
          payload: {
            recordHideOne: {},
            recordHide: {},
            tableList: [],
            value: 1,
            col_data: 1,
            inputNumberOne: false,
            inputNumberTwo: "Text",
            add: '',
            editorState: EditorState.createEmpty(),
            editorStateOne: "",
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    *queryTempDataByIdsupdate({payload,}, {put, call}) {
      const data = yield call(queryTempDataById, payload)
      if (data.flag) {
        payload.reacdData["formTitle"] = data.obj.resultList[0].formTitle
        payload.reacdData["status"] = data.obj.resultList[0].status
        let subFormShow=TableUtils.getShowColumn(JSON.parse(data.obj.resultList[0].define).schema,payload.reacdData,{});
        console.log("---预设的显示题型----",subFormShow);
        yield put({
          type: 'querySuccess',
          payload: {
            reacdData: payload.reacdData,
            reacdDefind: data.obj.resultList[0].define,
            UpdateDataModalVisit:true,
            subFormShow,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    *queryTempDataFrom({payload,}, {put, call}) {
      const data = yield call(queryTempDataFrom, payload)
      if (data.success) {
        if (data.list.length != 0) {
          let obj = new Object()
          let objOne = new Object()
          obj.ios = data.list[0].ios
          obj.android = data.list[0].android
          obj.windows = data.list[0].windows
          objOne.defaultFrom = data.list[0].defaultFrom
          objOne.qq = data.list[0].qq
          objOne.weibo = data.list[0].weibo
          objOne.weixin = data.list[0].weixin
          yield put({
            type: 'querySuccess',
            payload: {
              dataOne: obj,
              dataTwo: objOne,
              activateKey: "3",
            }
          })
        }
      } else {
        message.warning(data.message)
      }
    },
    //查询负责人
    *SelectPrincipalAll({payload}, {call, put}){
      const data = yield call(SelectPrincipal, payload);
      if (data.success == true) {
        const item = []
        if (data.list.length > 0) {
          for (var a in data.list) {
            item.push(<Option key={data.list[a].id}>{data.list[a].userName}</Option>)
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            selectList: data.list,
            optionItem: item
          }
        })
      }
    },
    //查询所有表单
    *queryTempTable({payload,}, {put, call}) {
      const data = yield call(queryTempTables, payload);
      if (data.flag == '1') {
        let obj = new Object()
        obj.total = data.obj.total
        obj.current = data.obj.currentPage
        obj.pageSize = data.obj.pageSize
        obj.totalPages = data.obj.totalPages
        yield put({
          type: 'querySuccess',
          payload: {
            activateKey: "1",
            paginations: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            tablePage: obj,
            tempTableList: data.obj.resultList,
            listLoading: false,
            excelFormModalVisit: false,
          }
        })
      } else {
        yield put({
          type: 'queryTempTableSuccess',
          payload: {

            activateKey: "1",
            paginations: {
              total: 0,
              current: 0,
              pageSize: 0,
              totalPages: 0,
            },
            tempTableList: [],
            filterDate: undefined,
            listLoading: false,
            excelFormModalVisit: false,

          }
        })
      }
      yield put({
        type: 'SelectPrincipalAll',
        payload: {
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
        }
      });

      yield put({
        type: "queryAllActiveStaff",
        payload: {
          //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
        }
      })
    },
    *queryTempTableById({payload,}, {put, call}) {
      const data = yield call(queryTempTableByIds, payload)
      if (data.flag == '1') {
        let objOne = JSON.parse(data.obj.define)
        let dataObj = new Object()
        let dataObjValue = new Object()
        let dataOne = objOne.schema
        for (var k in dataOne) {
          if (dataOne[k].contactType != undefined) {
            //所有的列
            dataObj[dataOne[k].col_data] = dataOne[k].contactType;
          }
        }
        dataObjValue.columns = dataObj
        yield put({
          type: 'querySuccess',
          payload: {
            tempTableListId: data.obj,
            dataObjValue: dataObjValue,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    *onTempTableExcelModel({payload,}, {put, call})
    {
      const data = yield call(onTempTableExcelModel, payload)
      if (data.success) {
        let str = data.list[0].split("/")
        Modal.confirm({
          title: '确认框',
          content: '是否下载？',
          onOk() {
            window.open(download + "/" + str[str.length - 1]);
          },
          onCancel() {
            return
          }
        })
      } else {
        message.warning("下载失败")
      }
    }
    ,
    *deleteTempTablesAll({payload,}, {put, call, select})
    {
      const data = yield call(deleteTempTable, payload)
      const tablePage = yield select(({forms}) => forms.tablePage)
      const vFilter = yield select(({forms}) => forms.vFilter)
      if (data.flag == '1') {
        let value = new Object()
        value = vFilter
        value.pageSize = tablePage.pageSize
        value.currentPage = tablePage.current
        yield put({
          type: 'queryTempTable',
          payload: {
            value
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    }
    ,
// 添加模板表数据
    *createTempDatas({payload,}, {put, call, select})
    {
      const data = yield call(createTempData, payload)
      const chek = yield select(({forms}) => forms.dataId)
      const queryStata = yield select(({forms}) => forms.queryStata)
      if (data.flag == '1') {
        message.success(data.message)
        if (queryStata != null) {
          yield put({
            type: 'queryAllTempDataByPage',
            payload: {
              define_id: queryStata.id,
              projectId: queryStata.projectId,
              //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
            }
          })
        } else {
          yield put({
            type: 'queryAllTempDataByPage',
            payload: {
              define_id: chek,
              //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
            }
          })
        }
        yield put({
          type: 'hideEditFormVisitVisible',
          payload: {
            editValue: {},
            tempTableListId: [],
            queryStata: {},
          }
        })
      } else {
        yield put({
          type: 'hideEditFormVisitVisible'
        })
        message.warning(data.message)
      }
    },
// eye模板表数据
    *EyeTempDatas({payload,}, {put, call, select})
    {
      const data = yield call(createTempData, payload)
      if (data.flag == '1') {
        yield put({
          type: 'hideeyeModalVisit',
          payload: {
            editValue: {},
          }
        })
        message.success(data.message)
      } else {
        yield put({
          type: 'hideEditFormVisitVisible'
        })
        message.warning(data.message)
      }
    },
// 修改模板表数据
    *updateTempDatas({payload,}, {put, call, select})
    {
      //console.log("---updateTempDatas--",payload);
      //const define = yield select(({forms}) => forms.define)
      //payload.define=define;
      const data = yield call(createTempData, payload)
      const dataSourceList = yield select(({forms}) => forms.dataSourceList)
      if (data.flag == '1') {
        if(payload.method=='update'){
          dataSourceList.splice(payload.updateIndex, 1, payload.value);
        }else{
          dataSourceList.unshift( payload.value)
        }

        yield put({
          type: 'querySuccess',
          payload: {
            queryStata: {},
            dataSourceList: dataSourceList,
            UpdateDataModalVisit: false,
            creatFormDataVisible:false,
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
// 删除模板表数据
    *deleteTempDatas({payload,}, {put, call, select})
    {
      const data = yield call(deleteTempData, payload)
      const dataSourceList = yield select(({forms}) => forms.dataSourceList)
      const dataPage = yield select(({forms}) => forms.dataPage)
      if (data.flag == '1') {
        message.success(data.message)
        dataSourceList.splice(payload.deleteIndex, 1);
        dataPage.total = dataPage.total - 1
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              total: dataPage.total,
              current: dataPage.currentPage,
              pageSize: dataPage.pageSize,
              totalPages: dataPage.totalPages,
            },
            dataSourceList: dataSourceList,
            dataPage: dataPage,
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    *queryAllTempDataByFormId({payload,}, {put, call, select,}){

    },
    *getTableMatchColumns({payload,}, {put, call, select,}){
      const data = yield call(getTableColumns, payload);
      if(data.flag == '1'){
        yield put({
          type: 'querySuccess',
          payload: {
            selectedTableColumns: data.obj
          }
        })
      }
    },
    // 分页查询模板表所有数据
    *queryAllTempDataByPage({payload,}, {put, call, select,location}){
      const data = yield call(queryAllTempDataByPage, payload);
      let filterFormValue = TableUtils.filterForm(JSON.parse(data.obj.temp.define));
      let columnRelateContactValue = TableUtils.columnRelateContact(data.obj);
      if (data.flag == '1') {
        let tableColumns = TableUtils.tableDataAnalysis(data.obj.temp.define);
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            columns: tableColumns,//数据列定义
            dataSourceList: data.obj.resultList,//数据列值
            filertCol: filterFormValue,//数据查询的条件
            dataObjValue: columnRelateContactValue,//导入时后台使用
            listLoadingData: true,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            ...payload,
          }
        })
        //if(data.obj.currentPage==1){
          //@qq 兼容两个页面

        //}
      } else {
        //没有数据情况下
        //console.log("----------queryAllTempDataByPage--------",5);
        let value = TableUtils.parseTableDefine(data.obj.temp.define);
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              total: 0,
              current: 0,
              pageSize: 10,
              totalPages: 0,
            },
            columns: value,
            dataSourceList: [],
            filertCol: filterFormValue,
            dataObjValue: columnRelateContactValue,//导入时后台使用
            listLoadingData: false,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            echartsVisible: false,
            daaXAxis: [],
            seriesBar: [],
            seriesPie: [],
            ...payload,
          }
        })
      }

    },

    //查询图表数据
    *queryEcharsData({payload,}, {put, call, select,}){

      const data = yield call(queryAllTempData, payload);
      if (data.flag == '1') {
        let define = JSON.parse(data.obj.temp.define);
        let dataList = data.obj.resultList;
        let groupby = define.groupBy;
        let dataXAxis = [];
        let seriesBar = [];
        let seriesPie = [];
        let dataLegend = TableUtils.getDataLegend(define);//获取图表展示维度

        let beginRadius = 0;
        let endRadius = 70;//最大90%

        let dataLegendPros = Object.keys(dataLegend);
        let radiusArr = TableUtils.caculatorPieRadius(77, dataLegendPros.length);
        // console.log(radiusArr);
        for (let iCount = 0; iCount < dataLegendPros.length; iCount++) {
          let p = dataLegendPros[iCount];
          let dataLine = [];//Y轴需显示的数据值
          let dataPie = [];//饼图需显示的数据值
          let markPointsArr = [];//显示数据标记，注意和tooltip区分

          for (let i in dataList) {
            //将数据放入数组
            dataLine.push(dataList[i][p]);
            //每个点上面默认显示自己的值
            markPointsArr.push({value: dataList[i][p], xAxis: parseInt(i), yAxis: dataList[i][p]});

            if (dataList[i][groupby[0]] && iCount < 1) {
              let groupStr = "";
              for (let group in groupby) {
                group > 0 ? groupStr += "-" + dataList[i][groupby[group]] : groupStr += dataList[i][groupby[group]];
              }
              dataXAxis.push(groupStr);
            }
            let groupStrBuff = "";
            for (let group in groupby) {
              group > 0 ? groupStrBuff += "-" + dataList[i][groupby[group]] : groupStrBuff += dataList[i][groupby[group]];
            }
            dataPie.push({value: dataList[i][p], name: groupStrBuff});

          }

          //饼图每个维度的配置,这里把内部维度的标签都隐藏了
          let labelProps = iCount == dataLegendPros.length - 1 ? {} : {
            label: {
              normal: {
                show: false,
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
          }

          seriesPie.push(
            {
              name: dataLegend[p],
              type: 'pie',
              radius: radiusArr[iCount],

              data: dataPie,
              ...labelProps,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          );
          beginRadius = endRadius + 10;
          endRadius = beginRadius + 35;

          //线和柱形图每个维度的配置
          seriesBar.push(
            {
              name: dataLegend[p],
              type: 'line',
              data: dataLine,
              areaStyle: {},
              markPoint: {
                symbol: 'circle',
                symbolOffset: [0, '-30%'],
                itemStyle: {color: 'none', opacity: 1, borderType: 'none', borderColor: 'none'},
                label: {
                  default: true,
                  color: '#c3c3c3',
                },
                data: markPointsArr,
              },
            });


        }
        let echartsBarLineSetting = TableUtils.createBarLineSetting(dataXAxis, seriesBar);
        let echartsPieSetting = TableUtils.createPieSetting(seriesPie);
        // console.log(echartsPieSetting);
        yield put({
          type: 'querySuccess',
          payload: {
            echartsPieSetting: echartsPieSetting,
            echartsBarLineSetting: echartsBarLineSetting,
            ...payload,
          }
        })
      }

    },

    // 根据项目id查询模板表所有数据
    *queryAllTempDataByDefineId({payload,}, {put, call, select,}){
      const data = yield call(queryAllTempDataByDefineId, payload);
      let filterFormValue = TableUtils.filterForm(JSON.parse(data.obj.temp.define));
      let columnRelateContactValue = TableUtils.columnRelateContact(data.obj);
      if (data.flag == '1') {
        let tableColumns = TableUtils.tableDataAnalysis(data.obj.temp.define);
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              total: data.obj.total,
              current: data.obj.currentPage,
              pageSize: data.obj.pageSize,
              totalPages: data.obj.totalPages,
            },
            columns: tableColumns,//数据列定义
            dataSourceList: data.obj.resultList,//数据列值
            filertCol: filterFormValue,//数据查询的条件
            dataObjValue: columnRelateContactValue,//导入时后台使用
            // listLoadingData: true,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            activateKey: "2",
            tabDisabled: false,
            ...payload,
          }
        })
      } else {
        //没有数据情况下
        let value = TableUtils.parseTableDefine(data.obj.temp.define);
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              total: 0,
              current: 0,
              pageSize: 10,
              totalPages: 0,
            },
            columns: value,
            dataSourceList: [],
            filertCol: filterFormValue,
            dataObjValue: columnRelateContactValue,//导入时后台使用
            // listLoadingData: false,
            tableDefine: JSON.parse(data.obj.temp.define),//schemaColumns
            echartsVisible: false,
            daaXAxis: [],
            seriesBar: [],
            seriesPie: [],
            activateKey: "2",
            tabDisabled: false,
            ...payload,
          }
        })
      }
    },

    //清除模板的所有数据
    *clearAllData({payload,}, {put, call, select}){
      const data = yield call(clearAllData, payload);
      const tempTableList = yield select(({forms}) => forms.tempTableList);
      if (data.flag === 1) {
        payload.record.dataCounts = "0"
        tempTableList.splice(payload.index, 1, payload.record);
        yield put({
          type: 'querySuccess',
          payload: {
            tempTableList: tempTableList,
          }
        })
        message.success("删除成功，共删除" + data.obj.count + "条数据");
      } else {
        message.warning(data.message);
      }
    },
    *modifyPw({payload,}, {put, call, select}){

      yield call(modifyPw, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          ...payload,
        }
      })
    },
    //添加分享链接
    *createShareUrl({payload,}, {put, call, select}){
      const data = yield call(createShareUrl, payload.payloadValue);
      if (data.flag === 1) {
        payload.value.shareUrlId = data.obj;
        if (payload.payloadValue.srcUrl != undefined) {
          yield put({
            type: 'querySuccess',
            payload: {
              shareDataValue: payload.value,
            }
          })
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              eyeRecord: payload.value,
            }
          })
        }
      } else {
        message.warning(data.message);
      }
    }, //添加分享链接
    *updateIsConditions({payload,}, {put, call, select}){
      const data = yield call(updateIsConditions, payload);
      if (data.flag === 1) {
        message.success(data.message)
      } else {
        message.warning(data.message);
      }
    },
    *updateTempDataRemark({payload,}, {put, call, select}){
      const data = yield call(updateTempDataRemark, payload);
      const dataSourceList = yield select(({forms}) => forms.dataSourceList)
      if (data.flag == '1') {
        dataSourceList.splice(payload.updateIndex, 1, payload.value);
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceList: dataSourceList,
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },

    //关注
    *insertFocusFrom({payload = {}}, {call, put,select}){
      const data = yield call(insertFocusProject, payload);
      const tempTableList = yield select(({forms}) => forms.tempTableList)
      if (data.flag == 1) {
        tempTableList[payload.index].focusId = data.obj
        yield put({
          type: 'querySuccess',
          payload: {
            tempTableList: tempTableList,
          }
        })
        message.success(data.message)
      } else {
        message.warning(data.message)
      }
    },
    //取消关注
    *deleteFocusFrom ({payload = {}}, {call, put,select}){
      const data = yield call(deleteFocusProject, payload);
      const tempTableList = yield select(({forms}) => forms.tempTableList)
      if (data.flag == 1) {
        tempTableList[payload.index].focusId = null
        yield put({
          type: "querySuccess",
          payload: {
            tempTableList: tempTableList,
          }
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    },
    //下载表单数据
    *downFromDataExcel({payload,}, {put, call, select}){
      const data = yield call(downFromDataExcel, payload)
      Modal.confirm({
        title: '确认框',
        content: '是否下载？',
        onOk() {
          if (data.success) {
            let str = data.list[0].split("/")
            window.open(download + "/" + str[str.length - 1]);
          } else {
            message.warning("下载失败")
          }
        },
        onCancel() {
          return
        }
      })
    },
    //查询所有用户
    *queryAllActiveStaff ({payload = {}}, {call, put}){
      const data = yield call(queryAllActiveStaff, payload);
      if (data.success) {
        yield put({
          type: "querySuccess",
          payload: {
            userList: data.list,
          }
        })
      }
    },
    *querySubData ({payload = {}}, {call, put}){
      const data = yield call(querySubData, payload);
      if (data.success) {
        let tableColumns = TableUtils.tableDataAnalysis(data.obj.temp.define);
        let subDataDefine = JSON.parse(data.obj.temp.define);
        subDataDefine.define_id=data.obj.temp.id;
        subDataDefine.formTitle=data.obj.temp.formTitle;
        yield put({
          type: "querySuccess",
          payload: {
            subDataSource: data.obj.resultList,
            subDataColumn:tableColumns,
            subDataDefine:JSON.stringify(subDataDefine),
            ...payload
          }
        })
      }
    },
    //选择自定表单类型时，需要的话从从后台查询初始值，如
    *initFormType ({payload = {}}, {call, put}){
      let dropdownInitData;
      let cascadeInitData;
      if(payload.inputTypeOption=="FormDropdown"){
        //querySubTables
        const data = yield call(querySubTables, payload);
        //console.log("---",data);
        /*        dropdownInitData=[
          {name:'用户表',value:'user'},
          {name:'项目表',value:'project'},
          {name:'网络调研表',value:'web_ask'},
          {name:'现场调研',value:'where_ask'},
        ]; //后端取数据*/
        if(data.success){
          dropdownInitData=data.list;
        }

      }else if(payload.inputTypeOption=="Cascade"){
        //TODO qq 需要将数据存在数据库，目前在前端json
        cascadeInitData=[];//后端取数据
      }else{

      }
      yield put({
        type: "querySuccess",
        payload: {
          dropdownInitData:dropdownInitData,
          cascadeInitData:cascadeInitData,
          ...payload
        }
      })
    } ,
    *getTableColumns ({payload = {}}, {call, put}){
        const data = yield call(getTableColumns, payload);
        //console.log("---",data);
      let selectedTableColumns=[];
      if(data.success){
        selectedTableColumns=data.obj;
        yield put({
          type: "querySuccess",
          payload: {
            selectedTableColumns:selectedTableColumns,
          }
        })
      }
    },
    *addColumn ({payload = {}}, {call, select,put}){
/*      let lableClassifyTreeData = yield select((state)=>state.forms.lableClassifyTreeData );
      if(!lableClassifyTreeData||lableClassifyTreeData.length==0){
        const data = yield call(getLabelForSelect, payload);
        if(data.success){
          lableClassifyTreeData=data.obj;
        }
      }*/

      yield put({
        type: "querySuccess",
        payload: {
          ...payload,
          lableClassifyTreeData:[],
          value:2,
        }
      })
    },
    *showUpdateModalVisit({payload = {}}, {call,select, put})
    {
      //修改时初始化一些数据
      let selectedTableColumns=[];

      //如果是下拉表选择
      if(payload.dropdownTableName){
        const data = yield call(getTableColumns, payload);
        if(data.success){
          selectedTableColumns=data.obj;
        }
      }

/*      let lableClassifyTreeData= yield select((state)=>state.forms.lableClassifyTreeData );
      if(!lableClassifyTreeData||lableClassifyTreeData.length==0){
        const data = yield call(getLabelForSelect, payload);
        if(data.success){
          lableClassifyTreeData=data.obj;
        }
      }*/

      yield put({
        type: "querySuccess",
        payload: {
          ...payload,
          selectedTableColumns:selectedTableColumns,
          lableClassifyTreeData:[]
        }
      })

    }
  },
  reducers: {
    querySuccess(state, {payload})
    {
      return {...state, ...payload}
    }
    ,
    showEditFormVisitVisible(state, {payload})
    {
      return {...state, ...payload, InsertFormModalVisit: true,}
    }
    ,
    hideEditFormVisitVisible(state, {payload})
    {
      return {...state, ...payload, InsertFormModalVisit: false,}
    }
    ,
    showSelectFromTableVisitVisible(state, {payload})
    {
      return {...state, ...payload, selectFromTableVisit: true,}
    }
    ,
    hidSelectFromTableVisitVisible(state, {payload})
    {
      return {...state, ...payload, selectFromTableVisit: false,}
    }
    ,
    showcreateModalVisit(state, {payload})
    {
      return {...state, ...payload, createModalVisit: true,}
    }
    ,
    hideCreateModalVisit(state, {payload})
    {
      return {...state, ...payload, createModalVisit: false,}
    }
    ,
    hideUpdateModalVisit(state, {payload})
    {
      return {...state, ...payload, updateModalVisit: false,}
    }
    ,
    showUpdateOneModalVisitVisit(state, {payload})
    {
      return {...state, ...payload, updateOneModalVisit: true,}
    }
    ,
    hideUpdateOneModalVisitVisit(state, {payload})
    {
      //console.log("------2------");
      return {...state, ...payload, updateOneModalVisit: false,}
    }
    ,
    showeyeModalVisit(state, {payload})
    {
      return {...state, ...payload, eyeModalVisit: true,}
    }
    ,
    hideeyeModalVisit(state, {payload})
    {
      return {...state, ...payload, eyeModalVisit: false,}
    }
    ,
    showExcelModalVisit(state, {payload})
    {
      return {...state, ...payload, excelModalVisit: true,}
    }
    ,
    hideExcelModalVisit(state, {payload})
    {
      return {...state, ...payload, excelModalVisit: false,}
    }
    ,
  }
  ,
})
