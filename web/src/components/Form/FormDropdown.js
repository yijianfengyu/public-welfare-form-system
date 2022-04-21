import React from 'react'
import { render } from 'react-dom'
import { Select } from 'antd'
import PropTypes from './propTypes'
import { request, config } from 'utils'

const { api } = config
const { shareUrl } = api
const Option = Select.Option
class FormDropdown extends React.Component {
  // 注意:有属性才会自动从定义中取出值
  static propTypes = {
    value: PropTypes.value,
    id: PropTypes.id,
    name: PropTypes.htmlFor,
    className: PropTypes.typeClass,
    placeholder: PropTypes.string,
    dropdownValue: PropTypes.string,
    tName: PropTypes.string,
    onChange: PropTypes.valueEvent,
    dataType   : PropTypes.string,
    fieldAttrs : PropTypes.fieldAttrs,
    p_uuid: PropTypes.string,
    p_option_uuid: PropTypes.string,
    subFormShow : PropTypes.object,
  };
  static defaultProps = {
    type: 'FormDropdown',
  };
  constructor (props) {
    super(props)
    let state = this.state || (this.state = { optionsList: [] })
    console.log('--constructor--', this.props)
    state.value = props.value
  }

  componentDidMount () {
    let _this = this
    console.log('--componentDidMount--', this.props)
    let tName = this.props.tName
    let columnName = this.props.dropdownValue
    // let json=value?((typeof value)=='string'?JSON.parse(value):value):'';

    request({
      url: `${shareUrl}/getDropdownOptions`,
      method: 'post',
      data: { tName, columnName },
    }).then((res) => {
      console.log('----options--', res.obj)
      let options = res.obj
      options.splice(0,0,{
        label: '',
        option: '',
        uuid: 99999999,
        val: null,
      })
      _this.setState({
        optionsList: options,
      })
    }).catch((error) => {
      console.log(error)
    })
  }
  handleChange = (index) => {
    console.log('--handleChange--', index)
    let item = this.state.optionsList[index]
    this.props.onChange({ id: item.value, label: item.label, tName: this.props.tName, columnName: this.props.dropdownValue })
  }
  render () {
    let defaultValue = this.props.value ? (typeof this.props.value) === 'string' ? `${JSON.parse(this.props.value).id}` : this.props.value.id : ''
    let defaultIndex = '0'
    console.log('==defaultValue==', defaultValue)
    const options = this.state.optionsList.map((item, index) => {
      if (item.value == parseInt(defaultValue)) {
        defaultIndex = `${index}`
      }
      return <Option key={`fdd_${index}`} value={`${index}`}>{item.label}</Option>
    })
    console.log('------', this.props)

    return <Select showSearch
      value={defaultIndex}
      style={{ width: '60%' }}
      optionFilterProp="children"
      filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
      onChange={this.handleChange}
    >
      {options}
    </Select>
  }
}
export default FormDropdown
