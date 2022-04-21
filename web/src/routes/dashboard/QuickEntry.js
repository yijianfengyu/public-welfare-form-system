import React from 'react'
import {Row,Col} from 'antd';
import {Link} from 'dva/router'
import styles from './index.less'

const QuickEntry = ({
  contactCount,
  projectCount,
  userCount,
  formCount,
  })=> {
  let user = JSON.parse(sessionStorage.getItem("UserStrom"));
  let link = user.roleType == "admin"?"/visit/accountManagement":"/visit/personalCenter";

  return (
    <Row gutter={24}>
      <Col lg={6} md={12}>
        <Link to="/visit/contactManagement">
          <div className="margin-bottom">
            <img className={styles.cardIcon} src={"/homePageIcon/Customer.png"}/>
            <div className={styles.cardText}>
              <strong className={styles.cardSpan}>{contactCount == '' ? 0 : contactCount}</strong>
              <span style={{fontSize:'14px'}}>名联系人</span>
            </div>
          </div>
        </Link>
      </Col>
      <Col lg={6} md={12}>
        <Link to="/visit/projectManage">
          <div className="margin-bottom">
            <img className={styles.cardIcon} src={"/homePageIcon/Catalogue.png"}/>
            <div className={styles.cardText}>
              <strong className={styles.cardSpan}>{projectCount == '' ? 0 : projectCount}</strong>
              <span style={{fontSize:'14px'}}>个项目</span>
            </div>
          </div>
        </Link>
      </Col>
      <Col lg={6} md={12}>
        <Link to={link}>
          <div className="margin-bottom">
            <img className={styles.cardIcon} src={"/homePageIcon/WarehouseList.png"}/>
            <div className={styles.cardText}>
              <strong className={styles.cardSpan}>{userCount == '' ? 0 : userCount}</strong>
              <span style={{fontSize:'14px'}}>个员工</span>
            </div>
          </div>
        </Link>
      </Col>
      <Col lg={6} md={12}>
        <Link to="/visit/forms">
          <div className="margin-bottom">
            <img className={styles.cardIcon} src={"/homePageIcon/W.UManagement.png"}/>
            <div className={styles.cardText}>
              <strong className={styles.cardSpan}>{formCount == '' ? 0 : formCount}</strong>
              <span style={{fontSize:'14px'}}>个表单</span>
            </div>
          </div>
        </Link>
      </Col>
    </Row>
  )
}

export default QuickEntry
