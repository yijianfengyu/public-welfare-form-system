import React from 'react'
import {connect} from 'dva'
import {Form,Tabs} from 'antd'
import DailyList from './DailyList'
import DailyModal from './DailyModal'
import Filter from './Filter'

const TabPane = Tabs.TabPane;

const dailyReport = ({location, dispatch,app, dailyReport, loading}) => {
  const {  modalType,modalVisible,expand ,projectName1,projectName2,projectName3,createTime,pagination,dailyReportList,startTime,endTime,filter,}=dailyReport


  const filterProps={
    dispatch,expand,startTime,endTime
  }

  const listProps={
    dispatch,location,
    dataSource: dailyReportList,
    loading: loading.effects['dailyReport/querys'],
    pagination,
    onChange (page) {
      dispatch({
        type: "dailyReport/querys", payload: {
          createName:filter.userName,
          projectName:filter.projectName,
          groupId:filter.groupId,
          startTime:startTime,
          endTime:endTime,
          currentPage: page.current,
          pageSize: page.pageSize,
        }
      })
    }
  }

  const modalProps = {
    dispatch,modalType,projectName1,projectName2,projectName3,createTime,
    maskClosable: false,
    visible:modalVisible,
    width:"1000px"
  }

return(
  <div>
    <Tabs defaultActiveKey="1" className="content-inner" >
      <TabPane tab="日报" key="1">
        <Filter {...filterProps}/>
        <DailyList {...listProps} style={{marginTop: "10px"}}/>
        {modalVisible && <DailyModal {...modalProps}/>}
      </TabPane>
    </Tabs>

  </div>
)
}


export default connect(({dailyReport, app,loading}) => ({dailyReport,app, loading}))((Form.create())(dailyReport))
