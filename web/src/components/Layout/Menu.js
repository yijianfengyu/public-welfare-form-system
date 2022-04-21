import React from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'dva/router'
import {arrayToTree, queryArray} from 'utils'
import ProjectIcon from '../../components/Form/ProjectIcon'
import FromIcon from '../../components/Form/FromIcon'
const Menus = ({siderFold, darkTheme, navOpenKeys, changeOpenKeys, menu,selectedKeys}) => {
  // 生成树状
  const menuTree = arrayToTree(menu.filter(_ => _.mpid !== '-1'), 'id', 'mpid')
  let levelMap = {}

  // 递归生成菜单
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map(item => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.id] = item.mpid
        }
        return (
          <Menu.SubMenu
            key={item.name}
            title={<span>
              {item.icon && <Icon type={item.icon}/>}
              {(!siderFoldN || !menuTree.includes(item)) && item.name}
            </span>
            }
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.name}>
          <Link to={item.route} style={{fontSize:'14px'}}>
            {<Icon type={item.icon}/>}
            {(!siderFoldN || !menuTree.includes(item)) && item.name}
          </Link>
        </Menu.Item>
      )
    })
  }
  const menuItems = getMenus(menuTree, siderFold)
  // 保持选中
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }
  const onOpenChange = (openKeys) => {

    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }
  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
    selectedKeys:selectedKeys,
  } : {}
  // 寻找选中路由
  let currentMenu
  let defaultSelectedKeys
  function menuClick(item,key){
  }
  return (
    <div>
      <div>
        <Menu
          {...menuProps}
          mode={siderFold ? 'vertical' : 'inline'}
          theme={darkTheme ? 'dark' : 'light'}
          defaultSelectedKeys={defaultSelectedKeys}
          onClick={menuClick}
        >
          {menuItems}
        </Menu>
      </div>
    </div>

  )
}

export default Menus
