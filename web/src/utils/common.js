import {Modal} from 'antd'
import {request, config} from 'utils'

const {api} = config
const {webSocketUrl, userLogin} = api


//表格选中点击后改变表格当前行的颜色事件 tableIndex为table组件的下标,rowIndex是当前选中的行下标
export function changeTableColorByClick2(tableIndex, rowIndex) {
  //设置选中某行的样式
  let trs = document.getElementsByClassName("ant-table-tbody").item(tableIndex).childNodes

  for (let i in trs) {
    if (i == rowIndex && i != 0) {
      document.getElementsByClassName("ant-table-tbody").item(tableIndex).childNodes.item(i).style.background = " rgba(16,142,233,0.32)"
    } else {
      document.getElementsByClassName("ant-table-tbody").item(tableIndex).childNodes.item(i).style.background = "white"
    }
  }
  if (rowIndex == 0) {
    document.getElementsByClassName("ant-table-tbody").item(tableIndex).childNodes.item(0).style.background = " rgba(16,142,233,0.32)"
  }
}

export function changeTableColorByClick(tableName, rowIndex) {
  let classNames=document.getElementsByClassName(tableName)
  if(classNames.length == 1){
    let tables = document.getElementsByClassName(tableName).item(0).getElementsByClassName("ant-table-tbody")
    for (let t in tables) {
      //设置选中某行的样式
      let trs = tables.item(t).childNodes
      for (let i in trs) {
        if (i == rowIndex && i != 0) {
          tables.item(t).childNodes.item(i).style.background = " rgba(16,142,233,0.32)"
        } else {
          tables.item(t).childNodes.item(i).style.background = "white"
        }
      }
      if (rowIndex == 0) {
        tables.item(t).childNodes.item(0).style.background = " rgba(16,142,233,0.32)"
      }
    }
  }else{
    // 一个组件复用时
    for(let t2 in classNames){
      let tables = classNames.item(t2).getElementsByClassName("ant-table-tbody")
      for (let t in tables) {
        //设置选中某行的样式
        let trs = tables.item(t).childNodes
        for (let i in trs) {
          if (i == rowIndex && i != 0) {
            tables.item(t).childNodes.item(i).style.background = " rgba(16,142,233,0.32)"
          } else {
            tables.item(t).childNodes.item(i).style.background = "white"
          }
        }
        if (rowIndex == 0) {
          tables.item(t).childNodes.item(0).style.background = " rgba(16,142,233,0.32)"
        }
      }
    }
  }


}

//Modal提示框
export function warning(mess) {
  Modal.warning({
    title: '温馨提示',
    content: mess,
  });
}

export function warningByPermission(mess) {
  Modal.warning({
    title: '温馨提示',
    content: mess,
    okText:"去申请",
    onOk () {
      window.location="https://saas.tenonegroup.com"
    }
  });
}

//WebSocket消息专用提示框
export function warningSocket(message) {
  Modal.warning({
    title: "From: " + message.sender,
    content: message.content,
    onOk() {
      updateUnreadMessage(message)
    },
  });
}

//WebSocket扣库存专用提示框
export function warningStock(message) {
  Modal.warning({
    title: "From: " + message.sender,
    content: message.content,
    onOk() {
      let date = new Date();
      let receiveDate = (date.getYear() + 1900) + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
      message.receiveDate = receiveDate
    },
  });
}
//登录被迫下线
export function warningLogin(message) {

  let u = JSON.parse(sessionStorage.getItem("userStorage"))

  window.open("about:localhost:7272", "_self").close()
  sessionStorage.removeItem("userStorage")
  // window.location = `${location.origin}/login?from=`
}

function updateUnreadMessage(params) {
  return request({
    url: userLogin + "/updateUnreadMessage",
    method: 'post',
    data: params,
  })
}

//websocket连接
export function websocketService(userName, userId) {
  let websocket = new WebSocket(webSocketUrl+ "/webSocket?code_key="+sessionStorage.getItem("code")+"&userName=" + userName + "&userId=" + userId);
  // let websocket = new WebSocket("ws:" + url + "/WebSocketUtil?userName=" + userName + "&userId=" + userId);
  // let websocket = new WebSocket("wss:" + url + "/webSocket?userName=" + userName + "&userId=" + userId);

  //连接发生错误的回调方法
  websocket.onerror = function (e) {
    console.log("WebSocket连接发生错误");
  };
  //连接成功建立的回调方法
  websocket.onopen = function () {
    console.log("WebSocket连接成功");
  }

  //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = function () {
    websocket.close();
  }

  //接收消息监听事件
  websocket.onmessage = function (event) {
    let user = JSON.parse(sessionStorage.getItem("userStorage"))
    let str = event.data.split("#")

    let message = []
    if (str.length > 4) {
      message.content = str[0]
      message.id = str[1]
      message.receiver = str[2]
      message.sender = str[3]
      message.senderDate = str[4]
      message.isErp = str[5]
      message.uuid = str[6]
      message.type = str[7]
      if (str[7] == 'system') {
        warningSocket(message)
      } else {
        //处理anyvape网站发过来的消息
      }
    } else if (str.length == 2) {
      message.content = str[0]
      message.sender = str[1]
      warningLogin(message)
    } else {
      message.content = str[0]
      message.id = str[1]
      message.receiver = str[2]
      message.sender = str[3]
      warningStock(message)
    }
  }
  return websocket
}

//设置发送消息的对象
export function setMessage(sender, receiver, content, isErp,type) {
  let obj = new Object();
  obj.sender = sender;
  obj.content = content;
  obj.receiver = receiver;
  obj.isErp = isErp;
  obj.type = type
  return obj;
}

export function getStyle(dom, attr) {
  return dom.currentStyle ? dom.currentStyle[attr] : getComputedStyle(dom, false)[attr];
}

//获取当前时间
export function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

//解析并获取连接中某参数
export function getQueryVariable(url,variable)
{
  //var query = window.location.search.substring(1);
  url=url.substring(url.indexOf('?')+1,url.length);
  var vars = url.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}






