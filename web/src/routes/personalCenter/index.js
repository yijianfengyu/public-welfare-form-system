import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {config} from 'utils'
import {Form,Tabs} from 'antd'
import Insert from './Insert'
const TabPane = Tabs.TabPane;
const PersonalCenter = ({
  personalCenter,
  dispatch,
  }) => {
  const {tableList,userName,user,nickName} = personalCenter
  const InsertProps = {
    dispatch,
    tableList,
    userName,
    user:JSON.parse(sessionStorage.getItem("UserStrom")),
    nickName
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="个人中心" key="1">
        <div>
          <Insert {...InsertProps}/>
        </div>
      </TabPane>
    </Tabs>
  )
}
export default connect(({personalCenter, loading}) => ({
  personalCenter,
  loading
}))((Form.create())(PersonalCenter))
