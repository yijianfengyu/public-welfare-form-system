import React from 'react'
import {Card,Table,Icon,Popconfirm} from 'antd';
import {Link} from 'dva/router'
import UserProjectListMenu from './components/UserProjectListMenu'
import { Editor } from 'react-draft-wysiwyg';
import {download,sharedLinks} from '../../utils/config';
import { config} from 'utils'
const {api} = config
const {urls} = api
const MyProjectCard = ({
  dispatch,
  userProjectList,
  onDailyExpandedRowsChange,
  userProjExpandedRowKey,
  userProjectColumns,
  userProjDaily,
  moreUserProject,
  userProjDailyList,
  saveDailyMethod,
  isShowDocumentation,
  resourcesList,
  })=> {
  let linkUrl = window.location.protocol + "//" + window.location.host
  let shareUrl = urls + "/temp/dataShare?id=";
  let urlAndImg = "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
  //查看更多日志
  function queryMoreDaily(project) {
    dispatch({
      type: "dashboard/queryProjectDailyMore",
      payload: {
        project: project,
      }
    })
  }

  //查看更多资源
  function queryMoreresources(project) {
    dispatch({
      type: 'dashboard/queryProjectResourceseMore',
      payload: {
        groupId: project.groupId,
        projectId: project.id,
        updateDate: project.updateDate,
      }
    })
  }

  //我的项目
  const props = {
    dispatch,
    userProjectList,
    userProjExpandedRowKey,
    onDailyExpandedRowsChange(expanded, record) {
      let index;
      for(var i in userProjectList){
        if(record.id==userProjectList[i].id){
          index=i
        }
      }
      if (expanded) {
        //展开
        dispatch({
          type: 'dashboard/queryProjectDaily',
          payload: {
            index: index,
            project: record,
          }
        });
      } else {
        //收起
        dispatch({
          type: 'dashboard/querySuccess',
          payload: {
            userProjExpandedRowKey: 0,
            isShowDocumentation: false,
          }
        })
      }
    },
    onProjRowClick(record, index, event) {

      if (userProjExpandedRowKey == 0 || userProjExpandedRowKey != record.id) {
        //展开
        dispatch({
          type: 'dashboard/queryProjectDaily',
          payload: {
            index: index,
            project: record,
          }
        });
      } else {
        //收起
        dispatch({
          type: 'dashboard/querySuccess',
          payload: {
            userProjExpandedRowKey: 0,
            isShowDocumentation: false,
          }
        })
      }
    },
    userProjectColumns: [
      {title: '项目名称', dataIndex: 'projectName', key: 'projectName'},
      {
        title: '操作', dataIndex: 'Action', key: 'x',
        render: (text, record, index) => {
          let valueText;
          if(record.renewal==true){
            valueText=<span style={{color:'red',marginLeft: '10px'}}>New</span>
          }else{
            valueText=<span></span>
          }
          return record.parentId == 0 ? <div><Icon type="shop"/>{valueText}</div> : {valueText};
        }
      },
    ],
    userProjDaily(project) {
      return (<div>
          <div style={{textAlign:'left'}}><UserProjectListMenu dispatch={dispatch} record={project}/></div>
          <br />
          {isShowDocumentation === true ? resourcesList.map(function (resources, index) {
            return (
              <div>
                <p style={{marginBottom:'5px'}}>
                  {resources.type === "文件" ?
                    <Link to={resources.url!=null?download+"/"+resources.url:download+"/"+resources.templateUrl}
                          target="_blank">
                      {resources.resourcesName}
                    </Link> :
                    (resources.type === "图文" ?
                        <Link
                          to={resources.url!=null?linkUrl+"/"+resources.url:linkUrl + "/visit/teletext?UUID=" + resources.uuid + "&projectId=" + resources.projectId+"&method=select"}
                          target="_blank">
                          {resources.resourcesName}
                        </Link> :
                        (resources.type === "附加表单" ?
                            <Link
                              to={resources.url!=null?shareUrl + encodeURIComponent(resources.url)+"&projectId="+resources.projectId+"&data_uuid=" + resources.uuid +"&companyCode="+JSON.parse(sessionStorage.getItem("UserStrom")).companyCode+urlAndImg:linkUrl}
                              target="_blank">
                              {resources.resourcesName}
                            </Link> :
                            (resources.type === "表单" ?
                                <Link
                                  to={resources.url!=null?shareUrl + encodeURIComponent(resources.url)+"&data_uuid=" + resources.uuid +"&method=create&companyCode="+JSON.parse(sessionStorage.getItem("UserStrom")).companyCode+urlAndImg:linkUrl }
                                  target="_blank">
                                  {resources.resourcesName}
                                </Link> :
                                <Link to={linkUrl+"/"+resources.url} target="_blank">
                                  {resources.resourcesName}
                                </Link>
                            )
                        )
                    )
                  }
                  &nbsp;
                  (类型：{resources.type})<span></span></p>
                <p style={{textAlign:'right',fontColor:'#dfdfdf',paddingRight:'1em'}}>
                  <span>--{resources.createName}.{resources.createDate}</span></p>
              </div>
            )
          }) : userProjDailyList.map(function (daily, index) {
            function deleteDialy(index, daily) {
              dispatch({
                type: 'dashboard/deleteMyDaily',
                payload: {
                  index: index,
                  id: daily.id,
                }
              })
            }

            function updateDialy(index, daily) {
              daily.dialyiIndex = index
              dispatch({
                type: 'dashboard/querySuccess',
                payload: {
                  addLogModalVisit: true,
                  dailyValue: daily,
                  updateDailyMethod: "dashboard/updateProjectDaily",
                }
              })
            }

            return <div key={index}>
              <p style={{marginBottom:'5px'}}><span> {daily.dailyType === "work" ?
                <Icon style={{ fontSize: '1.2em', color: '#337ab7',cursor: 'pointer' }}
                      onClick={updateDialy.bind(this,index,daily)} type="edit"/> : ""}  &nbsp;
                <div dangerouslySetInnerHTML={{__html:daily.content}}/></span></p>
              <p style={{textAlign:'right',fontColor:'#dfdfdf',paddingRight:'1em'}}>
              <span>--{daily.createName}.{daily.createDate}&nbsp;
                <Popconfirm placement="left" title="你确定删除这条日志?" onConfirm={deleteDialy.bind(this,index,daily)}
                            okText="确定"
                            cancelText="取消">
                  {daily.dailyType === "work" ?
                    <Icon style={{ fontSize: '1.2em', color: '#337ab7',cursor: 'pointer' }} type="close"/> : ""}
                </Popconfirm>
              </span></p>
            </div>;
          })}
          <div style={{textAlign:'center'}}>{isShowDocumentation === true ?
            <Link onClick={queryMoreresources.bind(this,project)}>查看更多资源...</Link> :
            <Link onClick={queryMoreDaily.bind(this,project)}>查看更多日志...</Link>}</div>
        </div>

      );

    },
    moreUserProject() {
      dispatch({
        type: 'dashboard/queryUserProjectMore',
        payload: {}
      });
    },
  }

  function onInsertProject() {
    dispatch({
      type: "dashboard/queryAllActiveStaff",
      payload: {
        //companyCode: JSON.parse(sessionStorage.getItem("UserStrom")).companyCode
      }
    })
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        addSubprojectModalVisible: true,
      }
    })
  }

  return (
    <Card
      title={<div style={{paddingLeft:'2px'}}><h3 style={{fontSize:'1.6em'}}>我的项目</h3><span>完成项目(12)</span><span>&nbsp;|&nbsp;进行中项目(12)</span><Link onClick={onInsertProject} style={{marginLeft:'5px'}}><Icon type="plus" /></Link></div>}
      style={{ overflowY: 'hidden',overflowX: 'hidden',borderRadius: '3px'}}>
      <Table pagination={false} showHeader={false}
             rowKey={record => record.id}
             onExpand={props.onDailyExpandedRowsChange}
             expandedRowKeys={[userProjExpandedRowKey]}
             columns={props.userProjectColumns}
             onRowClick={props.onProjRowClick}
             expandedRowRender={record => props.userProjDaily(record)}
             dataSource={props.userProjectList}
      />
      <br/>
      <div style={{textAlign:'center'}}><Link onClick={props.moreUserProject}>加载更多项目...</Link></div>

    </Card>
  )
}
export default MyProjectCard
