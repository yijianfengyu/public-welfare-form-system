import React from 'react'
import {FilterItem} from 'components'
import {Row,Col,Button,Form,Radio,Icon } from 'antd'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import styles from "../../utils/commonStyle.less"
const Filter = ({
  dispatch,
  materialType,
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    },
  }) => {

  //选择类型
  const onChange = (e) => {
    onFilterChange(e.target.value)
  }

  //添加图文
  const addButton = () => {
    let materialInit = {
      title:"",
      thumb_media_id:"",
      author:"",
      digest:"",
      show_cover_pic:0,
      content:"<p></p>",
      content_source_url:"",
      index:0
    }
    dispatch({type: "weChat/querySuccess",payload:{
      addMaterialModalVisible:true,
      materialRecord:{content:{news_item:[materialInit]}},
      materialRecordItem:materialInit,
      editorState:null,
      materialSaveType:"insert"
    }})
  }

  return (
    <div className={styles.filterDiv} >
      <Row gutter={24}  style={{maxWidth:'1080px'}}>
        <Col span={8}>
          <RadioGroup onChange={onChange}  defaultValue={materialType}>
            <RadioButton value="news">图文</RadioButton>
            <RadioButton value="image">图片</RadioButton>
            <RadioButton value="voice">语音</RadioButton>
            <RadioButton value="video">视频</RadioButton>
          </RadioGroup>
        </Col>
        <Col span={8}>
          <Button size="default" type="primary" className="margin-right margin-bottom" onClick={addButton}><Icon type="plus" />新增图文素材</Button>
        </Col>
      </Row>
    </div>
  )
}

export default Form.create()(Filter)
