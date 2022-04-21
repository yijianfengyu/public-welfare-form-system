import React from 'react'
import {Icon} from 'antd'
import styles from './index.less'

const LinkError = () => <div className="content-inner">
  <div className={styles.error}>
    <Icon type="frown-o"/>
    <h1>此链接已失效</h1>
  </div>
</div>

export default LinkError
