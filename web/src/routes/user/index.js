import React from 'react'
import {connect} from 'dva'
import {Tabs,Icon} from 'antd'
import {Link} from 'dva/router'
import List from './List'
import Filter from './Filter'
import DetailModal from './DetailModal'
import {warning} from '../../utils/common'
import TipsModal from './TipsModal'
const User = ({location, dispatch, user, app,loading,userDetail}) => {
  const {list, modalType, isMotion, dateTime, vFiled, detailModalVisible,clickString,cardKey,fileList,tipsModalVisible,current,currentChildSteps} = user
  const {data, roleMenu, treeMenu, defaultMenu, roleName, accountantUnderling, salesUnderling, warehouseUnderling, purchaserUnderling,mockData,targetKeys} = userDetail
  const {companyList}=app
  const TabPane = Tabs.TabPane;
  const userStorage = sessionStorage.getItem('UserStrom');
  const listProps = {
    dispatch,
    clickString,
    dataSource: list,
    loading: loading.effects['user/query'],
    pagination: false,
    location,
    onChange(){
      if (clickString == "数据已加载完毕") {
        return
      }
      dispatch({
        type: "user/query",
        payload: {
          userName: vFiled.userName,
          realName:vFiled.realName,
          staffStatus: cardKey=="1"?"ACTIVE":"INACTIVE",
          currentPage: 2,
          user:userStorage
        }
      })
    },
    onChanges(){
      dispatch({
        type: "user/query",
        payload: {
          userName: vFiled.userName,
          realName:vFiled.realName,
          staffStatus: cardKey=="1"?"ACTIVE":"INACTIVE",
          currentPage: 1,
          user:userStorage
        }
      })
    }
  }
  //筛选条件的事件
  const filterProps = {
    isMotion,
    cardKey,
    onFilterChange (value) {
      dispatch({
        type: 'user/query',
        payload: {
          userName: value.userName,
          staffStatus: cardKey=="1"?"ACTIVE":"INACTIVE",
          currentPage: 1,
          user: userStorage,
          realName:value.realName,
        },
      })
      dispatch({
        type: 'user/querySuccess',
        payload: {
          vFiled: value
        }
      })
    },

    onAdd () {
      dispatch({type: 'app/getCreateMaxNumber'})
    },
  }
  let item=JSON.parse(sessionStorage.getItem("currentUser"))
  const detailModalProps = {
    purchaserUnderling,
    warehouseUnderling,
    accountantUnderling,
    mockData,targetKeys,
    roleMenu,
    salesUnderling,
    treeMenu,
    roleName,
    defaultMenu,
    data,
    companyList,
    dateTime,
    modalType,
    fileList,
    currentItem: modalType === 'update' ? item : {},
    dispatch,
    wrapClassName: 'vertical-center-modal',
    visible: detailModalVisible,
    width: "1150px",
    title: "User Manage",
    footer: false
  }
  function callback(key){
    dispatch({
      type: 'user/query',payload:{
        userName: vFiled.userName,
        staffStatus: key=="1"?"ACTIVE":"INACTIVE",
        currentPage: 1,
        user: userStorage,
        realName:vFiled.realName
      }
    })
    dispatch({
      type:"user/querySuccess",payload:{
        cardKey:key,
        list:[]
      }
    })
  }

  function openTips(){
    dispatch({type: "user/querySuccess",payload:{
      tipsModalVisible:true
    }})
  }
  const tipsBtn=  <Link onClick={openTips}><Icon type="toihk-help" title="用户操作指导" style={{fontSize:'20px',color:"#666",marginRight:"14",marginTop:"5px"}}/></Link>
  const TipsModalProps={
    current,dispatch,currentChildSteps,
  }
  return (
    <Tabs defaultActiveKey="1" className="content-inner" tabBarExtraContent={tipsBtn}>
      <TabPane tab="Employee" key="1">
        <div>
          <Filter {...filterProps} />
          {tipsModalVisible && <TipsModal {...TipsModalProps}  />}
        </div>
        <div style={{marginTop: "10px"}}>
          <Tabs onChange={callback} tabBarExtraContent={<div><div style={{marginRight:"50px",float:"right"}}>Current total:{list.length}</div></div>}>
            <TabPane tab="ACTIVE" key="1">
              <List {...listProps} style={{marginTop:"-10px"}}/>
            </TabPane>
            <TabPane tab="INACTIVE" key="2">
              <List {...listProps} style={{marginTop:"-10px"}}/>
            </TabPane>
          </Tabs>
        </div>
        {detailModalVisible && <DetailModal {...detailModalProps} />}
      </TabPane>
    </Tabs>
  )
}


export default connect(({user, userDetail,loading,app}) => ({app,user,userDetail, loading}))(User)
