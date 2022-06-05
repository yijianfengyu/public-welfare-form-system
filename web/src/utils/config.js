const APIV1 = '/api/v1';
const APIV2 = '/api/v2';


//按需加载开发和正式部署环境配置参数
let env = (process && process.env && process.env.NODE_ENV) || 'production'
  // 如果本地环境设置了 NODE_ENV , 则会使用本地环境中的 NODE_ENV , 如果没有则使用 production
console.log("------config---");
console.log(env);
let APIV3 = 'https://pro.admin.myh2o.org.cn/pmapi';
let SharedLinks='https://pro.admin.myh2o.org.cn';
if(env==="development"){
  APIV3 = 'http://localhost:8084/pmapi';
  SharedLinks=window.location.protocol + "//" + window.location.host;
  //最新版的spring boot 2.5以上要求必须用https域名
   //APIV3 = 'https://pro.admin.myh2o.org.cn/pmapi';
   //SharedLinks='https://pro.admin.myh2o.org.cn';
}

module.exports = {
  download:APIV3,
  name: 'Cig Group',
  prefix: 'cigGroup',
  footerText: '动么科技有限公司  © 2018 ',
  logo: '/logo.png',
  reactLogo: '/technologyLogo/react.png',
  antdesignLogo: '/technologyLogo/ant design.png',
  dockerLogo: '/technologyLogo/docker.png',
  elasticsearchLogo: '/technologyLogo/elasticsearch.png',
  kubernetesLogo: '/technologyLogo/kubernetes.png',
  mysqlLogo: '/technologyLogo/MySQL.png',
  china: '/country/china.svg',
  usa: '/country/usa.svg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  sharedLinks:SharedLinks,
  api: {
    urls: `${APIV3}`,
    webSocketUrl: "ws:" + APIV3.substring(APIV3.indexOf("//")),
    userLogin: `${APIV3}/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV3}/auth`,
    setting: `${APIV3}/setting`,
    user: `${APIV3}/user`,
    vendor: `${APIV3}/vendor`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
    goods: `${APIV3}/goods`,
    vp: `${APIV3}/vp`,
    productList: `${APIV3}/product`,
    customer: `${APIV3}/customer`,
    salesPi: `${APIV3}/salesPi`,
    po: `${APIV3}/poList`,
    salary: `${APIV3}/salary`,
    backlog: `${APIV3}/backlog`,
    mu: `${APIV3}/mu`,
    analysis: `${APIV3}/SalesAnalysis`,
    dataAnalysis: `${APIV3}/dataAnalysis`,
    homePage: `${APIV3}/homePage`,
    manufacture: `${APIV3}/manufacture`,
    pm: `${APIV3}/pm`,
    resource: `${APIV3}/resource`,
    sys: `${APIV3}/sys`,
    draw: `${APIV3}/draw`,
    message: `${APIV3}/message`,
    form: `${APIV3}/temp`,
    region: `${APIV3}/region`,
    account: `${APIV3}/account`,
    waterworks: `${APIV3}/waterworks`,
    importExcelTempTable: `${APIV3}/temp/importExcelTempTable`,
    importExcelTempWithData: `${APIV3}/temp/importExcelTempWithData`,
    user: `${APIV3}/user`,
    importCashExcel: `${APIV3}/CashUpload/importCashExcel`,
    GoodsUpload: `${APIV3}/GoodsUpload/importExcel`,
    ContactUpload: `${APIV3}/ContactUpload/importExcelContact`,
    CustomerContactUpload: `${APIV3}/CustomerContactUpload/importContactExcel`,
    CustomerTempUpload: `${APIV3}/CustomerTempUpload/importExcelCustomerTemp`,
    VendorContactUpload: `${APIV3}/VendorContactUpload/importExcelVendorContact`,
    VendorUpload: `${APIV3}/VendorUpload/importExcelVendor`,
    fileUpload: `${APIV3}/setting/fileUpload`,
    pmFileUpload:`${APIV3}/pm/fileUpload`,
    goodsPictureUpload: `${APIV3}/goods/goodsPictureUpload`,
    quotationUpload: `${APIV3}/message/quotationUpload`,
    pohtoUpload: `${APIV3}/auth/pohtoUpload`,
    projectUpload: `${APIV3}/pm/projectResourceUpload`,
    dingding:`${APIV3}/`,
    projectResourceUrl:"",
    dlowdContactUpload:`${APIV3}/ContactUpload`,
    wx:`${APIV3}/openwx`,
    wxUpload:`${APIV3}/openwx/material/upload`,
    shareUrl:`${APIV3}/shareUrl`,
  },
}
