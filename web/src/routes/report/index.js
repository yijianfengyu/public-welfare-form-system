import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {Form, Tabs, Row, Col, Spin, message} from 'antd'
import {request, config} from 'utils'
import Filter from './Filter'
import FromLists from "./FromLists";
import IntroInfo from "./IntroInfo"
import ProportionLists from "./proportion/ProportionLists";
import ProportionFilter from "./proportion/ProportionFilter";
import CreateModal from "./CreateModal";

const {api} = config
const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

const Report = ({
                  report,
                  dispatch,
                  form: {
                    getFieldDecorator,
                    validateFields,
                  },
                }) => {


  const FromListsProps = {//分页
    dispatch,
    report,
    location,
    dataSource: report.tempTableList,
    paginations: report.paginations,
    onChange(page) {
      let value = new Object()
      value = report.vFilter;
      value.pageSize = page.pageSize;
      value.currentPage = page.current;
      dispatch({
        type: "report/getReportInfoList",
        payload: {
          value,
        }
      });
      dispatch({
        type: "report/querySuccess",
        payload: {
          listLoading: true,
        }
      })
    }
  };
  const infoProps = {
    dispatch,
    report,
  };

  const createModalProps = {
    dispatch,
    report,
  };

  const filterProps = {
    dispatch,
    report,
  };


  const ProportionProps = {
    dispatch,
    report,
    location,
    dataSource: report.proportionList,
  };

  return (
    <div>
    <Tabs defaultActiveKey="1" style={{minWidth: '540px', marginTop: '40px'}}>
      <Tabs.TabPane tab="调研报告" key="1">
        <Filter {...filterProps} name="filter"/>
        <div className={styles.table}>
          <Spin spinning={report.listLoading}>
            <FromLists {...FromListsProps} style={{marginTop: "10px"}}/>
          </Spin>
        </div>
      </Tabs.TabPane>
      {report.IntroInfoVisible && <IntroInfo {...infoProps}/>}
      {report.createModalVisible&&<CreateModal {...createModalProps}/>}
    </Tabs>
      {/*==============占比列表==============*/}
      <Tabs defaultActiveKey="1" style={{minWidth: '540px', marginTop: '40px'}}>
        <Tabs.TabPane tab="答题占比列表" key="1">
          <div className={styles.table}>
            <Spin spinning={report.proportionLoading}>
              <ProportionLists {...ProportionProps} style={{marginTop: "10px"}}/>
            </Spin>
          </div>
        </Tabs.TabPane>
        {report.IntroInfoVisible && <IntroInfo {...infoProps}/>}
      </Tabs>
    </div>
  )
}
export default connect(({report, loading}) => ({
  report, loading
}))((Form.create())(Report))
