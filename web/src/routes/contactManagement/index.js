import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {config} from 'utils'
import {Form, Tabs, Spin, Row} from 'antd'
import ContactList from './list/ContactList'
import ContactFormList from './list/ContactFormList'
import CreateModal from './modal/CreateModal'
import ShareModal from './modal/ShareModal'
import ContactExcelModal from './modal/ContactExcelModal'
import Filter from './Filter'
const TabPane = Tabs.TabPane;
const ContactManagement = ({
  contactManagement,
  dispatch,
  loading,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    },
  }) => {
  const {dataPage, recordIndex, shareUrl, userProjExpandedRowKey,shareModalVisit, optionItem, vFilter, pagination, listLoading, CreateModalVisit, tableList, updateValue,
    selectList, fileList, ContactExcelModalVisit, principalName,contactRepeatDataList,provinceData,cityData,countyData,cities,countys,showHeaderVisit} = contactManagement
  const filterProps = {
    dispatch,
    optionItem,
    dataPage,
    downDataOnClick(){

      dispatch({
        type: 'contactManagement/downloadContactData',
        payload: {
          value: vFilter
        }
      })
    },
    onShare(){
      let code = JSON.parse(sessionStorage.getItem("UserStrom")).companyCode;
      let url = window.location.protocol + "//" + window.location.host + "/visit/shareContact?code=" + code;
      dispatch({
        type: 'contactManagement/showShareModalVisit',
        payload: {
          shareUrl: url
        }
      })
    },
    onFile(){
      dispatch({
        type: 'contactManagement/showContactExcelModalVisit',
        payload: {
          fileList: []
        }
      });
    },
    onAdd(){
      dispatch({
        type: 'contactManagement/showCreateModalVisit',
      });
    },
    onFilterChange(value){
      dispatch({
        type: 'contactManagement/SelectAll',
        payload: {
          value
        }
      });
      dispatch({
        type: 'contactManagement/querySuccess',
        payload: {
          vFilter: value,
          listLoading: true,
        },
      })
    }
  };
  const ContactListProps = {
    dispatch,
    dataSource: tableList,
    recordIndex,
    tableList,
    pagination,
    provinceData,
    cityData,
    countyData,
    onChange(page){
      let value = new Object();
      value = vFilter;
      value.pageSize = page.pageSize;
      value.currentPage = page.current;
      dispatch({
        type: 'contactManagement/querySuccess',
        payload: {
          listLoading: true,
        },
      });
      dispatch({
        type: "contactManagement/SelectAll", payload: {
          value
        }
      })
    },


  };
  const ContactFormListProps = {
    dispatch,
    dataSource: contactRepeatDataList,
    pagination: false,
    showHeaderVisit,
    userProjExpandedRowKey,
  };

  const CreateModalProps = {
    dispatch,
    CreateModalVisit,
    updateValue,
    optionItem,
    recordIndex,
    tableList,
    principalName,
    provinceData,
    cityData,
    countyData,
    cities,
    countys,
  };
  const ContactExcelModalProps = {
    dispatch,
    fileList,
    ContactExcelModalVisit,
  };
  const ShareModalProps = {
    dispatch,
    shareModalVisit,
    shareUrl,
  };
console.log("---------concat manager--------");
  return (
    <div style={{minWidth: '540px',marginTop:'40px'}}>
      <Row gutter={24}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="联系人管理" key="1" style={{paddingTop:'10px'}}>
            <div >
              <Filter {...filterProps} name="filter"/>
              <div className={styles.table}>
                <Spin spinning={listLoading}>
                  <ContactList {...ContactListProps} style={{marginTop: "10px"}}/>
                </Spin>
              </div>
              {CreateModalVisit && <CreateModal {...CreateModalProps}/>}
              {shareModalVisit && <ShareModal {...ShareModalProps}/>}
              {ContactExcelModalVisit && <ContactExcelModal {...ContactExcelModalProps}/>}
            </div>
          </TabPane>
        </Tabs>
      </Row>
      <Row gutter={24}>
        {/*<Row gutter={24} style={{clear: "both", width: "100%", height: "300px"}}>*/}
        <Tabs defaultActiveKey="1" className="content-inner">
          <TabPane tab="表单" key="1">
            <div className={styles.table}>
              <ContactFormList {...ContactFormListProps} style={{marginTop: "10px"}}/>
            </div>
          </TabPane>
        </Tabs>
      </Row>
    </div>
  )
}
export default connect(({contactManagement, loading}) => ({
  contactManagement,
  loading,
}))((Form.create())(ContactManagement))
