import React from 'react'
import {connect} from 'dva'
import {classnames, config} from 'utils'
import {Helmet} from 'react-helmet'
// import '../themes/index.less'
// import './app.less'
import NProgress from 'nprogress'
import Logo from '../components/Form/Logo'

import Loader from '../components/Loader'

import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Sider from '../components/Layout/Sider'
import styles from '../components/Layout/Layout.less'

const {prefix, openPages} = config
let lastHref

const App = ({children, dispatch, app, loading, location}) => {
  const {
    selectedKeys,imgOne,companyName,userNameOne,user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions, currentRole, roles2, backModalVisible, readBy, backlogName, issueBy, startDate,
    endDate, executeBy, affirmDate, AddBacklogModalVisible, results, vFilter, PurchaserbacklogChildList, addbackString, readId, bid, RemarkList, ReadList, queryBacklogoneList, title,
    BacklogCount, swcheck, BeiZhu, remark, sendMessageModalVisible, chooseStatus, userRecord, staffList, selectedRowKeys, peopleNumber, peopleName,objOne,webSocket,objTwo,objThere,chatModalVisible,anyvapeMessages,
    anyvapeStaffList,salesRecord,chatRechord,chatList,questionModalVisible,queryread,fileList,exchangeModalVisible,companyRate,headerVisible,menuVisible
  } = app
  let {pathname} = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const {iconFontJS, iconFontCSS, logo} = config
  const href = window.location.href
  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }
  const headerProps = {
    imgOne,dispatch,companyName,userNameOne,location,user,chatModalVisible,exchangeModalVisible,companyRate,
    permissions, results, vFilter, roles2, currentRole, menu, swcheck, BeiZhu, isNavbar, readId, bid, BacklogCount, title, menuPopoverVisible, navOpenKeys,
    backModalVisible, endDate, executeBy, affirmDate, RemarkList, remark, queryBacklogoneList, ReadList, AddBacklogModalVisible, readBy, sendMessageModalVisible,
    addbackString: addbackString,anyvapeMessages,anyvapeStaffList,
    PurchaserbacklogChildList, chooseStatus, userRecord, staffList, selectedRowKeys, peopleNumber, peopleName,objOne,webSocket,objTwo,objThere,salesRecord,chatRechord,
    chatList,questionModalVisible,queryread,fileList,headerVisible,
    loading: loading.effects['app/querysBacklog'],
    onChange () {
      dispatch({
        type: 'app/querysBacklog',
        payload: {
          location: vFilter.location,
          backlogName: vFilter.backlogName,
          issueBy: vFilter.issueBy,
          startDate: vFilter.startDate,
          endDate: vFilter.endDate,
          state: vFilter.state,
          executeBy: vFilter.executeBy,
          affirmDate: vFilter.affirmDate,
          readBy:vFilter.readBy,
          user: sessionStorage.getItem("userStorage"),
        }
      })
    },
    switchMenuPopover () {
      dispatch({type: 'app/switchMenuPopver'})
    },
    logout () {
      let u = JSON.parse(sessionStorage.getItem("userStorage"));
      dispatch({
        type: 'app/logout',
        payload: {
          id: u.id,
        }
      })
    },
    changeOpenKeys (openKeys) {
      dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
    },
  }
  const siderProps = {
    dispatch, user, menu, siderFold,menuPopoverVisible,menuVisible,
    navOpenKeys,selectedKeys,
    changeOpenKeys (openKeys) {
      //prefix值玮cigGroup
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
    },
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/querys']}/>
      {children}
    </div>)
  }

  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/querys']}/>
      <Helmet>
        {/*<title>七巧数据</title>*/}
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Expires" content="0" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Cache-control" content="no-cache" />
        <meta http-equiv="Cache" content="no-cache" />
        {/*<meta name="referrer" content="never" />*/}
        <Logo />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS}/>}
      </Helmet>
      <div
        className={classnames(styles.layout, {[styles.fold]: isNavbar ? false : siderFold}, {[styles.withnavbar]: isNavbar})}>
        {<aside style={{top: 47}} className={classnames(styles.sider, {[styles.light]: !darkTheme})}>
          {/*菜单导航*/}
          { menuVisible && <Sider {...siderProps} />}
        </aside> }
        <div className={styles.main}>
          {/*主页顶部*/}
          { headerVisible && <Header {...headerProps} />}
          <div className={styles.container} style={{paddingTop:10}}>
            { children }
          </div>
          {menuVisible && <Footer />}
        </div>
      </div>
    </div>
  )
}


export default connect(({app, loading}) => ({app, loading}))(App)
