import {query, queryMenu, updateMenu, queryUnderlying, updateUnderling} from '../../services/user'
import {routerRedux} from 'dva/router'

export default {

  namespace: 'userDetail',

  state: {
    data: {},
    roleMenu: [],
    treeMenu: [],
    defaultMenu: [],
    salesUnderling: [],
    warehouseUnderling: [],
    accountantUnderling: [],
    purchaserUnderling: [],
    underling: [],
    roleList: [],
    allUnderlying:[],
    mockData:[],
    targetKeys:[],
  },

  effects: {
    *query ({
      payload,
    }, {call, put}) {
      if (payload.flag == 'menu') {
        yield put(routerRedux.push('user/' + payload.id))
      } else {
        const data = yield call(query, payload)
        if (data) {
          let roles = data.role;
          let roleMenu = [];
          if (roles.indexOf(',') > -1) {
            roleMenu = roles.split(',');
          } else {
            roleMenu.push(roles);
          }

          yield put({
            type: 'querySuccess',
            payload: {
              data: data,
              roleMenu: roleMenu[0].filter(item=>item.toString().indexOf("manager") == -1),
            },
          })

          yield put({
            type: 'queryUnderlying',
            payload: data
          })

        }
      }
    },

    //查询所有菜单信息(菜单管理)
    *queryMenu ({payload = {}}, {call, put}) {
      let data = yield call(queryMenu, payload);
      //data.list [0]:根目录 [1]:子目录 [2]:当前用户已有权限
      if (data) {
        let roles = [];
        let menu = data.list;
        let menus = [];
        let menus2 = [];//最终树结果
        let defaultMenu = [];//用户已有的权限
        defaultMenu.push("root")

        menu[2].forEach(item=> {
          defaultMenu.push("" + item.id)
        })
        const roots = menu[0];
        const childs = menu[1];
        for (var i in roots) {
          let child = [];
          let child2 = [];//最终root孩子的孩子节点
          //添加root下的孩子节点
          var m = new Object();
          m.key = roots[i].id;
          m.title = roots[i].label;

          //添加root下的孩子的孩子节点
          child = childs.filter(item=> {
            return item.parent_id == roots[i].id;
          });
          //格式化孩子节点
          for (var j in child) {
            var m2 = new Object();
            m2.key = child[j].id;
            m2.title = child[j].label;
            child2.push(m2)
          }

          m.children = child2
          menus.push(m);

          if (i == (roots.length - 1)) {
            var root = new Object();
            root.key = 'root';
            root.title = 'root';
            root.children = menus
            menus2.push(root);
          }
        }
        yield put
        ({
          type: 'queryMenuSuccess',
          payload: {
            treeMenu: menus2,
            defaultMenu: defaultMenu,
            roleName: payload.roleName
          },
        })

      }
    },

    *updateMenu ({
      payload,
    }, {call, put}) {
      const data = yield call(updateMenu, payload)
      if (data.list[0].success) {
        yield put
        ({
          type: 'queryMenu',
          payload: {
            id: payload.staffId,
            roleName: payload.roleName
          },
        })
      }
    },

    *queryUnderlying ({
      payload,
    }, {call, put}) {
      const data = yield call(queryUnderlying, payload)
      if (data.list.length > 0) {
        //list[0]:各角色的下属名单 list[1]:当前用户的下属
        let accountants = [];
        let sales = [];
        let warehouses = [];
        let purchasers = [];
        let underlings = [];
        let allUnderlyings=[];

        let user=JSON.parse(sessionStorage.getItem("userStorage"))
        //非Boss则只显示下属的名字选项
        if(user.role.toString().indexOf("boss")<0){
          if(null!=user.underling&&null!=user.role){
            let underling=user.underling.toString().split(",")
            for( let i=0;i<underling.length;i++){
              for (var j in  data.list[0].accountant) {
                if(data.list[0].accountant[j].userName == underling[i]){
                  accountants.push(data.list[0].accountant[j].userName);
                }
              }
              for (var k in  data.list[0].sales) {
                if(data.list[0].sales[k].userName == underling[i]){
                  sales.push(data.list[0].sales[k].userName);
                }
              }
              for (var x in  data.list[0].warehouse) {
                if(data.list[0].warehouse[x].userName == underling[i]){
                  warehouses.push(data.list[0].warehouse[x].userName);
                }
              }
              for (var y in  data.list[0].purchaser) {
                if(data.list[0].purchaser[y].userName == underling[i]){
                  purchasers.push(data.list[0].purchaser[y].userName);
                }
              }
            }
          }
        }
       else{
          for (var i1 in  data.list[0].accountant) {
            accountants.push(data.list[0].accountant[i1].userName);
          }
          for (var j1 in  data.list[0].sales) {
            sales.push(data.list[0].sales[j1].userName);
          }
          for (var x1 in  data.list[0].warehouse) {
            warehouses.push(data.list[0].warehouse[x1].userName);
          }
          for (var y1 in  data.list[0].purchaser) {
            purchasers.push(data.list[0].purchaser[y1].userName);
          }
        }

        //判断当前用户是否有下属
        if (payload.underling != null && payload.underling != 'null') {
          underlings = payload.underling.toString().split(',');
        }


        yield put({
          type: 'queryUnderlyingSuccess',
          payload: {
            accountantUnderling: accountants,
            salesUnderling: sales,
            warehouseUnderling: warehouses,
            purchaserUnderling: purchasers,
            underling: underlings,
          },
        })

      }
    },

    *updateUnderling({payload}, {call}){
      const data = yield call(updateUnderling, payload)
    }
  },

  reducers: {
    querySuccess (state, {payload}) {

      return {
        ...state,
        ...payload,
      }
    },

    queryMenuSuccess (state, {payload}) {
      const {treeMenu, defaultMenu, roleName} = payload
      return {
        ...state,
        treeMenu,
        defaultMenu,
        roleName
      }
    },

    queryUnderlyingSuccess (state, {payload}) {
      const {accountantUnderling, salesUnderling, warehouseUnderling, purchaserUnderling, underling} = payload
      return {
        ...state,
        accountantUnderling,
        salesUnderling,
        warehouseUnderling,
        purchaserUnderling,
        underling,

      }
    },

    updateRole (state, {payload}) {
      const {roleList}=payload;
      return {
        ...state,
        ...payload,
      }
    },
  },

}
