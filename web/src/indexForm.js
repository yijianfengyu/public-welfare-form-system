//import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import {browserHistory} from 'dva/router'
import {message} from 'antd'
import 'subschema-css-bootstrap/lib/style.css';
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
app.start('#xxxxxxxx')

