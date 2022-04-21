
import {message} from 'antd'
import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {insertContact} from '../services/contactManagement'
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'shareSucceed',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/share_success'||location.pathname === '/shareError') {
          dispatch({
            type: 'app/querySuccess',
            payload: {
              headerVisible: false,
              menuVisible: false,
            }
          })
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {

  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
  },
})
