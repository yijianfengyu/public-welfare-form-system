import React from 'react'
import {changeTableColorByClick} from '../../utils/common'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Table,message,Icon,Tooltip} from 'antd';
import styles2 from '../../utils/commonStyle.less'
import {DropOption} from 'components'
import {request, config} from 'utils'
import {Link} from 'dva/router'
import Header from '../../components/Form/Header'
const {api} = config
const {dingding,urls} = api
import {sharedLinks} from '../../utils/config'
const ResourcesList = ({location, ...tableProps,dispatch,userName,code,id,resourceListIndex,isAuthority}) => {
  let shareUrl=urls + "/temp/dataShare?id=";
  let urlAndImg="&url="+encodeURIComponent(sharedLinks)+"&img="+encodeURIComponent(sessionStorage.getItem("imgOne"));
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
      title: '必填',
      dataIndex: 'isEssential',
      key: 'isEssential',
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
        //text="<a target='_blank' href='"+dingding+text+"'>"+text+"</a>";
        //return (<div dangerouslySetInnerHTML={{__html: text}}/>);
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
        //text="<a target='_blank' href='"+dingding+text+"'>"+text+"</a>";
        //return (<div dangerouslySetInnerHTML={{__html: text}}/>);
        if (record.url == null || record.url == "") {
          text
        } else {
          let urlAll = dingding;
          if (record.type === "文件"){
            urlAll = dingding+record.url;
            text = <a className={styles2.textEllipsis} target="_blank" href={urlAll}>{text}</a>
          }else if (record.type === "附加表单" ){
            urlAll =shareUrl + encodeURIComponent(record.url)+"&projectId="+record.projectId+"&data_uuid=" + record.uuid +"&companyCode="+code+urlAndImg;
            text = <a className={styles2.textEllipsis} target="_blank" href={urlAll}>visit/selectForms?UUID={record.uuid}</a>
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
      title: '审核时间',
      dataIndex: 'auditDate',
      key: 'auditDate',
      width: "100px",
      render: (text, record) => {
        return <Tooltip placement="top" title={text}><span className={styles2.textEllipsis}>{text}</span></Tooltip>
      }
    },
    {
      title: '审核人',
      dataIndex: 'auditorName',
      key: 'auditorName',
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
          auditIcon: true,
          auditDisabled: !isAuthority || record.status == "已审核" || record.status == "未上传",
          importIcon: true,
          importDisabled: null == record.url || record.url == "",
          deleteIcon: true,
          deleteDisabled: !isAuthority,
          uploadClick(){
            dispatch({
              type: "projectManage/querySuccess",
              payload: {
                uploadModalVisible: true,
                resourcesRecord: record
              }
            })
          },
          deleteClick(){
            dispatch({
              type: "projectManage/deleteResource",
              payload: {
                index: index,
                id: record.id,
                projectId: record.projectId,
              }
            })
          },
          auditClick(){
            dispatch({
              type: "projectManage/auditProjectResource", payload: {
                id: record.id,
                auditor: JSON.parse(sessionStorage.getItem("UserStrom")).id
              }
            })
          },
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
          editIconOne: true,
          editDisabledOne: record.status == "已审核",
          auditIcon: true,
          auditDisabled: !isAuthority || record.status == "已审核",
          queryIcon: true,
          deleteIcon: true,
          deleteDisabled: !isAuthority,
          onClickOne(){
            window.open(shareUrl + encodeURIComponent(record.url)+"&data_uuid=" + record.uuid +"&method=create&companyCode="+code+urlAndImg);
          },
          auditClick(){
            dispatch({
              type: "projectManage/auditProjectResource", payload: {
                id: record.id,
                auditor: userName
              }
            })
          },
          queryClick(){
            window.open(shareUrl + encodeURIComponent(record.url)+"&data_uuid=" + record.uuid +"&method=select&companyCode="+code+urlAndImg);
          },
          deleteClick(){
            dispatch({
              type: "projectManage/deleteResource",
              payload: {
                index: index,
                id: record.id,
                projectId: record.projectId,
              }
            })
          },
        }


        //附加表单
        let attachFormHandleIconProps = {
          editIcon: true,
          editIconOne: true,
          deleteIcon: true,
          deleteDisabled: !isAuthority,
          copyIcon: true,
          copyContent:shareUrl + encodeURIComponent(record.url)+"&projectId="+record.projectId+"&data_uuid=" + record.uuid +"&companyCode="+code+urlAndImg,
          viewIcon: true,
          viewLink: {
            pathname: "/visit/forms",
            state: {
              id: record.url,
              projectId: record.projectId,
            }
          },
          deleteClick(){
            dispatch({
              type: "projectManage/deleteResource",
              payload: {
                index: index,
                id: record.id,
                projectId: record.projectId,
              }
            })

          },
          onClickOne(){
            window.open(shareUrl + encodeURIComponent(record.url)+"&projectId="+record.projectId+"&data_uuid=" + record.uuid +"&companyCode="+code+urlAndImg);
          }
        }
        //图文
        let wordHandleIconProps = {
          editIcon: true,
          editIconOne: true,
          deleteIcon: true,
          deleteDisabled: !isAuthority,
          copyIcon: true,
          viewTaget: "_blank",
          copyContent: urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg,
          viewIcon: true,
          viewLink: window.location.protocol + "//" + window.location.host + "/visit/teletext?UUID=" + record.uuid + "&projectId=" + record.projectId + "&method=select",
          deleteClick(){
            dispatch({
              type: "projectManage/deleteResource",
              payload: {
                index: index,
                id: record.id,
                projectId: record.projectId,
              }
            })
          },
          onClickOne(){
            window.open(urls + "/pm/teletextShare?resourcesUuid=" + record.uuid + "&projectId=" + record.projectId+urlAndImg);
          }
        }


        return <div className={styles2.textEllipsis}>
          {record.type == "文件" ? <DropOption {...DropOptionProps}  /> :
            (record.type == "附加表单" ? <DropOption {...attachFormHandleIconProps}  /> : (record.type == "图文" ?
              <DropOption {...wordHandleIconProps}  /> : <DropOption {...DropOptionProps1}  />))}
        </div>
      },
    },
  ]

  function listRowClick(record, index) {
    changeTableColorByClick("resourcesList", index);
  }

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        scroll={{x:1350}}
        size="small"
        onRowClick={listRowClick}
        className="resourcesList"
      />
    </div>
  )
}

export default ResourcesList
