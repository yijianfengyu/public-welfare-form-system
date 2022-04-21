import React from 'react'
import {connect} from 'dva'
import {Form, Tabs, Spin , message} from 'antd'
import List from './List'
import Filter from './Filter'
import styles from "../../utils/commonStyle.less"
import UpdateModal from './UpdateModal'
const TabPane=Tabs.TabPane;
const ExamQuestion = ({
  location, dispatch, examQuestion,
  }) => {
  const {
    searchLoading,
    updateModalVisit,
  } = examQuestion;
  console.log("----",examQuestion);
  const props={
    dispatch,
    examQuestion
  }
  return (
    <Tabs activeKey={'1'} style={{minWidth: '540px',marginTop:'40px'}}>
     <TabPane tab="题型列表" key="1">
        <div>
          <Filter {...props} name="filter"/>
          <Spin spinning={searchLoading}>
            <List {...props} style={{marginTop: "10px"}}/>
          </Spin>
          {updateModalVisit&&<UpdateModal {...props} />}
        </div>
      </TabPane>
    </Tabs>
  )
}


export default connect(({examQuestion, loading}) => ({examQuestion, loading}))((Form.create())(ExamQuestion))
