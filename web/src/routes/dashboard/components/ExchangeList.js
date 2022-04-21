import React from 'react'
import {Table,Icon} from 'antd'
import {config} from 'utils'

const ExchangeList = ({ ...tableProps}) => {
  const columns = [{
    dataIndex: 'iconName',
    key: 'iconName',
    width: "70px",
    render: (text,record) => {
      if(record.country == "CHINA"){
        return   <Icon  type="toihk-rmb" style={{color:"f4ea2a"}}></Icon>
      }else if(record.country == "USA"){
        return   <Icon  type="toihk-dollar" style={{color:"f4ea2a"}}></Icon>
      }else if(record.country == "Europe"){
        return   <Icon  type="toihk-eur" style={{color:"f4ea2a"}}></Icon>
      }else if(record.country == "Hong Kong"){
        return   <Icon  type="toihk-hk" style={{color:"f4ea2a"}}></Icon>
      }else if(record.country == "UK"){
        return   <Icon  type="toihk-gbp" style={{color:"f4ea2a"}}></Icon>
      }

    },
  }, {
    dataIndex: 'country',
    key: 'country',
    width: "210px",
  }, {
    dataIndex: 'rate',
    key: 'rate',
    width: "210px",
  }]

  return (
    <div>
      <Table
        {...tableProps}
        showHeader={false}
        columns={columns}

        simple
        pagination={false}

      />
    </div>
  )
}

export default ExchangeList
