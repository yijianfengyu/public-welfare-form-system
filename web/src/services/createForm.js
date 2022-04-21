import {request, config} from 'utils';
const {api} = config;
const {form,shareUrl,pm,region} = api;


export async function insertForm(params) {
  return request({
    url: form + "/createTempTable",
    method: 'post',
    data:params,
  })
}
export async function onTempTableExcelModel(params) {
  return request({
    url: form + "/onTempTableExcelModel",
    method: 'post',
    data:params,
  })
}
export async function deleteTempTable(params) {
  return request({
    url: form + "/deleteTempTable",
    method: 'post',
    data:params,
  })
}
export async function queryTempTables(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url: form + "/queryTempTable",
    method: 'post',
    data:param,
  })
}
export async function queryTempDataFrom(params) {
  return request({
    url: form + "/queryTempDataFrom",
    method: 'post',
    data:params,
  })
}
export async function queryTempTableByIds(params) {
  return request({
    url: form + "/queryTempTableById",
    method: 'post',
    data:params,
  })
}
export async function updateTempTables(params) {
  return request({
    url: form + "/updateTempTable",
    method: 'post',
    data:params,
  })
}
export async function updateTempDataRemark(params) {
  return request({
    url: form + "/updateTempDataRemark",
    method: 'post',
    data:params,
  })
}


// 添加模板表数据
export async function createTempData(params) {
  return request({
    url: form + "/createTempData",
    method: 'post',
    data:params,
  })
}


// 删除模板表数据
export async function deleteTempData(params) {
  return request({
    url: form + "/deleteTempData",
    method: 'post',
    data:params,
  })
}
// 删除模板表数据
export async function queryTempDataById(params) {
  return request({
    url: form + "/queryTempDataById",
    method: 'post',
    data:params,
  })
}
// 分页查询模板表所有数据
export async function queryAllTempDataByPage(params) {
  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url: form + "/queryAllTempDataByPage",
    method: 'post',
    data:param,
  })
}

// 查询模板表所有数据
export async function queryAllTempData(params) {

  let param = params;
  if (typeof (params.value) != "undefined") {
    param = param.value
  }
  return request({
    url: form + "/queryAllTempData",
    method: 'post',
    data:param,
  })
}

//
export async function queryAllTempDataByDefineId(params) {
  return request({
    url: form + "/queryAllTempDataByDefineId",
    method: 'post',
    data:params,
  })
}

//查询模板表分组统计
export async function queryTempDataGroupCount(params) {
  return request({
    url: form + "/queryTempDataGroupCount",
    method: 'post',
    data:params,
  })
}


//清空所有数据
export async function clearAllData(params) {
  return request({
    url: form + "/clearAllData",
    method: 'post',
    data:params,
  })
}export async function querySubTables() {
  return request({
    url: form + "/querySubTables",
    method: 'post'
  })
}

export async function createShareUrl(params) {
  return request({
    url: shareUrl + "/createShareUrl",
    method: 'post',
    data:params,
  })
}

export async function updateIsConditions(params) {
  return request({
    url: shareUrl + "/updateIsConditions",
    method: 'post',
    data:params,
  })
}


export async function queryFocusFrom(params) {
  return request({
    url: form + "/queryFocusFrom",
    method: 'post',
    data: params,
  })
}
export async function downFromDataExcel(params) {
  return request({
    url: form + "/downFromDataExcel",
    method: 'post',
    data:params,
  })
}
export async function queryAllActiveStaff(params) {
  return request({
    url: pm + "/queryAllActiveUser",
    method: 'post',
    data: params,
  })
}
export async function modifyPw(params) {
  return request({
    url: form + "/modifyPw",
    method: 'post',
    data: params,
  })
}
export async function modifyFormDataByPw(params) {
  return request({
    url: form + "/modifyFormDataByPw",
    method: 'post',
    data: params,
  })
}

export async function openEditDataModal(params) {
  return request({
    url: form + "/openEditDataModal",
    method: 'post',
    data: params,
  })
}
export async function vertifyPw(params) {
  return request({
    url: form + "/vertifyPw",
    method: 'post',
    data: params,
  })
}
export async function querySubData(params) {
  return request({
    url: form + "/querySubData",
    method: 'post',
    data: params,
  })
}
export async function getTableColumns(params) {
  return request({
    url: form + "/getTableColumns",
    method: 'post',
    data: params,
  })
}
export async function getLabelForSelect(params) {
  return request({
    url: form + "/getLabelForSelect",
    method: 'post',
    data: params,
  })
}

export async function queryExamQuestion(params) {
  return request({
    url: form + "/queryExamQuestion",
    method: 'post',
    data: params,
  })
}
export async function insertExamQuestion(params) {
  return request({
    url: form + "/insertExamQuestion",
    method: 'post',
    data: params,
  })
}
export async function updateExamQuestion(params) {
  return request({
    url: form + "/updateExamQuestion",
    method: 'post',
    data: params,
  })
}

export async function queryRegion(params) {
  return request({
    url: region + "/queryRegion",
    method: 'post',
    data: params,
  })
}
export async function deleteRegion(params) {
  return request({
    url: region + "/deleteRegion",
    method: 'post',
    data: params,
  })
}
export async function updateRegion(params) {
  return request({
    url: region + "/updateRegion",
    method: 'post',
    data: params,
  })
}
