import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {config} from 'utils'
import {createProjectReport,queryProjectReport,addProjectResourceModel} from '../services/projectManage'
import {message} from 'antd'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'teletext',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    TableList:"",
    editorStateOne:"",
    name:"",
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/teletext') {
          dispatch({
            type: 'app/querySuccess',
            payload: {
              headerVisible: false,
              menuVisible: false,
            }
          })
          dispatch({
            type: 'queryProjectReport',
            payload: {
              resourcesUuid: location.query.UUID,
              projectId: location.query.projectId,
            }
          })
        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *addProjectResourceModel({payload = {}}, {call, put, select}){
      const data = yield call(addProjectResourceModel, payload);
      const projectRecord = yield select(({projectManage})=> projectManage.projectRecord)
      if (data.success) {
        if (data.flag) {
          message.success("上传资源模板成功")
        } else {
          message.error("上传资源模板失败")
        }
      }
    },
    //添加
    *createProjectReport({payload}, {call,put}){
      const data = yield call(createProjectReport, payload);
      if (data.success == true) {
        message.success(data.message)
      }else{
        message.warning(data.message)
      }
    },
    //查询
    *queryProjectReport({payload}, {call,put}){
      const data = yield call(queryProjectReport, payload);
      if (data.success == true) {
        if(data.list.length!=0){
          console.log("--queryProjectReport--1");
          if(data.list[0].id!=null){
            console.log("--queryProjectReport--1.1");
            let html=data.list[0].content
            const contentBlock = htmlToDraft(html);
            let editorStateOne
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              editorStateOne = EditorState.createWithContent(contentState);
            }
            yield put({
              type: 'querySuccess',
              payload: {
                TableList: data.list,
                editorStateOne:editorStateOne,
                name:data.list[0].resourcesName
              }
            })
          }else{
            console.log("--queryProjectReport--1.2");
            const contentBlock = htmlToDraft("<p></p>");
            let editorStateOne
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              editorStateOne = EditorState.createWithContent(contentState);
            }
            yield put({
              type: 'querySuccess',
              payload: {
                TableList: [],
                editorStateOne:editorStateOne,
                name:data.list[0].resourcesName
              }
            })
          }
        }else {
          console.log("--queryProjectReport--2");
          yield put({
            type: 'querySuccess',
            payload: {
              TableList: [],
            }
          })
        }
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
  },
})
