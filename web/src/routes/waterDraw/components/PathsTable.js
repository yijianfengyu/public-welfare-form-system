import React, {Component} from 'react'
import {Row, Col, Form, Select, AutoComplete ,Table, Icon,Menu, Input,Button,Tabs} from 'antd'

const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Search = Input.Search;

function renderOption(item) {

  return (
    <Option key={item.id} text={item.pathName}>
      <span className="global-search-item-count">{item.pathName} </span>
    </Option>
  );
}

class PathsTable extends React.Component {

  constructor(props) {//绑定方法
    super(props);
    this.state={
      visible:false,
    }
  }
  rowSelection=(record, index, event)=>{

    this.props.draw.centerAndZoom(index);//移动定位到指定数据处

  }
  render() {
    console.log("===========render PathsTable==============");
    console.log(this.props);
    var table=(<Table rowKey="id"  scroll={{ y: 360 }}  onRowClick={this.rowSelection} dataSource={this.props.draw.myOverlay} pagination={false}>
      <Column width={100}
              title="标记名称"
              dataIndex="pathName"
              key="pathName"
      />
    </Table>);
    var defaultPathName=this.props.currentPath?this.props.currentPath.pathName : '';
    //this.props.form.resetFields({pathName:defaultPathName});
    console.log(defaultPathName);
    return (
      <div>
        <Tabs type="card">
          <TabPane tab="检索" key="1">
            <FormItem
              hasFeedback
            >
              <Search ref="pathName"
                placeholder="输入名称为搜索条件"

                onSearch={this.handleFilter}
              />
            </FormItem>
            {this.props.tabIndex==8?"":<FormItem>
              <Button onClick={this.activeOverlay}>提示</Button>
            </FormItem>}
            {table}
          </TabPane>
          <TabPane tab="样式" key="2">
            <p>编辑标记的显示样式</p>

          </TabPane>
          <TabPane tab="数据" key="3">
            <p>编辑数据</p>
            <Form>
            <FormItem>
             <input ref="pathName" style={{padding: "6px 7px",height: "32px",border: "1px solid #d9d9d9",borderRadius: "4px"}} type="text" value={defaultPathName} onChange={this.handleChange} />

            </FormItem>
              <Button onClick={this.saveModifyPath}>保存</Button>
            </Form>
          </TabPane>
        </Tabs>

      </div>
    )
  }

  handleChange=(event)=> {
    console.log("-----------------------"+event.target.value);
    var {currentPath}=this.props;
    currentPath.pathName=event.target.value;
    this.props.dispatch({
      type: "waterDraw/querySuccess",
      payload: {
        currentPath:currentPath,
      }
    })
  }
  saveModifyPath =()=>{
    var value=this.refs.pathName.value;
    var newOverlay = {
      guid: this.props.currentPath.guid,
      pathName:value
    };
    var {currentPath}=this.props;
    currentPath.pathName=value;
    this.props.dispatch({
      type: "waterDraw/saveOverlayPath",
      payload: {
        ...newOverlay,
        currentPath:currentPath,
      }
    })
    this.props.updatePathName(this.props.currentPath.guid,value);

    //找到对应的label修改它

  }

  handleMenuClick = (e) => {
    if (e.key === '3') {
      this.setState({ visible: false });
    }
  }
  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  handleFilter = (vale) => {

    this.props.dispatch({
      type: "waterDraw/filterQueryPath",
      payload: {
        tabIndex:this.props.tabIndex,
        pathType:this.props.pathType,
        pathName:vale,
        tabChanged:true,
      }
    })
  }

  onSelect = (value)=> {
    console.log('onSelect', value);

  }

  activeOverlay= ()=> {
    this.props.draw.activeOverlay();
  }

  }

export default Form.create()(PathsTable)
