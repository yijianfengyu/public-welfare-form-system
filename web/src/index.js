//import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import {browserHistory} from 'dva/router'
import {message} from 'antd'
import 'subschema-css-bootstrap/lib/style.css';
import {loader} from 'subschema';
import Uploads from "./components/Form/Uploads";
import UploadsImg from "./components/Form/UploadsImg";
import DataTimes from "./components/Form/DataTimes";
import FormDate from "./components/Form/FormDate";
import FormDatetime from "./components/Form/FormDatetime";
import Cascade from "./components/Form/Cascade";
import CheckboxGroup from "./components/Form/CheckboxGroup";
import FormRadioGroup from "./components/Form/FormRadioGroup";
import FormLink from "./components/Form/FormLink";
import FormPhone from "./components/Form/FormPhone";
import FormRegion from "./components/Form/FormRegion";
import FormGps from "./components/Form/FormGps";
import FormPercentage from "./components/Form/FormPercentage";
import FormDropdown from "./components/Form/FormDropdown";
import RadioAttach from "./components/Form/RadioAttach";
import FormMeasurement from "./components/Form/FormMeasurement";
import Select from "./components/Form/Select";
import FormNumber from './components/Form/FormNumber'
import FormInt from './components/Form/FormInt'
import FormInput from './components/Form/FormInput'
import FormText from './components/Form/FormText'
import FormDaily from './components/Form/FormDaily'
// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError (error) {
    if( 600==error.statusCode){
      message.error("网络请求超时，请刷新页面重新访问")
    }
  },
})
// 2. Model
app.model(require('./models/app'))
// 3. Router
app.router(require('./router'))
// 4. Start
app.start('#root')
//initForm
loader.addType('Uploads', Uploads);
loader.addType('UploadsImg', UploadsImg);
loader.addType('FormNumber', FormNumber);//数字
loader.addType('FormInt', FormInt);//数字
loader.addType('FormInput', FormInput);//单行文本
loader.addType('FormText', FormText);//多行文本
//loader.addType('FormDaily', FormDaily);//日志类型
loader.addType('DataTimes', DataTimes);//时间范围
loader.addType('FormDate', FormDate);//日期
loader.addType('FormDatetime', FormDatetime);//时间
loader.addType('FormGps', FormGps);//GPS坐标
loader.addType('Cascade', Cascade);
loader.addType('Select', Select);
loader.addType('CheckboxGroup', CheckboxGroup);
loader.addType('FormRadioGroup', FormRadioGroup);
loader.addType('FormLink', FormLink);
loader.addType('FormPhone', FormPhone);
loader.addType('FormPercentage', FormPercentage);
loader.addType('FormDropdown', FormDropdown);
loader.addType('FormMeasurement', FormMeasurement);
loader.addType('FormRegion', FormRegion);


