import {registerUser, toSms1} from '../services/login'
import {queryURL} from 'utils'
import {Layout, Loader} from 'components'
import {message} from 'antd';
export default {
  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'register',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    companyName: '',
    userName: '',
    password: '',
    email: '',
    tel: '',
    newuserPass: '',
    disableds: false,
    codeButtText: '发送验证码',
    second: [],
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history,}) {
      history.listen(location => {
        if (location.pathname === '/register') {
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
    //请求action
    *registerToUser({payload,}, {put, call}) {
      const data = yield call(registerUser, payload)
      if (data.flag == 1) {
        message.info(data.message)
        return (<div>
          <Loader fullScreen spinning={[window.location = `/login`]}/>
        </div>)
      } else if (data.flag == 0) {
        message.error(data.message)
      } else if (data.success == 'false') {
        message.error(data.message)
      }
    },
    *toSms({payload}, {put, call}) {
      const data = yield call(toSms1, payload);
       if (data.flag == 1) {
         message.success(data.message)
       } else {
         message.error(data.message)
       }
    },
  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
  },
}
