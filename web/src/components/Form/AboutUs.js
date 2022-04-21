import React from 'react';
import {render} from 'react-dom';
import { Input } from 'antd';
import PropTypes from './propTypes'

/**
 * 百分比数字类型，在显示时按百分比显示
 */
class Affirming extends React.Component {
  //注意:有属性才会自动从定义中取出值
  render() {
    return (
      <div>
        <p>1、平台为互联网人联合发起,纯公益性质,不涉及任何公司、个人品牌及宣传;</p>
        <p>2、平台为纯信息平台,不涉及任何钱、捐款、物资信息;</p>
        <p>3、医院方在对接物资时请擦亮眼睛监督质量,要求货到付款;</p>
        <p>4、任何打着平台幌子进行品牌宣传、收集物资、收集善款的人,欢迎举报!</p>
        <p>公司投诉电话： 刘 18974859157 13319550105</p>
        <p>官方举报电话：	12315 </p>
        <p>技术支持：微信号18974859157 13319550105</p>
        <p>其他事宜：微信号tudoumameidai 19972080193</p>
        <p>感谢大家支持! </p>
        <p>平台参与人员：joy ,goof ,美眉爱土豆 ,土豆妈 ,david ,leo 。</p>
      </div>
    );
  }
}
export default Affirming;
