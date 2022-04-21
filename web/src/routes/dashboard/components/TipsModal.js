import { Steps, Button, message,Modal ,Form,} from 'antd';
import CompanyForm from '../components/CompanyForm'
import BankForm from '../components/BankForm'
const Step = Steps.Step;
const TipsModal=({
    dispatch,current, nextVisible,btnVisible,companyOptions

})=>{

  let company=[]
  for(let i in companyOptions){
    company .push(<Option key={companyOptions[i]}>{companyOptions[i]}</Option>)
  }
  const companyProps={
    dispatch, btnVisible,nextVisible,current
  }
  const bankProps={
    company,dispatch,btnVisible,current,nextVisible
  }
  const addCompanyInfo= <CompanyForm {...companyProps}/>
  const addBankInfo=<BankForm {...bankProps}/>
  const steps = [
    {
        title: '设置企业信息',
        content: '请填写以下企业相关信息：（注意：其它企业信息可使用Boss角色，前往Setting页面进行修改）',
        container:addCompanyInfo
      }, {
        title: '设置银行信息',
        content:  '请填写以下银行相关信息：（注意：其它银行信息可使用Boss角色，前往Setting页面进行修改）',
        container:addBankInfo
      },
    ];

    return ( <Modal
        visible
        width="1050px"
        footer={null}
        title="系统初始化设置">
        <Steps current ={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content" style={{marginTop: "16px",
                                        border: "1px dashed #e9e9e9",
                                        borderRadius: "6px",
                                        height:"250px",
                                        minHeight: "200px",
                                        padding: "10px",
                                        overflow:"scroll"}}>
          <div style={{padding:"10px"}}>{steps[current].content}</div>
          {steps[current].container}
        </div>
      </Modal>)
}
export default  Form.create()(TipsModal)
