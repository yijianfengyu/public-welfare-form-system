import React from 'react'
import {connect} from 'dva'
import {Form, Tabs,Spin,Table,Icon} from 'antd'
import styles from './sharaData.less'
import ShareDataFilter from './ShareDataFilter'
import moment from 'moment';
import TableUtils from "../../utils/TableUtils";

const TabPane = Tabs.TabPane;
const ShareData = ({
                     location, dispatch, shareData,loading, form: {}
                   }) => {
  const {pagination,title,columns,dataSourceList,filterColumns,vFilter,tableDefine} = shareData

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
  const filterProps = {
    dispatch,
    filterColumns,
    tableDefine,
    onFilterChange(value){
      //将界面查询条件的值放入标准格里面进行赋值
      TableUtils.settingTableDefineValues(tableDefine, value);
      dispatch({
        type: 'shareData/queryAllTempDataByPage',
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
    }
  }

  return (
    <div>
      {location.query.isIoseEfficacy === "NO"?<div>
          <div className={styles.title}>{location.query.shareTitle != "null" ? location.query.shareTitle : title}</div>
          <Tabs className={styles.divOne}>
            <TabPane tab="表单数据列表" key="1">
              <div>
                {location.query.checked == "1" ? <ShareDataFilter {...filterProps} name="filter"/> : <div></div>}
                <Table
                  {...tableProps}
                  bordered
                  columns={columns}
                  simple
                  rowKey={record => record.id}
                  size="small"
                  scroll={{x:columns.length*150}}
                />
              </div>
            </TabPane>
          </Tabs>
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
