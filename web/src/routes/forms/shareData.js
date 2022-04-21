import React from 'react'
import {connect} from 'dva'
import {Form, Tabs, Spin, Modal, Icon, Row, Col} from 'antd'
import styles from './sharaData.less'
import ShareDataFilter from './ShareDataFilter'
import moment from 'moment';
import InfiniteScroll from '../../utils/InfiniteScroll';
import TableUtils from "../../utils/TableUtils";
import Affirming from "../../components/Form/Affirming";
import AboutUs from "../../components/Form/AboutUs";
import PwEditFormData from "./formData/PwEditFormData";

const TabPane = Tabs.TabPane;
const ShareData = ({
  location, dispatch, shareData,loading, form: {}
  }) => {
  const {isVertifyPwVisible,tempTableListId,columnsValue,isPwEditFormDataVisiable,cityList,affirmingVisible,loadingSpinning,formDescription,orderByStatus,pagination,title,columns,dataSourceList,filterColumns,vFilter,tableDefine,hasMoreItems,showConditions} = shareData

  const tableProps = {
    dataSource: dataSourceList,
    pagination: pagination,
    onChange(page){
      dispatch({
        type: 'shareData/queryAllTempDataByPage',
        payload: {
          define: JSON.stringify(tableDefine),
          pageSize: page.pageSize,
          currentPage: page.current,
        }
      })
    }
  }
function phoneModifyData(itemData){
  dispatch({
    type: 'shareData/openEditDataModal',
    payload: {
      isPwEditFormDataVisiable: true,
      define: JSON.stringify(tableDefine),
      id: itemData.id,
      define_id: itemData.define_id,
      rowData:itemData,
      //columns:columns,
    }
  })

}
const loadItems ={
    loader :(<div className="loader">加载中 ...</div>),
    dataSource: dataSourceList,
    pagination: pagination,
    loadMore(pageLoaded){

   if(pagination.totalPages>=pageLoaded){
     dispatch({
       type: 'shareData/queryAllTempDataByPage',
       payload: {
         define: JSON.stringify(tableDefine),
         pageSize: pagination.pageSize,
         currentPage: pageLoaded,
         dataSource: dataSourceList,
       }
     })
   }

    },
  view(){
   let arr=[];

   for(let i=0;i<this.dataSource.length;i++){
     let dataItem=this.dataSource[i];
     for(let k=0;k<columns.length;k++){

       let item=columns[k];

       if((item.visual == "static" && item.dataIndex != "dateCreated")||item.columnHiden || item.columnScore ){
         //系统自动创建的列只显示时间
          continue;
       }
       let title=item.title;
       let value=item.render(dataItem[item.dataIndex],dataItem);//在tableUtils.js的parseTableDefine方法

       let color=k%2==0?k==0?{width:'100%',padding:'5px',backgroundColor:"#ecf6fd",borderLeft:"solid 3px #ff0000"}:
         { width:'100%',padding:'5px',backgroundColor:"#ecf6fd"}
         :{width:'100%',padding:'5px',backgroundColor:"#ffffff"};

        arr.push(<div key={i+"_k"+k} style={color}>
            <Col  span={12} style={{fontWeight: 700}}>
              {title}</Col>
            <Col  span={12} style={{overflow: 'hidden'}}>{value}</Col>
            <div style={{clear:'both'}}></div>
          </div>);
     }
     arr.push(
       <Row key={i+"_m"} gutter={24} style={{width:'100%'}}>
         <Col span={12}>
         </Col>
         <Col span={12}>
           <div onClick={phoneModifyData.bind(this,dataItem)}>编辑</div>
         </Col>
       </Row>
     );
      arr.push(<Row key={i+"_d"} gutter={24} style={{width:'100%'}}>
            <Col  span={24}>
              <div style={{marginTop:'15px',marginBottom: '15px',borderBottomColor:'#e5e5e5',borderWidth: '0 0 1px 0',borderStyle: 'dashed'}}></div>
            </Col>
          </Row>);
   }


   return (arr);
  }
}
  const editFormProps = {
    dispatch,
    tempTableListId,
    columnsValue,
    isVertifyPwVisible,
  }
  const filterProps = {
    cityList,
    dispatch,
    filterColumns,
    tableDefine,
    showConditions,
    orderByStatus,
    onFilterChange(value){
      //将界面查询条件的值放入标准格里面进行赋值
      TableUtils.settingTableDefineValues(tableDefine, value);

      dispatch({
        type: 'shareData/querySuccess',
        payload: {
          loadingSpinning: true,
        }
      })
      dispatch({
        type: 'shareData/queryAllTempDataByPage',
        payload: {
          define: JSON.stringify(tableDefine),
          dataSource:[],
          listLoadingData: false,
          pageSize: "10",
          currentPage: "1",
          echartsVisible: false,
          orderByStatus:orderByStatus,
          dataLegend: {},
          dataXAxis: [],
          seriesBar: [],
          seriesPie: [],
        }
      })
    }
  }
  function handleCancel(e) {
    sessionStorage.setItem("affirming_Visible_modal","1");//看过了
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        affirmingVisible:false,
      }
    })
  }
  let affirming_Visible=true;
  if( sessionStorage.getItem("affirming_Visible_modal")!=null){
    affirming_Visible=false;
  }
  let lang=navigator.language?navigator.language.toLocaleLowerCase():'zh';
  console.log("------------lang------");
  console.log(lang);
  let tabTitle01=""
  let tabTitle02=""
  let tabTitle03=""
  let tabTitle04=""
  if(lang.indexOf("zh")!=-1){
    tabTitle01="数据列表"
    tabTitle02="免责声明"
    tabTitle03="关于我们"
    tabTitle04="此链接已经失效"
  }else{
    tabTitle01="Datasheets"
    tabTitle02="Disclaimer"
    tabTitle03="About us"
    tabTitle04="This link has expired"
  }
  return (
    <div>
      {location.query.isIoseEfficacy === "NO"?<div>

                    <Tabs className={styles.divOne}  defaultActiveKey="1">
                    <TabPane tab={<h4>{tabTitle01}</h4>} key="1" style={{marginRight:"0px",paddingBottom:'7px'}}>
                      <Spin spinning={loadingSpinning}>
                      <div style={{marginTop: '7px', height: '700px', overflow: 'auto', paddingBottom: '700px'}}>

                        <InfiniteScroll hasMore={true} initialLoad={false} useCapture={true}
                                        loadMore={loadItems.loadMore}
                                        useWindow={false} pageStart={1}
                                        threshold={1200}
                        >
                          {isPwEditFormDataVisiable?<PwEditFormData {...editFormProps} />:null}
                          {location.query.checked == "1" ? <ShareDataFilter {...filterProps} name="filter"/> :
                            <div></div>}
                          <div style={{overflow:"hidden",textOverflow: "ellipsis"}}>
                          <div dangerouslySetInnerHTML={{__html: formDescription}}/>
                          </div>
                          {loadItems.view()}

                        </InfiniteScroll>
                      </div>
                      </Spin>
                    </TabPane>

                    </Tabs>


      </div>:
        <div className="content-inner">
          <div className={styles.error}>
            <Icon type="frown-o"/>
            <h3>{tabTitle04}</h3>
          </div>
        </div>
      }
    </div>
  )
}


export default connect(({shareData, loading}) => ({shareData, loading}))((Form.create())(ShareData))
