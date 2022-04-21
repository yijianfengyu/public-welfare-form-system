import {query, getCreateMaxNumber,queryMenu} from '../services/app'
import {routerRedux} from 'dva/router'
import config from 'config'
import {SelectPrincipal} from '../services/contactManagement'
import {loginOut} from '../services/login'

const {prefix} = config
export default {
  namespace: 'app',
  state: {
    selectedKeys:[],
    user: {},
    permissions: [],
    data: {},
    menu: [],
    title: [],
    queryread: [],
    swcheck: false,
    menuPopoverVisible: false,
    siderFold: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ?true:false,
    darkTheme: 'false',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    permissionList: [],
    currentRole: "",
    objOne: {},//发送消息的对象
    objTwo: {},
    objThere: {},
    webSocket: {},
    backModalVisible: false,
    AddBacklogModalVisible: false,
    visible: false,
    backlogName: [],
    results: [],
    PurchaserbacklogChildList: [],
    vFilter: [],
    addinsert: [],
    issueBy: [],
    startDate: [],
    endDate: [],
    executeBy: [],
    RemarkList: [],
    remark: [],
    queryBacklogoneList: [],
    ReadList: [],
    state: [],
    readId: [],
    readBy: [],
    affirmDate: [],
    bid: [],
    BeiZhu: [],
    BacklogCount: [],
    addbackString: [],
    sendMessageModalVisible: false,
    chooseStatus: false,//true是客户，false是同事
    userRecord: [],
    staffList: [],
    selectedRowKeys: [],
    peopleNumber: 0,
    peopleName: [],
    chatModalVisible: false,
    anyvapeMessages: [],
    anyvapeStaffList: [],
    salesRecord: {},
    chatRechord: [],
    chatList: [],
    questionModalVisible: false,
    fileList: [],
    currentSystemMessage: [],
    options: [],
    exchangeModalVisible: false,
    companyRate: [],
    headerVisible: true,
    menuVisible: true,
    companyList: [],
    optionItem:[],
    companyName:'',
    userNameOne:'',
    imgOne:'',
  },
  subscriptions: {
    setup ({dispatch,history}) {
      dispatch({type: 'querys'});
      history.listen((location) => {
          dispatch({type: 'urlChangeMenu',payload:{pathname:location.pathname}})
      });
    },
  },

  effects: {
    //查询负责人
    *urlChangeMenu({payload,},{put, call, select}){
      const menu = yield select(({app}) => app.menu);
      let selectedKeys=[];
      for(let i=0;i<menu.length;i++){
        if(menu[i].route==payload.pathname){
          selectedKeys.push(menu[i].name);
          break;
        }
      }
      yield put({
        type: 'querySuccess',
        payload: {
          selectedKeys:selectedKeys
        }
      })
    },
    *SelectPrincipalAll({payload}, {call,put,select}){
      const data = yield call(SelectPrincipal, payload);
    ////  console.log("进查询")
      if (data.success == true) {
        const item=[]
        if(data.list.length>0){
          for(var a in data.list){
            item.push(<Option key={data.list[a]}>{data.list[a]}</Option>);
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            optionItem:item
          }
        })
      }
    },
    *querys ({param}, {call, put,select}) {
      const {success, obj} = yield call(queryMenu, param);
      if(location.href.indexOf("/visit/selectForms")>0){
        return;
      }
      if(location.href.indexOf("/visit/shareData")>0){
        return;
      }
      if(location.href.indexOf("/visit/shareError")>0){
        return;
      }
      if(location.href.indexOf("/visit/teletext")>0){
        return;
      }
      if(location.href.indexOf("submit_success")>0){
        return;
      }
      if(location.href.indexOf("link_error")>0){
        return;
      }
      if(location.href.indexOf("/visit/shareContact")>0){
        return;
      }
      if(location.href.indexOf("/visit/shareAccount")>0){
        return;
      }
      if(location.href.indexOf("share_success")>0){
        return;
      }
      let selectedKeys=[];
      if (param) {
        let menu =[];
        if (success && obj) {
          for (let i in obj) {
            let object = new Object();
            object.name = obj[i].title;
            object.id = obj[i].id;
            object.mpid = obj[i].pid;
            object.icon = obj[i].icon;
            object.route = obj[i].path;
            if(obj[i].path==location.pathname){
              selectedKeys.push(obj[i].title);
            }
            menu.push(object)
          }
        }
        // let  menu;
        // if(param.roleType=="admin"){
        //   menu = [
        //     {name: "首页",id: 84,mpid: "",icon: "home",route: "/dashboard"},
        //     {name: "联系人",id: 85,mpid: "",icon: "usergroup-add",route: "/visit/contactManagement"},
        //     {name: "项目管理",id: 86,mpid: "",icon: "area-chart",route: "/visit/projectManage"},
        //     {name: "表单", id: 90, mpid: "", icon: "file-text", route: "/visit/forms"},
        //     {name: "账户管理", id: 91, mpid: "", icon: "solution", route: "/visit/accountManagement"},
        //     {name: "机构设置", id: 92, mpid: "", icon: "setting", route: "/visit/organization"},
        //     {name: "微信公众号管理", id: 93, mpid: "", icon: "api", route: "/visit/weChat"},
        //     {name: "数据地图", id: 94, mpid: "", icon: "environment", route: "/visit/waterDraw"},
        //     {name: "地图编辑器", id: 94, mpid: "", icon: "edit", route: "/visit/waterEditor"},
        //   ];
        // }else if(param.roleType=="normal"){
        //   menu = [
        //     {name: "首页",id: 84,mpid: "",icon: "home",route: "/dashboard"},
        //     {name: "联系人",id: 85,mpid: "",icon: "usergroup-add",route: "/visit/contactManagement"},
        //     {name: "项目管理",id: 86,mpid: "",icon: "area-chart",route: "/visit/projectManage"},
        //     {name: "表单", id: 90, mpid: "", icon: "file-text", route: "/visit/forms"},
        //     {name: "数据地图", id: 94, mpid: "", icon: "environment", route: "/visit/waterDraw"},
        //     {name: "地图编辑器", id: 94, mpid: "", icon: "edit", route: "/visit/waterEditor"},
        //   ];
        // }
        let aa = true;
        let str = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        if(str!="login"){
          aa=false;
        }
        if (aa) {   //跳回主页
          if(sessionStorage.getItem("last_visit_url")!=null&&sessionStorage.getItem("last_visit_url")!="null"){
            yield put(routerRedux.push(sessionStorage.getItem("last_visit_url")));
          }else{
            yield put(routerRedux.push("/"));
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            menu: menu,
            selectedKeys:selectedKeys,
          },
        })
      }
      else {
        const menu = yield select(({app}) => app.menu);
        for(let i=0;i<menu.length;i++){
          if(menu[i].route==location.pathname){
            selectedKeys.push(menu[i].name);
            break;
          }
        }
        if (sessionStorage.getItem("UserStrom") != null&&sessionStorage.getItem("userStorage") != null) {
          // yield put({type: 'app/queryCompany', param: user})
          yield put({
            type: 'updateState',
            payload: {
              userNameOne: sessionStorage.getItem("userNameOne"),
              companyName:sessionStorage.getItem("companyName"),
              imgOne:sessionStorage.getItem("imgOne"),
              selectedKeys:selectedKeys,
            },
          })
          //刷新
          let user = JSON.parse(sessionStorage.getItem("UserStrom"));
          yield put({type: 'querys', param:user});

        } else if (location.href.indexOf("register") > 0) {
          return;
        } else if (config.openPages && config.openPages.indexOf(location.pathname) < 0) {
          // 输入localhost:7272就自动跳转至登录界面
          sessionStorage.removeItem("UserStrom");
          sessionStorage.removeItem("userStorage");
          sessionStorage.removeItem("companyName");
          sessionStorage.removeItem("userNameOne");
          sessionStorage.setItem("last_visit_url",location.pathname+location.search)
          //自动跳转至登录页面
          window.location = `${location.origin}/login`;
        }
      }
    },

    *logout ({payload}, {call, put}) {
      const data = yield call(loginOut, payload)
      sessionStorage.clear();
      if (data.success) {
        yield put({type: 'querys'})
        yield put({
          type: 'login/querySuccess',
          payload: {
            hasPermission: false,
          }
        })
      } else {
        throw (data)
      }
    },
    *changeNavbar ({payload,}, {put, select}) {
      const {app} = yield(select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({type: 'handleNavbar', payload: isNavbar})
      }
    },
    //*queryCompany ({payload,}, {put, select}) {
    // const data=yield call(, payload)
    //},

    *getCreateMaxNumber({payload}, {call, put}){
      const data = yield call(getCreateMaxNumber, payload);
      if (data.success) {
        if (false == data.list[0]) {
          warning("没有剩余可添加用户数量");
        } else {
          //查询所属分公司选项
          yield put({
            type: 'user/showDetailModal',
            payload: {
              modalType: 'create',
            },
          })
        }

      }
    },

  },
  reducers: {
    showSendMessage(state, {payload}){
      return {...state, ...payload, sendMessageModalVisible: true}
    }
    ,
    hideSendMessage(state, {payload}) {
      return {...state, ...payload, sendMessageModalVisible: false}
    },
    showChatMessage(state, {payload}){
      return {...state, ...payload, chatModalVisible: true}
    }
    ,
    hideChatMessage(state, {payload}) {
      return {...state, ...payload, chatModalVisible: false}
    },
    showAddBacklogModalVisible (state, {payload}) {
      return {...state, ...payload, AddBacklogModalVisible: true}
    },

    hideAddBacklogModalVisible (state, {payload}) {
      return {...state, ...payload, AddBacklogModalVisible: false}
    },
    querySuccess(state, {payload}){
      return {
        ...state,
        ...payload
      }
    },
    updateState (state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, {payload}) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, {payload: navOpenKeys}) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    handleClickNavMenu (state, {payload: navOpenKeys}) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    updateRole (state, {payload}) {
      const {currentRole} = payload;

      return {
        currentRole,
        ...state,
        ...payload,
      }
    },

  },
}
