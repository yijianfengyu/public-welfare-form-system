import React from 'react'
import {connect} from 'dva'
import  styles from './formStyle.less'
import {Icon,Button } from 'antd';
import wx from 'weixin-js-sdk';
const Success = ({

  selectForm,
  }) => {
  const {tempTableListId}=selectForm
  function handleSubmit(){
    window.parent.postMessage({type:'type02'},'*');
    if (window.__wxjs_environment === 'miniprogram'){
    wx.miniProgram.navigateBack({
      delta: 1
    })
    }else{
      window.history.back();
    }
  }
  function  aa(){
    let su
    if(JSON.stringify(tempTableListId) != '{}'){
      su= <div id='sucess_box' className={styles.divOne}>
        <div className={styles.divTitle}>
          <span>{tempTableListId.formTitle}</span>
        </div>
        <div className={styles.divDongHua}></div>
        <div className={styles.divDescriptionOne}>
          <Icon type="check-circle" style={{ fontSize: '4vh', color: 'green' }}/>
        </div>
        <div className={styles.divDescription}>
          <span style={{ marginTop:'15px'}}>提交成功</span>
        </div>
        <div className={styles.divFoot}>
          <p>该表单通过公益数据生成</p>
          <Button type="primary" size="default" onClick={handleSubmit}>返回</Button>
        </div>
      </div>
    }
    window.parent.postMessage({type:'type01'},'*');
    return su
  }
  return (
   <div>
     {aa()}
   </div>
  )
}


export default connect(({selectForm, loading}) => ({selectForm, loading}))((Success))
