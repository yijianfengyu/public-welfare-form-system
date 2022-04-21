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

const TabPane = Tabs.TabPane;
const ShareData = ({
  location, dispatch, shareData,loading, form: {}
  }) => {

  const {cityList,affirmingVisible,loadingSpinning,formDescription,orderByStatus,pagination,title,columns,dataSourceList,filterColumns,vFilter,tableDefine,hasMoreItems,showConditions} = shareData

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
       if(item.visual == "static" && item.dataIndex != "dateCreated"){
         //系统自动创建的列只显示时间
          continue;
       }
       let title=item.title;
       let value=item.render(dataItem[item.dataIndex],dataItem);//在tableUtils.js的parseTableDefine方法

       let color=k%2==0?k==0?{width:'100%',padding:'5px',backgroundColor:"#ecf6fd",borderLeft:"solid 15px #ff0000"}:
         { width:'100%',padding:'5px',backgroundColor:"#ecf6fd"}
         :{width:'100%',padding:'5px',backgroundColor:"#ffffff"};

        arr.push(<Row key={i+"_k"+k} gutter={24} style={color}>
            <Col  span={12} style={{fontWeight: 700}}>
              {title}</Col>
            <Col  span={12}>{value}</Col>

          </Row>);
     }
      arr.push(<Row key={i+"_d"} gutter={24} style={{width:'100%'}}>
            <Col  span={24}>
              <div style={{marginTop:'15px',marginBottom: '15px',borderBottomColor:'#e5e5e5',borderWidth: '0 0 1px 0',borderStyle: 'dashed'}}></div>
            </Col>
          </Row>);
   }


   return (arr);
  }
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
    dispatch({
      type: 'shareData/querySuccess',
      payload: {
        affirmingVisible:false,
      }
    })
  }

  return (
    <div>
      {location.query.isIoseEfficacy === "NO"?<div>
                <div style={{paddingTop:'0px',height:'700px',overflow:'auto',paddingBottom:'700px'}}>
                  {location.query.checked == "1" ? <ShareDataFilter {...filterProps} name="filter"/> : <div></div>}
                    <Tabs className={styles.divOne}  defaultActiveKey="1">
                    <TabPane tab={<h4>数据列表</h4>} key="1" style={{marginRight:"0px",paddingBottom:'12px'}}>
                      <InfiniteScroll hasMore={true} initialLoad={false} useCapture={true}
                                      loadMore={loadItems.loadMore}
                                      useWindow={false}  pageStart={1}
                                      threshold={900}
                      >

                      <div style={{marginTop:'12px'}}>

                            <div dangerouslySetInnerHTML={{__html:formDescription }} />
                          {loadItems.view()}

                      </div>
                      </InfiniteScroll>
                    </TabPane>
                      <TabPane tab={<h4>免责声明</h4>} key="2" style={{marginRight:"0px",paddingBottom:'12px'}}>
                        <div style={{marginTop:'12px',height:'1600px'}}>
                        <Affirming />
                        </div>
                        <Modal style={{margin:"0px 15px",height:"400px",overflow: "scroll"}}
                               title="免责声明"
                               visible={affirmingVisible}
                               onOk={handleCancel}
                               onCancel={handleCancel}
                        ><Affirming /></Modal>
                      </TabPane>
                      <TabPane tab="关于我们" key="3" style={{marginRight:"0px",paddingBottom:'12px'}}>
                        <div style={{marginTop:'12px'}}>
                        <AboutUs />
                        </div>
                      </TabPane>
                    </Tabs>

                </div>
              <div style={{height:'200px',overflow:'auto',paddingBottom:'50px'}}>&nbsp;</div>


      </div>:
        <div className="content-inner">
          <div className={styles.error}>
            <Icon type="frown-o"/>
            <h3>此链接已失效</h3>
          </div>
        </div>
      }
    </div>
  )
}


export default connect(({shareData, loading}) => ({shareData, loading}))((Form.create())(ShareData))
