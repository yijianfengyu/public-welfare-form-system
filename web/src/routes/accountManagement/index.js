import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {config} from 'utils'
import {Form,Tabs,Spin} from 'antd'
import AccountList from './list/AccountList'
import CreateModal from './modal/CreateModal'
import ShareModal  from './modal/ShareModal'
import Filter from './Filter'
const TabPane = Tabs.TabPane;
const AccountManagement = ({
  accountManagement,
  dispatch,
  }) => {
  const {recordIndex,isPassword,isDisable,shareModalVisit,shareUrl,pagination,vFilter,listLoading,CreateModalVisit,tableList,updateValue,isCreate,isDiv,selectList} = accountManagement
  const filterProps = {
    dispatch,
    isCreate,
    onShare(){
      let code=JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      var num="";
      for(var i=0;i<4;i++) {
        num += Math.floor(Math.random() * 10)
      }
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var aa=num+""+year+""+month+""+day+""+hour+""+minute+""+second
      let url=window.location.protocol + "//" + window.location.host + "/visit/shareAccount?code="+code+"&failureCode="+aa
      dispatch({
        type: 'accountManagement/showShareModalVisit',
        payload:{
          shareUrl:url
        }
      })
    },
    onAdd(){
      dispatch({
        type: 'accountManagement/showCreateModalVisit',
      })
    },
    onFilterChange(value){
      //value.id = JSON.parse(sessionStorage.getItem("UserStrom")).id,
      //value.companyCode = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
      //value.roleType = JSON.parse(sessionStorage.getItem("UserStrom")).roleType,
      dispatch({
        type: 'accountManagement/SelectAll',
        payload: {
          value
        }
      })
      dispatch({
        type: 'accountManagement/querySuccess',
        payload: {
          listLoading: true,
          vFilter: value,
        },
      })
    }
  }
  const AccountListProps = {
    dispatch,
    pagination,
    dataSource: tableList,
    isCreate,
    recordIndex,
    tableList,
    onChange(page){
      let value=new Object()
      value=vFilter
      value.pageSize=page.pageSize
      value.currentPage=page.current
      //value.companyCode=JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      dispatch({
        type: 'accountManagement/querySuccess',
        payload: {
          listLoading: true,
        },
      })
      dispatch({
        type: "accountManagement/SelectAll", payload: {
          value
        }
      })
    }
  }
  const CreateModalProps = {
    dispatch,
    CreateModalVisit,
    updateValue,
    isPassword,
    isDisable,
    recordIndex,
    tableList,
  }
  const ShareModalProps = {
    dispatch,
    shareModalVisit,
    shareUrl,
  }
  return (
    <Tabs defaultActiveKey="1" style={{minWidth:'540px',marginTop:'40px'}}>
      <TabPane tab="账户管理" key="1">
        <div>
          <Filter {...filterProps} name="filter"/>
          <div className={styles.table}>
            <Spin spinning={listLoading}>
              <AccountList {...AccountListProps} style={{marginTop:"10px"}}/>
            </Spin>
          </div>
          {CreateModalVisit && <CreateModal {...CreateModalProps}/>}
          {shareModalVisit && <ShareModal {...ShareModalProps}/>}
        </div>
      </TabPane>
    </Tabs>
  )
}
export default connect(({accountManagement, loading}) => ({
  accountManagement,
  loading
}))((Form.create())(AccountManagement))
