import React from 'react'
import PropTypes from 'prop-types'
import {Breadcrumb, Icon} from 'antd'
import {Link} from 'dva/router'
import styles from './Bread.less'
import pathToRegexp from 'path-to-regexp'
import {queryArray} from 'utils'

const Bread = ({menu, pathname, user, data}) => {
  // 匹配当前路由
  let pathArray = []
  let current
  let thisPathname
  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index]
      break
    }
  }
  if (pathname.indexOf('visit') > 0) {
    thisPathname = pathname.substring(pathname.lastIndexOf('/') + 1);
  } else if ((pathname.indexOf('user')) > 0) {
    thisPathname = 'Employee' + pathname;
  }


  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'id'))
    }
  }

  if (!current) {
    pathArray.push(menu[1]
      || {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
      }
    )
  } else {
    getPathArray(current)
  }


  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (

      <Link >
        {thisPathname}
      </Link>
    )
    //导航条
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
          {content}
        </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
}

export default Bread
