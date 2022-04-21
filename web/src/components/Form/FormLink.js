import React from 'react';
import {render} from 'react-dom';
import PropTypes from './propTypes'

class FormLink extends React.Component {
  //注意:有属性才会自动从定义中取出值
  static propTypes = {
    value      : PropTypes.value,
    id         : PropTypes.id,
    name       : PropTypes.htmlFor,
    className  : PropTypes.typeClass,
    placeholder: PropTypes.string,
    defaultLink: PropTypes.string,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  };
  static defaultProps = {
    type: "FormLink"
  };

  render() {
    return <a target="_blank" id={this.props.id} alt={this.props.placeholder} href={this.props.defaultLink}>{this.props.placeholder}</a>
  }
}
export default FormLink;
