import React from 'react'
import {connect} from 'dva'
import { Form, Tabs, Spin} from 'antd'
import List from './List'
import Filter from './Filter'

const TabPane=Tabs.TabPane;
const account = ({
  location, dispatch, account,
  }) => {
  const {
    searchLoading,
    updateModalVisible,
  } = account;
  console.log("--index--",account);
  const props={
    dispatch,
    account
  }
  return (
    <Tabs activeKey={'1'} style={{minWidth: '540px',marginTop:'40px'}}>
     <TabPane tab="注册用户列表" key="1">
        <div>
          <Filter {...props} name="filter"/>
          <Spin spinning={searchLoading}>
            <List {...props} style={{marginTop: "10px"}}/>
          </Spin>
        </div>

      </TabPane>
    </Tabs>
  )
}


export default connect(({account, loading}) => ({account, loading}))((Form.create())(account))
