import React from 'react'
import { Table,Tooltip,Icon,Popconfirm,Spin} from 'antd';
import styles from './List.less'
import {Link} from 'dva/router'
import {changeTableColorByClick} from '../../utils/common'
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import {sharedLinks} from '../../utils/config'
import { config} from 'utils'
import TablesUtils from "../../utils/TableUtils";
import TableUtils from "../../utils/TableUtils";
const {api} = config
const {urls} = api
const List = ({
  paginations, dispatch,contactSelectOptionsUpdate,isAuthorityForm,checkboxGroupList,radioGroupList, ...tableProps
  }) => {
  let widths = {x: 900};

  const columns = [
    {
      title: '表单名称',
      dataIndex: 'formTitle',
      key: 'formTitle',
      width: '300px',
      render: (text, record)=> {
        return <Link onClick={tabClick.bind(record)} style={{border: 'none'}}>{text}</Link>
      }
    },
  /**{
      title: '备注',
      dataIndex: 'formDescription',
      key: 'formDescription',
      width: '100px',
      /**render:(text,record)=>{
        return (<Tooltip placement="top" title={text}>
          <div dangerouslySetInnerHTML={{__html: text}}/>
        </Tooltip>);
      }**/
    {
      title: '反馈数',
      dataIndex: 'dataCounts',
      key: 'dataCounts',
      width: '100px'
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: '100px'
    },
    {
      title: '提交时间 ',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '100px',
      render: (text, record) => {
        if (record.dateCreated != null) {
          if (record.dateCreated.length > 19) {
            text = record.dateCreated.substr(0, 19);
          }
        }
        return text
      }
    },
    {
      title: '操作',
      width: '100px',
      render: (text, record, index) => {

        //let links = window.location.protocol + "//" + window.location.host + "/visit/selectForms?id=" + record.id + "&code=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode;

        function eyeClick() {
          let define = JSON.parse(record.define);
          let schema = define.schema;
          for (let i in schema) {
            if (schema[i].visual === "static") {
              delete schema[i];
            }
    /*        if(schema[i].type="FormRadioGroup"){
              checkboxGroupList[schema[i].col_data]=schema[i];
            }*/
          }
          //let links = window.location.protocol + "//" + window.location.host + "/visit/selectForms?id=" + record.id + "&code=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode;

          let shareFrom = urls + "/temp/dataShare?id=" + encodeURIComponent(record.id) + "&code=" + JSON.parse(sessionStorage.getItem("UserStrom")).companyCode + "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
          record.define = JSON.stringify(define)
          record.shareUrlId = undefined
          dispatch({
            type: 'forms/showeyeModalVisit',
            payload: {
              eyeLink: shareFrom,
              eyeRecord: record,
              //checkboxGroupList,
            }
          })
        }

        function onClick() {
          var defineOne = JSON.parse(record.define)
          var columns = defineOne.schema;
          let {objList,contactSelectOptionsUpdate,radioGroupList} = TableUtils.fomatDefineColumnJson(columns);
          const contentBlock = htmlToDraft(record.formDescription);
          let editorStateOne;
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorStateOne = EditorState.createWithContent(contentState);
          }

          dispatch({
            type: 'forms/showUpdateOneModalVisitVisit',
            payload: {
              labelList:defineOne.label,
              recordHide: record,
              tableList: objList,
              contactSelectOptions: contactSelectOptionsUpdate,
              value: 1,
              editorStateOne: editorStateOne,
              inputNumberTwo: "Text",
              inputTypeOption: "Text",
              disabledSelect: false,
              TelType: false,
              buttonText: "",
              radioGroupList,
            }
          })
        }

        function deleteClick() {
          dispatch({
            type: 'forms/deleteTempTablesAll',
            payload: {
              id: record.id,
              //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
            }
          })
        }

        //清空数据
        function cleanClick() {
          dispatch({
            type: 'forms/clearAllData',
            payload: {
              id: record.id,
              creator: record.creator,
              index: index,
              record,
            }
          })
        }

        //关注表单
        function focusClick() {
          dispatch({
            type: 'forms/insertFocusFrom',
            payload: {
              projectId: record.id,
              type: "form",
              index: index,
            }
          })
        }

        //取消关注表单
        function deleteFocusClick() {
          dispatch({
            type: 'forms/deleteFocusFrom',
            payload: {
              projectId: record.id,
              type: "form",
              index: index,
            }
          })
        }

        return <div>
          <Tooltip placement="top" title="修改表单">
            <Link onClick={onClick} disabled={!isAuthorityForm} style={{marginRight: "5px"}}>
              <Icon type="toihk-edit" style={{color:!isAuthorityForm?"#E3E3E3":"#337AB7"}}></Icon></Link>
          </Tooltip>
          <Tooltip placement="top" title="删除表单">
            <Popconfirm placement="left" title="确认删除该表单么？" onConfirm={deleteClick} okText="确定"
                        cancelText="取消">
              <Link style={{marginRight: "5px"}} disabled={!isAuthorityForm}>
                <Icon type="toihk-delete" style={{color:!isAuthorityForm?"#E3E3E3":"#337AB7"}}/>
              </Link>
            </Popconfirm>
          </Tooltip>
          <Tooltip placement="top" title="查看数据列表">
            <Link onClick={tabClick.bind(record)}
                  style={{border: 'none', marginRight: "5px"}}>
              <Icon type="bar-chart"/>
            </Link>
          </Tooltip>
          <Tooltip placement="top" title="预览分享">
            <Link onClick={eyeClick}
                  style={{border: 'none', marginRight: "5px"}}>
              <Icon type="eye"/>
            </Link>
          </Tooltip>
          <Tooltip placement="top" title="清空数据">
            <Popconfirm placement="left" title="确认清除该表单的所有数据么?" onConfirm={cleanClick} okText="确定"
                        cancelText="取消">
              <Link style={{border: 'none',marginRight: "5px"}} disabled={!isAuthorityForm}>
                <Icon type="delete" theme="outlined" style={{color:!isAuthorityForm?"#E3E3E3":"#337AB7"}}/>
              </Link>
            </Popconfirm>
          </Tooltip>
          <Tooltip placement="top" title={record.focusId!=null?"取消关注":"关注表单"}>
            <Link onClick={record.focusId!=null?deleteFocusClick:focusClick}
                  style={{border: 'none', marginRight: "5px"}}>
              {record.focusId != null ? <Icon type="heart"/> : <Icon type="heart-o"/>}
            </Link>
          </Tooltip>
        </div>
      }
    }
  ]

  function onRowClick(record, index) {
    changeTableColorByClick("fromLists", index)
  }

  function tabClick() {
    //console.log(this.define);
    let {schema,fieldsets}=JSON.parse(this.define).schema;
    let define = {
      schema:  JSON.parse(this.define).schema,
      formTitle:this.formTitle,
      groupBy: [],
      orderBy: [],
      orderType: "",
      countBy: [],
      tableName: this.tableName,
      define_id: this.id,
      companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
    }
    dispatch({
      type: 'forms/queryAllTempDataByPage',
      payload: {
        define: JSON.stringify(define),
        activateKey: "2",
        listLoadingData: false,
        locationId: this.id,
        tabDisabled: false,
        echartsVisible: false,
        dataLegend: {},
        dataXAxis: [],
        seriesBar: [],
        seriesPie: [],
        shareDataValue:this,
      }
    })
    dispatch({
      type: 'forms/changeHashPath',
    })

  }

  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        pagination={paginations}
        bordered
        columns={columns}
        className="fromLists"
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default List
