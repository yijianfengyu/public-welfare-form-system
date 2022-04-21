import React from 'react'
import {Icon} from 'antd'
import styles from './index.less'

const shareError = () => <div className="content-inner">
  <div className={styles.error}>
    <Icon type="frown-o"/>
    <h3>此链接已失效</h3>
  </div>
</div>

export default shareError
