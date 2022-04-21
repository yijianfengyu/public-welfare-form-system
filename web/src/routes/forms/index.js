import React from 'react'
import {connect} from 'dva'
import {Form, Tabs, Spin , message} from 'antd'
import List from './List'
import Filter from './Filter'
import styles from '../../themes/index.less'
import formStyles from './index.less'
import FormData from './formData/FormDataList';
import FormDataFilter from './formData/FormDataFilter';
import ShareDataModal from './formData/Modal/ShareDataModal';
import TableCreateModal from './TableCreateModal'
import Chart1 from './chart/Chart1'
import Chart2 from './chart/Chart2'
import Chart3 from './chart/Chart3'
import Chart4 from './chart/Chart4'
import EyeModal from './EyeModal'
import CreateFormDataModal from './formData/CreateFormDataModal'
import TableUpdateModal from './TableUpdateModal'
import moment from 'moment';
import TableUtils from "../../utils/TableUtils";
import SetPwMoal from "./formData/SetPwModal";
import UpdateFormDataModal from './formData/UpdateFormDataModal'

const Forms = ({
  location, dispatch, forms, loading, form: {}
  }) => {
  const {questionKey,dropdownInitData,cascadeInitData,formTitle,subDataSource,subDataColumn,rowDataId,createTableDefine,subDataDefine,
    formDetailSelectRow,showSetPwModalVisible,creatFormDataVisible,formRecord,
    updateUuid, listLoadingData,echartsVisible,dataLegend,dataXAxis,seriesBar,seriesPie, optionItem, vFilterData, selectValues, dataOne, dataTwo, dataObjValue, checked, contactSelectOptions, TelType, buttonText, excelModalVisit,excelFormModalVisit, disabledSelect, listLoading, fileList, queryStata, previewFrom, editDisabled, dataId, filertCol, locationId, reacdData, reacdDefind, tabDisabled, editorStateOne,
    OneTempDatasListsUpdate, UpdateDataModalVisit, dateString, activateKey, contentLzEditor, inputOptions,eyeRecord,contactSelectOptionsRecover,
    tempTableListId, dataSourceList, columns, selectFromTableVisit, markdownContent, editorState, initialPageDefine,contactSelectOptionsUpdate
    , onRowList, OneTempDatasList, filterDate, tempTableList, pagination, vFilter, EditFormVisit, isHide, eyeLink, paginations,shareDataValue,
    value, tableList, recordHide, keyss, inputTypeOption, inputNumberOne, inputNumberTwo, uuid, dataPage,popoverVisible,onMouseDownValues,onMouseDownIndex,
    col_data, createModalVisit, add, updateOneModalVisit, updateModalVisit, updateIndex, recordHideOne, eyeModalVisit, editValue,shareDataModalVisible,
    groupSelectOptions, countSelectOptions, filterConditions,tableDefine,tablePage,echartsBarLineSetting,echartsPieSetting,isAuthorityForm,userList,selectedTableColumns,lableClassifyTreeData,
    radioGroupList,delOptionUuid,subFormShow,
  } = forms;
  //console.log("--index--",selectedTableColumns);
  const TabPane = Tabs.TabPane;
  //浏览器事件
  window.onpopstate = function () {

  }
  //console.log("----------index--------",1);
  const FromListsProps = {//分页
    dispatch,
    location,
    contactSelectOptionsUpdate,
    EditFormVisit,
    previewFrom,
    activateKey,
    tabDisabled,
    isHide,
    editDisabled,
    onRowList,
    tempTableList,
    dataSource: tempTableList,
    paginations,
    isAuthorityForm,
    onChange(page) {
      let value = new Object()
      value = vFilter
      value.pageSize = page.pageSize
      value.currentPage = page.current
      dispatch({
        type: "forms/queryTempTable", payload: {
          value,
          listLoading: true,
        }
      })
    }
  }
  //筛选条件的事件
  const filterProps = {
    dispatch,
    excelFormModalVisit,
    filterDate,
    optionItem,
    tablePage,
    locationId,
    fileList,
    location,
    dataObjValue,
    onFilterChange(value) {
      dispatch({
        type: 'forms/queryTempTable',
        payload: {
          creator: value.creatorName,
          dateCreated: value.dateCreated,
          formTitle: value.formTitle,
          vFilter: value,
          listLoading: true,
        }
      })
    },
  }

  const FormDataProps = {
    subDataDefine,
    subDataColumn,
    subDataSource,
    location,
    dispatch,
    OneTempDatasList,
    pagination,
    selectFromTableVisit,
    dateString,
    dataId,
    reacdData,
    reacdDefind,
    vFilterData,
    dataSource: dataSourceList,
    columns: columns,
    tableDefine: tableDefine,
    popoverVisible,
    formDetailSelectRow,
    onChange(page) {
      dispatch({
        type: "forms/queryAllTempDataByPage", payload: {
          define: JSON.stringify(tableDefine),
          pageSize: page.pageSize,
          currentPage: page.current,
          listLoadingData: false,
        }
      })

    }
  }
  const FormDataFilterProps = {// 表单数据
    formRecord,
    showSetPwModalVisible,
    dispatch,
    excelModalVisit,
    filertCol,
    locationId,
    OneTempDatasList,
    fileList,
    location,
    selectValues,
    dataObjValue,
    dataPage,
    activateKey,
    tableDefine,
    columns,
    dataSourceList,
    echartsVisible, dataLegend, dataXAxis, seriesBar, seriesPie, echartsBarLineSetting, pagination,
    onFilterChange(value) {
      //将界面查询条件的值放入标准格里面进行赋值
      TableUtils.settingTableDefineValues(tableDefine, value);
      dispatch({
        type: 'forms/queryAllTempDataByPage',
        payload: {
          define: JSON.stringify(tableDefine),
          listLoadingData: false,
          pageSize: "10",
          currentPage: "1",
          echartsVisible: false,
          dataLegend: {},
          dataXAxis: [],
          seriesBar: [],
          seriesPie: [],
        }
      })
    },
    onFilterEchartsChange(value) {
      //将界面查询条件的值放入标准格里面进行赋值
      TableUtils.settingTableDefineValues(tableDefine, value);
      let echartsVisible = false;
      if (tableDefine.countBy.length > 0) {
        echartsVisible = true;
        dispatch({
          type: 'forms/queryEcharsData',
          payload: {
            define: JSON.stringify(tableDefine),
            listLoadingData: false,
            echartsVisible: echartsVisible,
          }
        })
      } else {
        message.warning('必须同时选择分组和统计条件才能操作！');
      }

    },
  }

  const UpdateDataModalProps = {
    location,
    dispatch,
    UpdateDataModalVisit,
    OneTempDatasListsUpdate,
    dataId,
    reacdData,
    reacdDefind,
    dataObjValue,
    subFormShow,
    questionKey,
  }

  function callback(key) {
    if (key == "1") {
      dispatch({
        type: 'forms/querySuccess',
        payload: {
          pagination: {
            total: 0,
            current: 0,
            pageSize: 0,
            totalPages: 0,
          },
          columns: [],
          filertCol: [],
          dataSourceList: [],
          activateKey: "1",
          tabDisabled: true,
        }
      })
    } else if (key == "3") {
      dispatch({
        type: 'forms/queryTempDataFrom',
        payload: {
          companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
          define_id: locationId,
        }
      })
    } else if (key == "2") {
      dispatch({
        type: 'forms/querySuccess',
        payload: {
          activateKey: "2"
        }
      })
    }
  }

  const createFormModalProps = {
    forms,
    dropdownInitData,cascadeInitData,
    dispatch,
    location,
    value,
    contactSelectOptions,
    TelType,
    buttonText,
    tableList,
    recordHide,
    keyss,
    inputTypeOption,
    inputNumberOne,
    inputNumberTwo,
    uuid,
    updateUuid,
    disabledSelect,
    createModalVisit,
    col_data,
    add,
    editValue,
    editorState,
    updateIndex,
    recordHideOne,
    inputOptions,
    updateModalVisit,
    isAuthorityForm,
    userList,
    onMouseDownValues,
    onMouseDownIndex,
    selectedTableColumns,
    lableClassifyTreeData,
    radioGroupList,
    delOptionUuid,
  }
  const updateFormModalsProps = {
    forms,
    dropdownInitData,cascadeInitData,
    updateOneModalVisit,
    dispatch,
    location,
    contactSelectOptionsRecover,
    value,
    tableList,
    updateIndex,
    updateModalVisit,
    recordHideOne,
    recordHide,
    keyss,
    inputTypeOption,
    inputNumberOne,
    inputNumberTwo,
    uuid,
    updateUuid,
    col_data,
    add,
    markdownContent,
    contentLzEditor,
    editorStateOne,
    inputOptions,
    TelType,
    disabledSelect,
    buttonText,
    contactSelectOptions,
    tempTableList,
    isAuthorityForm,
    userList,
    onMouseDownValues,
    onMouseDownIndex,
    selectedTableColumns,
    lableClassifyTreeData,
    radioGroupList,
    delOptionUuid,
  }
  const EyeModalProps = {
    dispatch,
    tempTableListId,
    eyeModalVisit,
    eyeLink,
    editValue,
    location,
    checked,
    dataObjValue,
    eyeRecord,
  }
  const SetPwProps = {
    dispatch,
    tableDefine:tableDefine,
  }

  const CreateFormDataProps = {
    dispatch,
    createTableDefine:createTableDefine,
    rowDataId,
    subFormShow,
    questionKey,
  }
  /*let text2Data1 = ['201801', '201802', '201803'];
   let text2Data2 = ['1', '2', '3'];
   let text2Data3 = [];*/
  let textData1 = ['windows', 'android', 'ios'];
  let textData2 = [
    {value: dataOne.windows, name: 'windows'},
    {value: dataOne.android, name: 'android'},
    {value: dataOne.ios, name: 'ios'},
  ];
  let textData3 = ['其他渠道', '微信', '微博', 'QQ'];
  let textData4 = [
    {value: dataTwo.defaultFrom, name: '其他渠道'},
    {value: dataTwo.weixin, name: '微信'},
    {value: dataTwo.weibo, name: '微博'},
    {value: dataTwo.qq, name: 'QQ '},
  ];
  const Chart3Props = {
    textData1,
    textData2,
  };
  const Chart4Props = {
    textData3,
    textData4,
  };

  const Chart1Props = {
    dataLegend, dataXAxis, seriesBar, echartsBarLineSetting
  };
  const Chart2Props = {
    dataLegend, dataXAxis, seriesPie, echartsPieSetting
  };
  const ShareDataModalProps = {
    dispatch,
    tableDefine,
    shareDataValue,
    maskClosable: false,
    visible: shareDataModalVisible,
  }
  //console.log("----------index--------",2);
  let tabStatus=location.pathname.indexOf("/visit/table")!=-1?8:0;
  return (
    <Tabs activeKey={activateKey} onTabClick={callback} className={styles.div1} style={{minWidth: '540px',marginTop:'40px'}}>
      {tabStatus==0 && <TabPane tab="表单列表" key="1">
        <div>
          <Filter {...filterProps} name="filter"/>
          <Spin spinning={listLoading}>
            <List {...FromListsProps} style={{marginTop: "10px"}}/>
          </Spin>
          {createModalVisit && <TableCreateModal {...createFormModalProps}/>}
          {updateOneModalVisit && <TableUpdateModal {...updateFormModalsProps}/>}
          {eyeModalVisit && <EyeModal {...EyeModalProps}/>}

        </div>
      </TabPane>}

      <TabPane tab="表单数据列表" key="2" disabled={tabDisabled}>
        {activateKey == 2 &&
        <div>
          <FormDataFilter {...FormDataFilterProps} name="filter"/>
          <div className={styles.table}>
            <Spin spinning={listLoadingData}>

              <FormData {...FormDataProps} style={{marginTop: "10px"}}/>
              {shareDataModalVisible && <ShareDataModal {...ShareDataModalProps}/>}
            </Spin>
            {UpdateDataModalVisit && <UpdateFormDataModal {...UpdateDataModalProps}/>}
            {showSetPwModalVisible && <SetPwMoal {...SetPwProps}/>}
            {creatFormDataVisible && <CreateFormDataModal {...CreateFormDataProps} />}
          </div>
          {echartsVisible && <div>
            <div>
              <Chart1 {...Chart1Props}/>
            </div>

            <div >
              <Chart2 {...Chart2Props}/>
            </div>
          </div>
          }
        </div>
        }
      </TabPane>
      <TabPane tab="表单反馈统计" key="3" disabled={tabDisabled} style={{paddingTop:'15px'}}>
        {activateKey == 3 && <div>
          <div style={{float: "left", width: "50%"}}>
            <Chart3 {...Chart3Props}/>
          </div>
          <div style={{float: "right", width: "50%"}}>
            <Chart4 {...Chart4Props}/>
          </div>
        </div>
        }
      </TabPane>
    </Tabs>
  )
}


export default connect(({forms, loading}) => ({forms, loading}))((Form.create())(Forms))
