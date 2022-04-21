import React from 'react'
import {connect} from 'dva'
import { Form, Tabs, Spin} from 'antd'
import List from './List'
import Filter from './Filter'
import UpdateModal from './UpdateModal'
const TabPane=Tabs.TabPane;
const region = ({
  location, dispatch, region,
  }) => {
  const {
    searchLoading,
    updateModalVisible,
  } = region;
  console.log("--index--",region);
  const props={
    dispatch,
    region
  }
  return (
    <Tabs activeKey={'1'} style={{minWidth: '540px',marginTop:'40px'}}>
     <TabPane tab="资源列表" key="1">
        <div>
          <Filter {...props} name="filter"/>
          <Spin spinning={searchLoading}>
            <List {...props} style={{marginTop: "10px"}}/>
          </Spin>
        </div>
       {updateModalVisible && <UpdateModal {...props}/>}
      </TabPane>
    </Tabs>
  )
}


export default connect(({region, loading}) => ({region, loading}))((Form.create())(region))
