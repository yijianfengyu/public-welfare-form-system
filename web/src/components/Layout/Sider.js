import React from 'react'
import {Icon} from 'antd'
import styles from './Layout.less'
import {config} from 'utils'
import Menus from './Menu'

const Sider = ({siderFold, darkTheme, location, menuPopoverVisible, navOpenKeys, changeOpenKeys, menu, handleClickNavMenu, user, switchSider,dispatch,selectedKeys}) => {
  const menusProps = {
    dispatch,   user,location,
    menu,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeOpenKeys,
    handleClickNavMenu,menuPopoverVisible,selectedKeys
  }
function divClick() {
  dispatch({type: 'app/switchSider'})
}
  return (
    <div>
      <div onClick={divClick} className={styles.menuFlod}>  <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} style={{color:"#F2F4F6"}}/></div>
      <Menus {...menusProps} />
    </div>
  )
}



export default Sider
