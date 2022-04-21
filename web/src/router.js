import React from 'react'
import {Router} from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, {component: require('./routes/dashboard/')})
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        },
        {
          path: 'register',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/register'))
              cb(null, require('./routes/register/'))
            }, 'register')
          },
        },
        {
          path: 'shareInsertDaily',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/shareInsertDaily'))
              cb(null, require('./routes/projectManage/shareInsertDaily'))
            }, 'shareInsertDaily')
          },
        },
        {
          path: 'visit/employee',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/user'))
              registerModel(app, require('./models/user/detail'))
              cb(null, require('./routes/user/'))
            }, 'user')
          },
        },
        {
          path: 'visit/projectManage',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/projectManage'))
              cb(null, require('./routes/projectManage/'))
            }, 'projectManage')
          },
        },
        {
          path: 'visit/examQuestion',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/examQuestion'))
              cb(null, require('./routes/examQuestion/'))
            }, 'examQuestion')
          },
        },
        {
          path: 'visit/resource',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/resource'))
              cb(null, require('./routes/resource/'))
            }, 'resource')
          },
        },
        {
          path: 'visit/region',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/region'))
              cb(null, require('./routes/region/'))
            }, 'region')
          },
        },
        {
          path: 'visit/account',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/account'))
              cb(null, require('./routes/wechatAccount/'))
            }, 'account')
          },
        },
       /* {
          path: 'visit/formPage',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/formPage'))
              cb(null, require('./routes/formPage/'))
            }, 'formPage')
          },
        },*/
        {
          path: 'visit/accountManagement',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/accountManagement'))
              cb(null, require('./routes/accountManagement/'))
            }, 'accountManagement')
          },
        },
        {
          path: 'visit/shareAccount',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/shareAccount'))
              cb(null, require('./routes/accountManagement/shareAccount'))
            }, 'ShareAccount')
          },
        }, {
          path: 'share_success',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/shareSucceed'))
              cb(null, require('./routes/accountManagement/shareSucceed'))
            }, 'ShareSucceed')
          },
        },
        {
          path: 'visit/personalCenter',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/personalCenter'))
              cb(null, require('./routes/personalCenter/'))
            }, 'personalCenter')
          },
        },
        {
          path: '/visit/organization',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/organization'))
              cb(null, require('./routes/organization/'))
            }, 'Organization')
          },
        },
        {
          path: '/visit/shareData',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/shareData'))
              cb(null, require('./routes/forms/shareData'))
            }, 'ShareData')
          },
        },
        {
          path: 'visit/contactManagement',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/contactManagement'))
              cb(null, require('./routes/contactManagement/'))
            }, 'contactManagement')
          },
        }, {
          path: 'visit/waterDraw',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/waterDraw'))
              cb(null, require('./routes/waterDraw/'))
            }, 'WaterDraw')
          },
        },{
          path: 'visit/waterEditor',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/waterEditor'))
              cb(null, require('./routes/waterEditor/'))
            }, 'WaterEditor')
          },
        },
        {
          path: 'visit/shareContact',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/shareContact'))
              cb(null, require('./routes/contactManagement/shareContact'))
            }, 'ShareContact')
          },
        },
        {
          path: 'visit/teletext',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/teletext'))
              cb(null, require('./routes/teletext/'))
            }, 'Teletext')
          },
        },

        {
          path: 'visit/contact',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/contact'))
              cb(null, require('./routes/contact/'))
            }, 'contact')
          },
        },
        {
          path: '/visit/forms',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/forms'))
              cb(null, require('./routes/forms/'))
            }, 'forms')
          },
        },
        {
          path: '/visit/table/:formId',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/forms'))
              cb(null, require('./routes/forms/'))
            }, 'table')
          },
        },
        {
          path: '/visit/weChat',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/weChat'))
              cb(null, require('./routes/weChat/'))
            }, 'weChat')
          },
        },
        {
          path: 'submit_success',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/selectForm'))
              cb(null, require('./routes/operationFrom/Success'))
            }, 'SelectForms')
          },
        },{
          path: 'link_error',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/linkError'))
              cb(null, require('./routes/error/linkError'))
            }, 'LinkError')
          },
        },
        {
          path: '/visit/selectForms',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/selectForm'))
              cb(null, require('./routes/operationFrom/index'))
            }, 'SelectForms')
          },
        },
        {
          path: 'router/sales',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/app'))
              // cb(null, require('./routes/UIElement/layer/'))
            }, 'sales')
          },
        },

        {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              registerModel(app, require('./models/user'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'request',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/request/'))
            }, 'request')
          },
        },
        {
          path: 'visit/report',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/report'))
              cb(null, require('./routes/report/'))
            }, 'report')
          },
        },
        {
          path: 'shareError',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/shareSucceed'))
              cb(null, require('./routes/forms/shareError'))
            }, 'shareError')
          },
        },
        {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes}/>
}


export default Routers
