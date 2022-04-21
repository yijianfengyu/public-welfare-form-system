import React from 'react'
import {connect} from 'dva'
import { Row,Col,Form,Tabs  } from 'antd';
import WaterDrawMap from './components/WaterDrawMap'


const WaterDraw = ({
  waterDraw,
                     dispatch,
  }) => {

  return (
    <div style={{minHeight:'600px',marginTop:'40px'}}>
      <WaterDrawMap {...waterDraw} dispatch={dispatch} />
    </div>
  )
}
export default connect(({waterDraw, loading}) => ({waterDraw,loading}))((Form.create())(WaterDraw))
