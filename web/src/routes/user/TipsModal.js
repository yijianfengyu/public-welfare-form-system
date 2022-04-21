import { Steps, Button, message,Modal ,Icon} from 'antd';
import Btn from '../../components/Form/Btn'
const Step = Steps.Step;

const TipsModal=({
    dispatch,current,currentChildSteps

})=>{
  const addCatalogue=[
    {
      title:'创建用户',
      description:<Btn btnVisible="true" btnTitle="Create"  content="点击用户信息表格右上方的 "/>
    },
  ]
  const select=[
    {
      title:'修改用户信息',
      description:<Btn iconVisible="true" type="toihk-detail"  content="点击用户信息表格中最右侧的Operation列下的 "/>
    },
  ]
  const steps = [
    {
        title: '添加用户',
        content: '添加用户，请按照以下流程操作：',
        childSteps:addCatalogue,
      },  {
      title: '修改用户信息',
      content: '修改用户信息，请按照以下流程操作：',
      childSteps:select,
    },
    ];

   function handleCancel(){
    dispatch({type: "user/querySuccess",payload:{
        tipsModalVisible:false
      }})
   }

   function next(){
    dispatch({type: "user/querySuccess",payload:{
      current:current+1,
    }})
  }

  function prev(){
    dispatch({type: "user/querySuccess",payload:{
      current:current-1
    }})
  }

  function nextChildSteps(){
    dispatch({type: "user/querySuccess",payload:{
      currentChildSteps:currentChildSteps+1,
    }})
  }

  function prevChildSteps(){
    dispatch({type: "user/querySuccess",payload:{
      currentChildSteps:currentChildSteps-1
    }})
  }

    return ( <Modal
        visible
        onCancel={handleCancel}
        width="1050px"
        footer={null}
        title="Employee模块操作指导">
        <Steps current ={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content" style={{marginTop: "16px",
                                        border: "1px dashed #e9e9e9",
                                        borderRadius: "6px",
                                        height:"310px",
                                        minHeight: "200px",
                                        padding: "10px"}}>
         {steps[current].content}
         <Steps direction="vertical" style={{marginTop: "10px"}} size="small" current ={currentChildSteps}>
              {steps[current].childSteps.map(item => <Step key={item.title} title={item.title} description={item.description}/>)}
         </Steps>
          <div className="steps-action" >
            {
              currentChildSteps < steps[current].childSteps.length - 1
              &&
              <Button type="primary" onClick={nextChildSteps}>NextChildSteps</Button>
            }
            {
              currentChildSteps === steps[current].childSteps.length - 1
              &&
              <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
            }
            {
              currentChildSteps > 0
              &&
              <Button style={{ marginLeft: 8 }} onClick={prevChildSteps}>
                PreviousChildSteps
              </Button>
            }
          </div>
        </div>
         <div className="steps-action" style={{marginTop: "24px"}}>
          {
            current < steps.length - 1
            &&
            <Button type="primary" onClick={next}>Next</Button>
          }
          {
            current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
          }
          {
            current > 0
            &&
            <Button style={{ marginLeft: 8 }} onClick={prev}>
              Previous
            </Button>
          }
        </div>
      </Modal>)
}

export default TipsModal
