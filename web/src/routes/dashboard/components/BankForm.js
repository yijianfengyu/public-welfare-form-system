import React from 'react'
import { Button ,Form,Input,Row,Col,Select} from 'antd';
const FormItem = Form.Item

class BankForm extends React.Component {

  constructor(props){
    super(props);
    this.submitBankInfo=this.submitBankInfo.bind(this);
    this.finish=this.finish.bind(this);
  }

   submitBankInfo(e){
        e.preventDefault()
        this.props.form.validateFields((errors,values) => {

          if (errors) {
            return
          }
         this.props.dispatch({type: "dashboard/addBank",payload:{
           values
          }})
        })

}

  finish (){
    this.props.dispatch({type: "dashboard/querySuccess",payload:{
      tipsModalVisible:false
    }})
  }
  render (){
    const { getFieldDecorator } = this.props.form;
    return (<div>
      <Row>
        <Col span={8}>
          <FormItem label="BankName"   labelCol={{span: "6"}}>
            {getFieldDecorator('name', {
              rules: [{required: true,},],
            })(<Input size="default" style={{width:"150px"}}/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="NameAbbreviation"   labelCol={{span: "6"}}>
            {getFieldDecorator('abbreviation', {
              rules: [{required: true,},],
            })(<Input size="default" style={{width:"150px"}}/>)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="BankCode"   labelCol={{span: "6"}}>
            {getFieldDecorator('code', {
              rules: [{required: true,},],
            })(<Input size="default" style={{width:"150px"}}/>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <FormItem label="所属公司"   labelCol={{span: "6"}}>
            {getFieldDecorator('ownerCode', {
              rules: [{required: true,},],
            })( <Select size="default" style={{width: "150px"}}>
              {this.props.company}
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      {this.props.btnVisible && <Button type="primary"  onClick={this.submitBankInfo} style={{left:"45%"}}>保存</Button>}
      {this.props.nextVisible && <Button type="primary"  onClick={this.finish} style={{left:"45%"}}>完成</Button>}
    </div>)
  }

}

export default Form.create()(BankForm)
