import {login} from '../services/login'
import {routerRedux} from 'dva/router'
import {queryURL} from 'utils'

export default {
  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'contact',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    loginLoading: false,
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {},
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    //请求action
    *login ({payload,}, {put, call}) {
      yield put({type: 'showLoginLoading'})
      //获取登录结果
      const data = yield call(login, payload)

      yield put({type: 'hideLoginLoading'})
      //登录成功
      const result = data.list[data.list.length - 1].loginResult;
      if (result == '1') {
        const from = queryURL('from')
        yield put({type: 'app/query', param: data})
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          // yield put(routerRedux.push('/dashboard'))
        }
        //未注册
        // } else if(result==='unlogin'){
        //   throw data
      } else {
        throw data
      }
    },
  },
  // 该属性存放的是对state的合并方法。基本上就是将新的state值合并到原来的state中, 以达到state的同步。reducer的含义就是多个合并返回一个的意思。
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
