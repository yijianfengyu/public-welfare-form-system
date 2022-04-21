import React from 'react'
import { Table,Tooltip,Icon,Popconfirm,Spin} from 'antd';
import styles from './List.less'
import {Link} from 'dva/router'
import { config} from 'utils'
import styles2 from '../../utils/commonStyle.less'
import Header from '../../components/Form/Header'
import { DropOption } from '../../components'
import { sharedLinks } from '../../utils/config'
const {api} = config
const {dingding,urls} = api
const List = ({
   dispatch,resource
  }) => {
  let shareUrl=urls + "/temp/dataShare?id=";
  let urlAndImg="&url="+encodeURIComponent(sharedLinks)+"&img="+encodeURIComponent(sessionStorage.getItem("imgOne"));
  let widths = {x: 900};
  console.log("--list--");
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: "100px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: "80px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: <Header width="180" title="资源名称" isDrag="true"/>,
      dataIndex: 'resourcesName',
      key: 'resourcesName',
      width: "150px",
      render: (text, record) => {
        return record.type != "文件" ? <Tooltip placement="top" title={text}>
          <div className={styles2.textEllipsis}>{text}</div>
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
            text = <a className={styles2.textEllipsis} target="_blank" href={urlAll}>{text}</a>
          }else if(record.type === "表单"){
            urlAll=shareUrl + encodeURIComponent(record.url)+"&data_uuid=" + record.uuid +"&method=create&companyCode="+code+urlAndImg;
            text = <a className={styles2.textEllipsis} target="_blank" href={urlAll}>visit/selectForms?UUID={record.uuid}</a>
          }else{
            urlAll = urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg;
            text = <a className={styles2.textEllipsis} target="_blank" href={urlAll}>{urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg}</a>
          }
        }
        return record.type != "文件" ? <Tooltip placement="top" title={text}>
          <div className={styles2.textEllipsis}>{text}</div>
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
        return <Tooltip placement="top" title={text}><a className={styles2.textEllipsis} target="_blank"
                                                        href={dingding+text}>{text}</a></Tooltip>
      }
    },
    {
      title: '上传时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: "140px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '上传人',
      dataIndex: 'userName',
      key: 'userName',
      width: "100px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: "450px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '操作',
      key: 'operation',
      width: "150px",
      fixed: "right",
      render: (text, record, index) => {
        let DropOptionProps = {
          editIcon: true,
          uploadIcon: true,
          uploadDisabled: record.status == "已审核",
          importIcon: true,
          importDisabled: null == record.url || record.url == "",
          deleteIcon: true,
          uploadClick(){
            dispatch({
              type: "resource/querySuccess",
              payload: {
                uploadModalVisible: true,
                resourcesRecord: record
              }
            })
          },
          deleteClick:()=>(deleteResource(index,record)),
          importClick(){
            if (record.url.toString().indexOf("http") >= 0) {
              window.open(record.url);
            } else {
              window.open(dingding + record.url);
            }
          }
        }

        let DropOptionProps1 = {
          editIcon: true,
          editDisabledOne: record.status == "已审核",
          auditIcon: true,
          queryIcon: true,
          deleteIcon: true,
          onClickOne(){
            window.open(shareUrl + encodeURIComponent(record.url)+"&data_uuid=" + record.uuid +"&method=create&companyCode="+code+urlAndImg);
          },
          queryClick(){
            window.open(shareUrl + encodeURIComponent(record.url)+"&data_uuid=" + record.uuid +"&method=select&companyCode="+code+urlAndImg);
          },
          deleteClick:()=>(deleteResource(index,record)),
        }

        //图文
        let wordHandleIconProps = {
          editIcon: true,
          editIconOne: true,
          deleteIcon: true,
          copyIcon: true,
          viewTaget: "_blank",
          copyContent: urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg,
          viewIcon: true,
          viewLink: window.location.protocol + "//" + window.location.host + "/visit/teletext?UUID=" + record.uuid + "&projectId=" + record.projectId + "&method=select",
          deleteClick:()=>(deleteResource(index,record)),
          onClickOne(){
            window.open(urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg);
          }
        }

        return <div className={styles2.textEllipsis}>
          {record.type == "文件" ? <DropOption {...DropOptionProps}  /> :
            ( (record.type == "图文" ?
              <DropOption {...wordHandleIconProps}  /> : <DropOption {...DropOptionProps1}  />))}
        </div>
      },
    },
  ];
  function deleteResource(index,item){
    dispatch({
      type: "resource/deleteResource",
      payload: {
        index: index,
        id: item.id,
      }
    })
  }

  function onChange(page) {
    console.log(page);
    let pagination=resource.pagination;
    pagination.pageSize = page.pageSize;
    pagination.currentPage = page.current;
    dispatch({
      type: "resource/searchList", payload: {
        searchValues:resource.searchValues,
        ...resource.searchValues,
        ...pagination,
      }
    });
    dispatch({
      type: "resource/querySuccess", payload: {
        searchLoading: true,
      }
    })
  }
  return (
    <div className={styles.table}>
      <Table
        onChange={onChange}
        pagination={resource.pagination}
        bordered
        dataSource={resource.searchList}
        columns={columns}
        className="resourceList"
        simple
        rowKey={record => record.uuid}
        size="small"
        scroll={widths}
      />
    </div>
  )
}

export default List
