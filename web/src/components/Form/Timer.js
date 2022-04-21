import React from 'react'

class Timer extends React.Component {
  tick = () => {
    const dispatch=this.props.dispatch
    const user=this.props.user
    const userRecord=this.props.userRecord
    const chooseStatus=this.props.chooseStatus

    //查询待办事项

    dispatch({
      type: "app/querysBacklogCount", payload: {
        user:user.userName,
      }
    })


    dispatch({
      type: "app/getUnreadSystemMessage", payload: {
        userName:user.userName,
      }
    })

    if("" != userRecord && userRecord !=null){
      //此时正在聊天中
      // 获取与当前业务员的未读和目前已读聊天消息
      dispatch({
        type: "app/getAnyvapeMessageRechord", payload: {
          sender: userRecord.userName,
          receiver:user.userName,
          isErp:chooseStatus?0:1
        }
      })
      // 修改未读消息的状态
      dispatch({
        type: "app/updateAnyvapeMessage", payload: {
          sender: userRecord.userName,
          receiver:user.userName,
          isErp:chooseStatus?0:1,
        }
      })
    }
      //获取未读消息记录(只有数量没有具体信息)
      dispatch({
        type:"app/chat",payload:{
          userName:user.userName
        }
      })
      //查询同事消息列表
      dispatch({
        type: "app/queryAllStaff2", payload: {
          receiver: user.userName,
        }
      })
      //查询客户消息列表
      dispatch({
        type: "app/getAnyvapeMessage", payload: {
          receiver: user.userName,
        }
      })

  }
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
      return <span></span>
  }
}
export default Timer;
