import React from 'react'
import {connect} from 'dva'
import  styles from './shareAccount.less'
import {Icon } from 'antd';
const ShareSucceed = ({

  shareSucceed,
  }) => {
  const {}=shareSucceed

  return (
    <div className={styles.divOne}>
      <div className={styles.divDescriptionOne}>
        <Icon type="check-circle" style={{ fontSize: '8vh', color: 'green' }}/>
      </div>
      <div className={styles.divDescription}>
        <span style={{ marginTop:'15px'}}>ζδΊ€ζε</span>
      </div>
    </div>
  )
}


export default connect(({shareSucceed, loading}) => ({shareSucceed, loading}))((ShareSucceed))
