import React from 'react'
import { Table, Tooltip, Icon, Popconfirm, Spin, Row, Col, Input, Button, Form } from 'antd'
import styles from "../../utils/commonStyle.less"
import { config} from 'utils'
import Header from '../../components/Form/Header'
import { DropOption } from '../../components'
import { sharedLinks } from '../../utils/config'
import { Link } from 'dva/router'
const {api} = config
const {dingding,urls} = api
const SearchResource = ({
  dispatch,projectManage,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    resetFields,
  },
}) => {
  let shareUrl=urls + "/temp/dataShare?id=";
  let urlAndImg="&url="+encodeURIComponent(sharedLinks)+"&img="+encodeURIComponent(sessionStorage.getItem("imgOne"));
  let widths = {x: 900};
  console.log("--list--");
  const handleSubmit = () => {
    let fields = getFieldsValue();
    projectManage.paginationResource.currentPage=1;
    dispatch({
      type: 'projectManage/searchListResource',
      payload: {
        searchValues:fields,
        ...fields,
        ...projectManage.paginationResource,
      }
    })
  };

  const handleReset = () => {
    resetFields();
    handleSubmit()
  };
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: "100px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: "80px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: <Header width="180" title="资源名称" isDrag="true"/>,
      dataIndex: 'resourcesName',
      key: 'resourcesName',
      width: "150px",
      render: (text, record) => {
        return record.type != "文件" ? <Tooltip placement="top" title={text}>
          <div className={styles.textEllipsis}>{text}</div>
        </Tooltip> : <Tooltip placement="top" title={text}>{text}</Tooltip>
      }
    },
    {
      title: <Header width="180" title="源文件" isDrag="true"/>,
      dataIndex: 'fileName',
      key: 'fileName',
      width: "300px",
      render: (text, record) => {
        if (record.url == null || record.url == "") {
          text
        } else {
          let urlAll = dingding;
          if (record.type === "文件"){
            urlAll = dingding+record.url;
            text = <a className={styles.textEllipsis} target="_blank" href={urlAll}>{text}</a>
          }else if(record.type === "表单"){
            urlAll=shareUrl + encodeURIComponent(record.url)+"&data_uuid=" + record.uuid +"&method=create&companyCode="+code+urlAndImg;
            text = <a className={styles.textEllipsis} target="_blank" href={urlAll}>visit/selectForms?UUID={record.uuid}</a>
          }else{
            urlAll = urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg;
            text = <a className={styles.textEllipsis} target="_blank" href={urlAll}>{urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg}</a>
          }
        }
        return record.type != "文件" ? <Tooltip placement="top" title={text}>
          <div className={styles.textEllipsis}>{text}</div>
        </Tooltip> : <Tooltip placement="top" title={text}>{text}</Tooltip>
      }
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: "80px",
      render: (text, record) => {
        let url
        if (record.templateUrl != null) {
          url = dingding + record.templateUrl
        } else {
          url = ""
        }
        return <Tooltip placement="top" title={text}><a className={styles.textEllipsis} target="_blank"
                                                        href={dingding+text}>{text}</a></Tooltip>
      }
    },
    {
      title: '上传时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: "140px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '上传人',
      dataIndex: 'userName',
      key: 'userName',
      width: "100px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: "450px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '操作',
      key: 'operation',
      width: "40px",
      fixed: "right",
      render: (text, record, index) => {
        function addItemClick() {
          dispatch({
            type: "projectManage/addResource",
            payload: {
              id:record.id,
              projectId:projectManage.projectRecord.id,
            }
          });
        }
        return <div>
          <Tooltip placement="top" title="添加">
            <Popconfirm placement="left" title="确认添加?" onConfirm={addItemClick} okText="确定"
                        cancelText="取消">
              <Link style={{marginRight: "5px"}} >
                <Icon type="toihk-add" />
              </Link>
            </Popconfirm>
          </Tooltip>
        </div>
      },
    },
  ];

  function onChangeResource(page) {
    console.log(page);
    let pagination=projectManage.paginationResource;
    pagination.pageSize = page.pageSize;
    pagination.currentPage = page.current;
    dispatch({
      type: "projectManage/searchListResource", payload: {
        searchValues:projectManage.searchValuesResource,
        ...projectManage.searchValuesResource,
        ...pagination,
      }
    });
  }
  return (
    <div>
    <div className={styles.filterDiv}>
      <Row gutter={24} style={{maxWidth: '1080px'}}>
        <Col span={6}>
          {getFieldDecorator('resourcesName', {
            initialValue: ""
          })(
            <Input placeholder="资源名称" className="margin-right margin-bottom" style={{width: '100%'}} size='default'/>
          )}
        </Col>
        <Col span={12}>
          <Button type="primary" className="margin-right margin-bottom" size="default"
                                         onClick={handleSubmit}>搜索</Button>
          <Button size="default" onClick={handleReset}>重置</Button></Col>
      </Row>
    </div>
    <div className={styles.table}>
      <Table
        onChange={onChangeResource}
        pagination={projectManage.paginationResource}
        bordered
        dataSource={projectManage.searchListResource}
        columns={columns}
        className="resourceList"
        simple
        rowKey={record => record.uuid}
        size="small"
        scroll={widths}
      />
    </div>
    </div>
  )
}

export default  Form.create()(SearchResource);
