import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
// import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import qs from 'qs'

const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  let { data, url, method = 'get' } = options
  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}?callback=jsonp_${new Date().getTime()}${isEmpty(cloneData) ? '' : '&'}${qs.stringify(cloneData)}`
      : url+`?callback=jsonp_${new Date().getTime()}`

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  options.transformRequest = [function (data) {
    let ret = ''
    for (let it in data) {
      if(data[it]!=undefined){
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
    }
    return ret
  }]


  //跨域请求保证session正常
  axios.defaults.withCredentials = true
  axios.defaults.crossDomain=true
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  return axios(options)
    .then(response => {
      const { statusText, status, data } = response

      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      let startIndex = result.data.indexOf("(");
      let endIndex = result.data.lastIndexOf(")");
      let json = result.data.substring(startIndex+1, endIndex)||'{}';

      return new Promise((resolve, reject) => {
        let data = JSON.parse(json);
        //console.log("----request----",data);
        if (undefined != data[0] && undefined != data[0].login && "out" == data[0].login) {
          if(location.href.indexOf("login")<0){
            sessionStorage.removeItem("UserStrom")
            sessionStorage.removeItem("userStorage")
            sessionStorage.removeItem("companyName")
            sessionStorage.removeItem("userNameOne")
            window.location = `${location.origin}/login`
          }
        } else {
          if (data instanceof Array) {
            data = {
              list: data,
            }
          }
          //获取后台传来的值
          resolve({success: true, message: statusText,statusCode: status, ...data})
        }
      })
    })
    .catch(error => {
      const { response, message ,data} = error

      // if (String(message) === CANCEL_REQUEST_MESSAGE) {
      //   return {
      //     success: false,
      //   }
      // }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
