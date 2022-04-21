/**
 * Created by hms on 2017/9/7.
 */
import {request, config} from 'utils'
const {api} = config
const {pm,form,sys,resource} = api

export async function queryProject(params) {
  return request({
    url: pm + "/queryProject",
    method: 'post',
    data: params,
  })
}
export async function queryOptions(params) {
  return request({
    url: sys + "/getSelectOptions",
    method: 'post',
    data: params,
  })
}

export async function queryAddress(params) {
  return request({
    url: sys + "/getRegionList",
    method: 'post',
    data: params,
  })
}

export async function getTeamList(params) {
  return request({
    url: pm + "/getTeamList",
    method: 'post',
    data: params,
  })
}
export async function updateTeamList(params) {
  return request({
    url: pm + "/updateTeamList",
    method: 'post',
    data: params,
  })
}
export async function addProjectTeamPartner(params) {
  return request({
    url: pm + "/addProjectTeamPartner",
    method: 'post',
    data: params,
  })
}
export async function deleteProjectTeam(params) {
  return request({
    url: pm + "/deleteProjectTeam",
    method: 'post',
    data: params,
  })
}
export async function deleteProjectPartner(params) {
  return request({
    url: pm + "/deleteProjectPartner",
    method: 'post',
    data: params,
  })
}

export async function getPartnerList(params) {
  return request({
    url: pm + "/getPartnerList",
    method: 'post',
    data: params,
  })
}
export async function updatePartnerList(params) {
  return request({
    url: pm + "/updatePartnerList",
    method: 'post',
    data: params,
  })
}
export async function addProjectPartnerCost(params) {
  return request({
    url: pm + "/addProjectPartnerCost",
    method: 'post',
    data: params,
  })
}

export async function getLocalOrganizationList(params) {
  return request({
    url: pm + "/getLocalOrganizationList",
    method: 'post',
    data: params,
  })
}
export async function updateLocalOrganizationList(params) {
  return request({
    url: pm + "/updateLocalOrganizationList",
    method: 'post',
    data: params,
  })
}
export async function getConnectList(params) {
  return request({
    url: pm + "/getConnectList",
    method: 'post',
    data: params,
  })
}
export async function updateConnectList(params) {
  return request({
    url: pm + "/updateConnectList",
    method: 'post',
    data: params,
  })
}


export async function getProjectTeamList(params) {
  return request({
    url: pm + "/getProjectTeamList",
    method: 'post',
    data: params,
  })
}

export async function getTeamPartnerList(params) {
  return request({
    url: pm + "/getTeamPartnerList",
    method: 'post',
    data: params,
  })
}

export async function getProjectLocalOrganizationList(params) {
  return request({
    url: pm + "/getProjectLocalOrganizationList",
    method: 'post',
    data: params,
  })
}



export async function deleteProjectDaily(params) {
  return request({
    url: pm + "/deleteProjectDaily",
    method: 'post',
    data: params,
  })
}
export async function updateProjectDaily(params) {
  return request({
    url: pm + "/updateProjectDaily",
    method: 'post',
    data: params,
  })
}
export async function updateProject(params) {
  return request({
    url: pm + "/updateProject",
    method: 'post',
    data: params.value,
  })
}
export async function createProjectReport(params) {
  return request({
    url: pm + "/updateProjectReport",
    method: 'post',
    data: params,
  })
}

export async function queryProjectReport(params) {
  return request({
    url: pm + "/queryProjectReport",
    method: 'post',
    data: params,
  })
}

export async function createProject(params) {
  return request({
    url: pm + "/createProject",
    method: 'post',
    data: params.value,
  })
}

export async function queryAllActiveStaff(params) {
  return request({
    url: pm + "/queryAllActiveUser",
    method: 'post',
    data: params,
  })
}
/**查询项目日志**/
export async function queryProjectDaily(params) {
  return request({
    url: pm + "/queryProjectDaily",
    method: 'post',
    data: params,
  })
}
export async function updateDaily(params) {
  return request({
    url: pm + "/updateDaily",
    method: 'post',
    data: params,
  })
}
export async function createProjectDaily(params) {

  return request({
    url: pm + "/createProjectDaily",
    method: 'post',
    data: params,
  })
}
export async function addProjectResource(params) {
  return request({
    url: pm + "/addProjectResource",
    method: 'post',
    data: params,
  })
}
export async function queryProjectResources(params) {
  return request({
    url: pm + "/queryProjectResources",
    method: 'post',
    data: params,
  })
}
export async function addProjectResourceModel(params) {
  return request({
    url: pm + "/addProjectResourceModel",
    method: 'post',
    data: params,
  })
}
export async function addProjectResourceFromStore(params) {
  return request({
    url: pm + "/addProjectResourceFromStore",
    method: 'post',
    data: params,
  })
}
export async function auditProjectResource(params) {
  return request({
    url: pm + "/auditProjectResource",
    method: 'post',
    data: params,
  })
}
export async function copyProject(params) {
  return request({
    url: pm + "/copyProject",
    method: 'post',
    data: params,
  })
}
export async function deleteProject(params) {
  return request({
    url: pm + "/deleteProject",
    method: 'post',
    data: params,
  })
}

export async function queryProjectName(params) {
  return request({
    url: pm + "/queryProjectName",
    method: 'post',
    data: params,
  })
}

export async function queryProjectDailyByPage(params) {
  return request({
    url: pm + "/queryProjectDailyByPage",
    method: 'post',
    data: params,
  })
}

export async function queryForms(params) {
  return request({
    url: form + "/queryTempTable",
    method: 'post',
    data: params,
  })
}

export async function deleteResource(params) {
  return request({
    url: pm + "/deleteResource",
    method: 'post',
    data: params,
  })
}

export async function queryUserProject(params) {
  return request({
    url: pm + "/queryUserProject",
    method: 'post',
    data: params,
  })
}

export async function queryFocusProject(params) {
  return request({
    url: pm + "/queryFocusProject",
    method: 'post',
    data: params,
  })
}
export async function deleteFocusProject(params) {
  return request({
    url: pm + "/deleteFocusProject",
    method: 'post',
    data: params,
  })
}
export async function insertFocusProject(params) {
  return request({
    url: pm + "/insertFocusProject",
    method: 'post',
    data: params,
  })
}
export async function queryHomeProjectResources(params) {
  return request({
    url: pm + "/queryHomeProjectResources",
    method: 'post',
    data: params,
  })
}
export async function queryFocusProjectId(params) {
  return request({
    url: pm + "/queryFocusProjectId",
    method: 'post',
    data: params,
  })
}
export async function dashboardQueryProjectResources(params) {
  return request({
    url: pm + "/dashboardQueryProjectResources",
    method: 'post',
    data: params,
  })
}


export async function updateNewDaily(params) {
  return request({
    url: pm + "/updateNewDaily",
    method: 'post',
    data: params,
  })
}

export async function queryHistoryResources(params) {
  return request({
    url: resource + "/queryHistoryResources",
    method: 'post',
    data: params,
  })
}

export async function updateResource(params) {
  return request({
    url: resource + "/updateResource",
    method: 'post',
    data: params,
  })
}



