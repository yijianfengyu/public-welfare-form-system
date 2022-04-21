import React from 'react'
import {Card,Table,Icon,Button,Popconfirm,Row,Col} from 'antd';
import {Link} from 'dva/router'
import {download,sharedLinks} from '../../utils/config';
import { config} from 'utils'
const {api} = config
const {urls} = api
const ButtonGroup = Button.Group;

const MyFocusProject = ({
  dispatch,
  userFocusProjRowKey,
  userFocusProjectList,
  userFocusDailyList,
  resourcesFocusList,
  isShowFocusDocumentation,
  })=> {
  let linkUrl = window.location.protocol + "//" + window.location.host
  let shareUrl = urls + "/temp/dataShare?id=";
  let urlAndImg = "&url=" + encodeURIComponent(sharedLinks) + "&img=" + encodeURIComponent(sessionStorage.getItem("imgOne"));
  //查看更多日志
  function queryMoreDaily(project) {
    dispatch({
      type: "dashboard/queryFocusDailyMore",
      payload: {
        project: project,
      }
    })
  }

  function documentation(record) {
    dispatch({
      type: 'dashboard/queryFocusProjectResources',
      payload: {
        groupId: record.groupId,
        projectId: record.id,
        updateDate: record.updateDate,
      }
    })
  }

  function dailyRecord() {
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        isShowFocusDocumentation: false
      }
    })
  }

  //查看更多资源
  function queryMoreresources(project) {
    dispatch({
      type: 'dashboard/queryFocusProjectResourceseMore',
      payload: {
        groupId: project.groupId,
        projectId: project.id,
        updateDate: project.updateDate,
      }
    })
  }

  function onExpandedRowsChange(expanded, record) {
    let index;
    for(var i in userFocusProjectList){
      if(record.id==userFocusProjectList[i].id){
        index=i
      }
    }
    if (expanded) {
      //展开
      dispatch({
        type: 'dashboard/queryFocusDaily',
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
          userFocusProjRowKey: 0,
          isShowFocusDocumentation: false,
        }
      })
    }
  }

  let focusProjectColumns = [
    {title: '项目名称', dataIndex: 'projectName', key: 'projectName'},
    {
      title: '操作', dataIndex: 'Action', key: 'x',
      render: (text, record,index) => {
        if(record.renewal==true){
          text=<span style={{color:'red',marginLeft: '10px'}}>New</span>
        }else{
          text=<span></span>
        }
        return text;
      }
    },
  ];

  function onProjRowClick(record, index, event) {
    if (userFocusProjRowKey == 0 || userFocusProjRowKey != record.id) {
      //展开
      dispatch({
        type: 'dashboard/queryFocusDaily',
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
          userFocusProjRowKey: 0,
          isShowFocusDocumentation: false,
        }
      })
    }
  }

  function handleClickWriteDaily(record) {
    dispatch({
      type: 'dashboard/querySuccess',
      payload: {
        addLogModalVisit: true,
        addLogProjectRecord: record,
        saveDailyMethod: "dashboard/createFocusProjectDaily",
      }
    })
  }

  function handleClickUnfollow(record, index) {
    dispatch({
      type: 'dashboard/deleteFocusProject',
      payload: {
        id: record.focusId,
        projectId: record.id,
        deleteFocusIndex: index,
        type: "project",
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
        updateDailyMethod: "dashboard/updateFocusProjectDaily",
      }
    })
  }

  function focusProjDaily(project, index) {
    return (<div>
        <Row gutter={24}>
          <Col lg={12} md={24}>
            <Button.Group>
              <Button size={'small'} type="dashed" onClick={handleClickWriteDaily.bind(this,project)}>写日志</Button>
              <Button size={'small'} type="dashed" onClick={handleClickUnfollow.bind(this,project,index)}>取消关注</Button>
            </Button.Group>
          </Col>
          <Col lg={8} md={24}>
            <ButtonGroup  >
              <Button type="dashed" size="small" onClick={documentation.bind(this,project)} value="相关文档">相关文档</Button>
              <Button type="dashed" size="small" onClick={dailyRecord} value="日志" autoFocus="autofocus">日志</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <br />
        {isShowFocusDocumentation === true ? resourcesFocusList.map(function (resources, index) {
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
        }) : userFocusDailyList.map(function (daily, index) {
          function deleteDialy(index, daily) {
            dispatch({
              type: 'dashboard/deleteFocusDaily',
              payload: {
                index: index,
                id: daily.id,
                userId: JSON.parse(sessionStorage.getItem("UserStrom")).id,
              }
            })
          }

          return <div key={index}>
            <p style={{marginBottom:'5px'}}><span>{daily.dailyType === "work" ?
              <Icon style={{ fontSize: '1.2em', color: '#337ab7',cursor: 'pointer' }}
                    onClick={updateDialy.bind(this,index,daily)} type="edit"/> : ""}&nbsp;
              <div dangerouslySetInnerHTML={{__html:daily.content}}/></span></p>
            <p
              style={{textAlign:'right',fontColor:'#dfdfdf',paddingRight:'1em'}}><span>--{daily.createName}.{daily.createDate}&nbsp;
              <Popconfirm placement="left" title="你确定删除这条日志?" onConfirm={deleteDialy.bind(this,index,daily)} okText="确定"
                          cancelText="取消">
                {daily.dailyType === "work" ?
                  <Icon style={{ fontSize: '1.2em', color: '#337ab7',cursor: 'pointer' }} type="close"/> : ""}
              </Popconfirm>
        </span></p></div>;
        })}
        <div style={{textAlign:'center'}}>{isShowFocusDocumentation === true ?
          <Link onClick={queryMoreresources.bind(this,project)}>查看更多资源...</Link> :
          <Link onClick={queryMoreDaily.bind(this,project)}>查看更多日志...</Link>}
        </div>
      </div>
    );

  }

  function moreFocusProject() {
    dispatch({
      type: 'dashboard/queryFocusProjectMore',
      payload: {}
    });
  }

  return (
    <Card
      title={<div style={{paddingLeft:'2px'}}><h3 style={{fontSize:'1.6em'}}>我关注的项目</h3><span>&nbsp;|&nbsp;进行中项目(12)</span></div>}
      style={{ overflowY: 'hidden',overflowX: 'hidden',borderRadius: '3px'}}>
      <Table pagination={false} showHeader={false}
             rowKey={record => record.id}
             onExpand={onExpandedRowsChange}
             expandedRowKeys={[userFocusProjRowKey]}
             columns={focusProjectColumns}
             onRowClick={onProjRowClick}
             expandedRowRender={focusProjDaily}
             dataSource={userFocusProjectList}
      />
      <br/>
      <div style={{textAlign:'center'}}><Link onClick={moreFocusProject}>加载更多项目...</Link></div>

    </Card>
  )
}

export default MyFocusProject
