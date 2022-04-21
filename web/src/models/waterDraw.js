import modelExtend from 'dva-model-extend'
import {pageModel} from './common'
import {querysOverlayPath,saveOverlayPath,deletePath} from '../services/waterDraw'
import {queryPeopleHotMapService} from '../services/dashboard'
import {Draw} from '../routes/waterDraw/components/Draw'
import TableUtils from '../utils/TableUtils'
import {GaodeDraw} from '../routes/waterDraw/components/GaodeDraw'

import  'echarts/extension/bmap/bmap'
import 'echarts/lib/component/geo';
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/scatter';
import  'echarts/lib/chart/effectScatter';
import  'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
export default modelExtend(pageModel, {

  // 模型的命名空间，这个是必须的，而且在同一个应用中每个模型的该属性是唯一的
  namespace: 'waterDraw',
  // 与具体route相关的所有状态数据结构存放在该属性中。比如数据列表，当前操作项，弹出层的显隐状态等等都可以保存在该属性中。
  state: {
    paths:null,
    tabIndex:0,
    defaultCity:"北京市",
    draw:new Draw(),
    gdEdit:new GaodeDraw(),
    peopleHotEcharts:null,
    echartsPeopleHotSetting:null,
    currentPath:null,
  },
  // 该属性存放从源获取数据的设置。 比如当pathname和给定的名称匹配的时候，执行什么操作之类的设置。
  subscriptions: {
    setup ({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/visit/waterDraw'){
          let user = JSON.parse(sessionStorage.getItem("UserStrom"))
          if (user == null) {
            dispatch({
              type: 'app/querys'
            })
          } else {
            dispatch({
              type: 'initOverlayPath',
              payload: {},
            })
          }


        }
      })
    }
  },
  // 该属性存放的是异步操作的一些方法。从词语字面意思理解来说，是副作用，就是请求非幂等性的。比如异步获取数据列表、异步更新、异步插入、异步删除等等操作。
  effects: {
    *initOverlayPath({payload = {}}, {call, put,select}){
      const data = yield call(querysOverlayPath, payload);
      let draw = yield select(({waterDraw}) => waterDraw.draw);
      draw.clearAll();
      draw.setMyOverlay(data.list);
      //let gdEdit = yield select(({waterDraw}) => waterDraw.draw);
      //console.log("-----------initOverlayPath-------------");
      //gdEdit.init();
      yield put({
        type: "querySuccess",
        payload: {
          ...payload,
          draw:draw,
          echartsPeopleHotSetting: echartsPeopleHotSetting,
          peopleHotEcharts:echart,
        }
      })
    },
    *querysOverlayPath({payload = {}}, {call, put,select}) {
      console.log("--------querysOverlayPath");
      const data = yield call(querysOverlayPath, payload);
      //console.log("--------querysOverlayPath");
      let draw = yield select(({waterDraw}) => waterDraw.draw);
      //console.log(data);
      draw.setMyOverlay(data.list);

      var echart=null;
      var echartsPeopleHotSetting=null;
      if(payload.tabIndex==9){
        const data2 = yield call(queryPeopleHotMapService, payload);
        echartsPeopleHotSetting = TableUtils.createAreaHotSetting(JSON.parse(data2.obj));

      }else if (payload.tabIndex==8) {
        draw.loadMyOverlay(true,true);
      }else if(payload.tabIndex==1||payload.tabIndex==2){
        console.log("---------------------0");
        draw.loadMyOverlay(false,false);
        console.log("---------------------1");
      }else{
        draw.loadMyOverlay(false,true);
      }

      console.log("--------over-------------------");
      //return {...payload,draw:draw}
      yield put({
        type: "querysOverlayPathS",
        payload: {
          ...payload,
          draw:draw,
          peopleHotEcharts:echart,
          echartsPeopleHotSetting:echartsPeopleHotSetting,
        }
      })
    },
    *queryPeopleHotMap({payload = {}}, {call, put,select}){
      const data = yield call(queryPeopleHotMapService, payload);
      let echartsPeopleHotSetting = TableUtils.createAreaHotSetting(JSON.parse(data.obj));
      yield put({
        type: "querySuccess",
        payload: {
          echartsPeopleHotSetting: echartsPeopleHotSetting,
        }
      })
    },
    *filterQueryPath({payload = {}}, {call, put,select}){
      const data = yield call(querysOverlayPath, payload);
      console.log("--------filterQueryPath");
      let draw = yield select(({waterDraw}) => waterDraw.draw);
      console.log(data);
      draw.setMyOverlay(data.list);

      if(payload.tabIndex==1||payload.tabIndex==2){
        draw.loadMyOverlay(false,false);
      }else{
        draw.loadMyOverlay(false,true);
      }
      yield put({
        type: "querysOverlayPathS",
        payload: {
          ...payload,
          draw:draw,
        }
      })
    },
    *saveOverlayPath({payload = {}}, {call, put,select}){
      console.log("-------save------");
      console.log(payload);
      const data = yield call(saveOverlayPath, payload);
      console.log(data);
      yield put({
        type: "querySuccess",
        payload: {
          ...payload,
        }
      })
    },
    *updateOverlayPath({payload = {}}, {call, put,select}){
      console.log("-------save------");
      const data = yield call(saveOverlayPath, payload);
      //如果是闭包中使用会报错,所以注释掉了
      /**yield put({
        type: "querySuccess",
        payload: {
          ...payload
        }
      })**/
    },
    *deletePath({payload = {}}, {call, put,select}){
      console.log("------delete------");
      console.log(payload);
      const data = yield call(deletePath, payload);
      yield put({
        type: "querySuccess",
        payload: {
        }
      })
    },
    *setCurrentPath({payload = {}}, {call, put,select}){
      console.log("--------设置当前被单击的覆盖物------");
      console.log(payload);

      yield put({
        type: "querySuccess",
        payload: {
          ...payload
        }
      })
    }
  },

  reducers: {
    querysOverlayPathS(state, {payload}){
      return {state,...payload}
    },
    querySuccess(state, {payload}){
      return {...state, ...payload}
    },
  },
})
