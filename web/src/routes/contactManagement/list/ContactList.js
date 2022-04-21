import React from 'react'
import { Table,Tooltip,Icon,Popconfirm} from 'antd';
import styles from './List.less'
import {DropOption} from 'components'
import moment from 'moment';
import {changeTableColorByClick} from '../../../utils/common'
const AccountList = ({
  dispatch,pagination,recordIndex,tableList,provinceData,cityData,countyData, ...tableProps
  }) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '150px'
    }, {
      title: '邮箱 ',
      dataIndex: 'email',
      key: 'email',
      width: '300px',
    }, {
      title: '手机 ',
      dataIndex: 'tel',
      key: 'tel',
      width: '150px',
    },
    {
      title: '身份证 ',
      dataIndex: 'identityCard',
      key: 'identityCard',
      width: '150px',
    }, {
      title: '生日 ',
      dataIndex: 'birthdate',
      key: 'birthdate',
      width: '150px',
    }, {
      title: '性别 ',
      dataIndex: 'sex',
      key: 'sex',
      width: '150px',
    }, {
      title: '备用手机 ',
      dataIndex: 'secondPhone',
      key: 'secondPhone',
      width: '150px',
    }, {
      title: '备用邮箱 ',
      dataIndex: 'secondaryEmail',
      key: 'secondaryEmail',
      width: '150px',
    }, {
      title: 'QQ',
      dataIndex: 'qq',
      key: 'qq',
      width: '150px',
    }, {
      title: '微信',
      dataIndex: 'wechat',
      key: 'wechat',
      width: '150px',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '150px',
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: '150px',
    }, {
      title: '地区',
      dataIndex: 'area',
      key: 'area',
      width: '150px',
      render: (text, record) => {
        var regex = /\{|\}/g;
        if (text == null || text == "") {
          text = "{}";
        } else {
          text = text;
        }
        let textValue = regex.test(text) == true ? JSON.parse(text) : text
        let province = textValue.province != undefined ? textValue.province : "";
        let city = textValue.city != undefined ? textValue.city : "";
        let county = textValue.county != undefined ? textValue.county : "";
        let others = textValue.others != undefined ? textValue.others : "";
        text = province + " " + city + " " + county + " " + others;
        return text
      }
    }, {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      width: '150px',
    }, {
      title: '所在部门',
      dataIndex: 'department',
      key: 'department',
      width: '150px',
    }, {
      title: '传真',
      dataIndex: 'fax',
      key: 'fax',
      width: '150px',
    }, {
      title: '机构名称',
      dataIndex: 'organizationNames',
      key: 'organizationNames',
      width: '150px',
    }, {
      title: '负责人',
      dataIndex: 'principalName',
      key: 'principalName',
      width: '150px',
    }, {
      title: '编号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: '150px',
    }, {
      title: '单位职务',
      dataIndex: 'unitPosition',
      key: 'unitPosition',
      width: '150px',
    }, {
      title: '单位电话',
      dataIndex: 'workTelephone',
      key: 'workTelephone',
      width: '150px',
    }, {
      title: '标签一',
      dataIndex: 'other1',
      key: 'other1',
      width: '150px',
    }, {
      title: '标签二',
      dataIndex: 'other2',
      key: 'other2',
      width: '150px',
    }, {
      title: '标签三',
      dataIndex: 'other3',
      key: 'other3',
      width: '150px',
    }, {
      title: '标签四',
      dataIndex: 'other4',
      key: 'other4',
      width: '150px',
    }, {
      title: '标签五',
      dataIndex: 'other5',
      key: 'other5',
      width: '150px',
    }, {
      title: '加入时间',
      dataIndex: 'addDate',
      key: 'addDate',
      width: '150px',
    }, {
      title: '最新活跃时间',
      dataIndex: 'lastActiveDate',
      key: 'lastActiveDate',
      width: '150px',
    }, {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '150px',
    }, {
      title: '修改时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      width: '150px',
    },
    {
      title: '操作',
      width: '150px',
      fixed: "right",
      render: (text, record, index) => {
        let DropOptionProps = {
          deleteIcon: true,
          onClick() {
            if (record.birthdate != "" && record.birthdate != undefined) {
              if (record.birthdate.length > 19) {
                record.birthdate = record.birthdate.substr(0, 19);
              }
              record.birthdate = moment(record.birthdate)
            }
            if (record.addDate != "" && record.addDate != undefined) {
              if (record.addDate.length > 19) {
                record.addDate = record.addDate.substr(0, 19);
              }
              record.addDate = moment(record.addDate)
            }
            if (record.lastActiveDate != "" && record.lastActiveDate != undefined) {
              if (record.lastActiveDate.length > 19) {
                record.lastActiveDate = record.lastActiveDate.substr(0, 19);
              }
              record.lastActiveDate = moment(record.lastActiveDate)
            }
            record.recordIndex = index
            var regex = /\{|\}/g;
            if (typeof (record.area) == "string") {
              record.area = regex.test(record.area) != true ? {} : JSON.parse(record.area)
            } else {
              record.area = record.area
            }
            record.area = record.area != null && record.area != "" ? record.area : {};
            record.province = record.area.province != undefined ? record.area.province : "";
            record.city = record.area.city != undefined ? record.area.city : "";
            record.county = record.area.county != undefined ? record.area.county : "";
            record.others = record.area.others != undefined ? record.area.others : "";
            let provinceDataIndex;
            for (var i in provinceData) {
              if (record.area.province != undefined) {
                if (record.area.province == provinceData[i]) {
                  provinceDataIndex = i
                }
              }
            }
            dispatch({
              type: 'contactManagement/showCreateModalVisit',
              payload: {
                updateValue: record,
                cities: provinceDataIndex != undefined ? cityData[provinceData[provinceDataIndex]] : [],
                countys: record.area.city != undefined ? countyData[record.area.city] : [],
              }
            })
          },
          deleteClick() {
            dispatch({
              type: 'contactManagement/deleteContactOne',
              payload: {
                //companyCode:JSON.parse(sessionStorage.getItem("UserStrom")).companyCode,
                id: record.id
              }
            })
            dispatch({
              type: 'contactManagement/querySuccess',
              payload: {
                recordIndex: recordIndex,
                tableList: tableList,
              },
            })
          }
        }
        return (<DropOption  {...DropOptionProps} />)
      }
    }
  ]


  function onRowClick(record, index) {
    changeTableColorByClick("AccountList", index);
    dispatch({
      type: 'contactManagement/queryContactDefineDataList',
      payload: {
        id: record.id,
      },
    })
  }

  return (
    <div className={styles.table}>
      <Table
        {...tableProps}
        bordered
        pagination={pagination}
        columns={columns}
        className="AccountList"
        simple
        rowKey={record => record.id}
        onRowClick={onRowClick}
        size="small"
        scroll={{x:4650}}
      />
    </div>
  )
}

export default AccountList
