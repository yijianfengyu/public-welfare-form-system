import React from 'react'
import {connect} from 'dva'
import { Form, Tabs, Spin, message, Row } from 'antd'
import List from './List'
import Filter from './Filter'
import UpdateModal from './UpdateModal'
import UploadModal from './UploadModal'
const TabPane=Tabs.TabPane;
const resource = ({
  location, dispatch, resource,
  }) => {
  const {
    searchLoading,
    updateModalVisible,
    uploadModalVisible,
  } = resource;
  console.log("----",resource);
  const props={
    dispatch,
    resource
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
       {updateModalVisible&&<UpdateModal {...props} />}
       {uploadModalVisible && <UploadModal {...props}/>}
      </TabPane>
    </Tabs>
  )
}


export default connect(({resource, loading}) => ({resource, loading}))((Form.create())(resource))
