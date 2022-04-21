import React from 'react'
import { Button ,Form,Input,Row,Col} from 'antd';
const FormItem = Form.Item

  class CompanyForm extends React.Component {

    constructor(props){
      super(props);
      this.submitCompanyInfo=this.submitCompanyInfo.bind(this);
      this.next=this.next.bind(this);
    }

     submitCompanyInfo(e){
        e.preventDefault()
       this.props.form.validateFields((errors,values) => {

          if (errors) {
            return
          }

          this.props.dispatch({type: "dashboard/addCompany",payload:{
            values
          }})
        })
  }

  next(){
    this.props.dispatch({type: "dashboard/querySuccess",payload:{
      current:this.props.current+1,
      btnVisible:true,
      nextVisible:false,
    }})
  }

  render (){
    const { getFieldDecorator } = this.props.form;
    return (<div>
        <Row>
          <Col span={8}>
            <FormItem label="描述"   labelCol={{span: "6"}}>
              {getFieldDecorator('sub', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Name-En"   labelCol={{span: "6"}}>
              {getFieldDecorator('nameen', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Name-Ch"   labelCol={{span: "6"}}>
              {getFieldDecorator('namech', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="公司缩写"   labelCol={{span: "6"}}>
              {getFieldDecorator('code', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Contactor"   labelCol={{span: "6"}}>
              {getFieldDecorator('contactor', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Website"   labelCol={{span: "6"}}>
              {getFieldDecorator('website', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="Tel"   labelCol={{span: "6"}}>
              {getFieldDecorator('tel', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Fax"   labelCol={{span: "6"}}>
              {getFieldDecorator('fax', {
                rules: [{required: true,},],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Email"   labelCol={{span: "6"}}>
              {getFieldDecorator('email', {
                rules: [{
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: "The input is not valid E-mail!"
                },],
              })(<Input style={{width:"150px"}} size="default"/>)}
            </FormItem>
          </Col>
        </Row>
      {this.props.btnVisible && <Button type="primary"  onClick={this.submitCompanyInfo} style={{left:"45%"}}>保存</Button>}
      {this.props.nextVisible && <Button type="primary"  onClick={this.next} style={{left:"45%"}}>下一步</Button>}
      </div>)
  }

}

export default Form.create()(CompanyForm)
