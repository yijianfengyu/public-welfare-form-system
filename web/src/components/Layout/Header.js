import React from 'react'
import {Link} from 'dva/router'
import {Menu, Icon, Badge} from 'antd'
import styles from './Header.less'
import {config} from 'utils'
const {api} = config
const {dingding} = api
import {arrayToTree, queryArray} from 'utils'
// import BacklogModal from  '../../routes/backlogtag/modal/BacklogModal'
// import AddBacklogModal from  '../../routes/backlogtag/modal/AddBacklogModal'
// import SendMessageModal from '../../routes/sendMessage/SendMessageModal'
// import ExchangeModal from '../../routes/exchangeRate/ExchangeModal'
// import QuestionModal from '../../routes/chat/QuestionModal'
import Timer from '../Form/Timer'
import Logo from '../Form/Logo'

const SubMenu = Menu.SubMenu
const Header = ({
  dispatch, user, logout, headerVisible,companyName,userNameOne,imgOne
  }) => {
  let handleClickMenu = e => {
   if(e.key==='logout'){
      dispatch({type: 'app/logout',})
    }
  }
  if (sessionStorage.getItem("UserStrom") != null || sessionStorage.getItem("UserStrom") != '') {
    user = JSON.parse(sessionStorage.getItem("UserStrom"));
  }
  return (
    <div className={styles.header} style={{position:headerVisible ? "fixed" :"none"}}>
      <div style={{}}>
        {/*主页logo*/}
        <div style={{float: 'left',width:"120px",}}>
          <Link to="/" title="点击返回至首页" style={{textDecoration:'none'}}>
            <div style={{width:'700px',color:"#394263",lineHeight:"47px"}}>
              <div style={{float:"left",paddingLeft:"2vh",paddingRight:"2vh"}}>
                <span >{imgOne==""?<Logo/>:<img src={dingding+imgOne} width="35px"/>}</span>
              </div>
              <div style={{marginLeft:"10px"}}>
                <span >{companyName}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.rightWarpper}>
        <div className={styles.rightLoginDiv}>
            <Menu mode="horizontal" onClick={handleClickMenu} className={styles.spanColor}>
              <SubMenu title={< span > <Icon type="user"/>
                {userNameOne} </span>}
              >
                <Menu.Item key="personaCenter"  className={styles.menuItem}>
                  <Link to="/visit/personalCenter" style={{textDecoration:"none"}}>个人中心</Link>
                </Menu.Item >
                <Menu.Item key="logout" className={styles.menuItem}>
                  退出
                </Menu.Item >
              </SubMenu>
            </Menu>
        </div>
      </div>
    </div>

  )
}

export default Header
