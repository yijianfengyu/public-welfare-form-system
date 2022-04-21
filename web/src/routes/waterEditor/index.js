import React from 'react'
import {connect} from 'dva'
import {Form} from 'antd';


const WaterEditor = ({
  waterEditor,
  dispatch,
  location,
  }) => {
  console.log("--------wateredit------");
  console.log(location);
  return (
    <div>
    </div>
  )
}
export default connect(({waterEditor, loading}) => ({waterEditor, loading}))((Form.create())(WaterEditor))
