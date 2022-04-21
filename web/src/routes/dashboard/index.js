import React from 'react'
import {connect} from 'dva'
import {Row,Col,Card} from 'antd'
import AddLog from './components/AddLog'
import AddSubprojectModal from './components/AddSubprojectModal'
//import BaiduMap from './components/BaiduMap'
//import PeopleHotMap from './components/PeopleHotMap'
//import MyProjectCard from './MyProjectCard'
import MyFocusProject from './MyFocusProject'
import MyFocusFrom from './MyFocusFrom'
import LatestDocumentCard from './LatestDocumentCard'
import QuickEntry from './QuickEntry'
import styles from './index.less'

function Dashboard({dashboard,app}) {
  //添加日志
  const addLogModalProps = {
    ...dashboard,
    maskClosable: false,
    visible: dashboard.addLogModalVisit,
  }

  //热图
  const peopleHotSettingProps = {
    echartsPeopleHotSetting: dashboard.echartsPeopleHotSetting,
  }

  //添加子项目
  const addSubprojectModalProps = {
    ...dashboard,
    maskClosable: false,
    visible: dashboard.addSubprojectModalVisible,
  }
  return (
    <div style={{minHeight:'1200px',marginTop:'62px'}}>
      <Row gutter={24}>
        <Col lg={12} md={12}>
          <QuickEntry {...dashboard} />

        </Col>
        <Col lg={12} md={12}>


          <MyFocusProject {...dashboard} />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={12} md={12}>
          <MyFocusFrom {...dashboard} />
        </Col>
        <Col lg={12} md={12}>
          <LatestDocumentCard {...dashboard} />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col lg={12} md={12}>
          <Card title="分布趋势" style={{ overflowY: 'hidden',overflowX: 'hidden'}}>

          </Card>
        </Col>
      </Row>
      <div>
        {dashboard.addLogModalVisit && <AddLog {...addLogModalProps}  />}
        {dashboard.addSubprojectModalVisible && <AddSubprojectModal {...addSubprojectModalProps}/>}
      </div>
    </div>
  )
}

export default connect(({dashboard,app}) => ({dashboard, app}))(Dashboard)
