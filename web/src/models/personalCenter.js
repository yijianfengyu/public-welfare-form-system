import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {getPersonalCenter,UpdateMangers,wxAuthorize} from '../services/accountManagement'

import {message} from 'antd'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'personalCenter',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    tableList: [],
    userName:'',
    imgName:'',
    user:"",
    nickName:null
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/personalCenter') {
          let user = JSON.parse(sessionStorage.getItem("UserStrom"))
          if (user == null) {
            dispatch({
              type: 'app/querys'
            })
          } else {
            dispatch({
              type: 'SelectAll',
              payload: {
              }
            })
            //获取授权code
            let code = location.query.code;
            if(code !=undefined){
              dispatch({
                type: 'wxAuthorize',
                payload: {
                  code
                }
              })
            }
          }
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    //查询
    *SelectAll({payload}, {call,put}){
      const data = yield call(getPersonalCenter, payload);
      if (data.success == true) {
        //sessionStorage.setItem("imgOne",imgName)
        yield put({
          type: 'querySuccess',
          payload: {
            tableList: data.resultList,
            nickName: data.resultList[0].nickName
          }
        })
      }
    },
    //修改
    *UpdateAccount({payload}, {call,put,select}){
      const data = yield call(UpdateMangers, payload);
      const name = yield select(({personalCenter})=> personalCenter.userName)
      sessionStorage.setItem("userNameOne",name)
      if (data.flag == 1) {
        message.success(data.message)
        yield put({
          type:'app/querySuccess',
          payload:{
            userNameOne:sessionStorage.getItem("userNameOne")
          }
        })
        yield put({
          type: 'SelectAll',
          payload: {
          }
        })
      } else {
        message.warning(data.message)
      }
    },
    //绑定微信
    *wxAuthorize({payload}, {call,put}){
      const data = yield call(wxAuthorize, payload);
      if(data.flag==1){
        yield put({
          type: 'SelectAll',
          payload: {
          }
        })
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
  },
})
