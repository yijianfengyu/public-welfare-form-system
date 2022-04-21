import {Modal, Button, Form} from 'antd'

const IntroInfo = ({
                     dispatch,
                     report,
                   }) => {

  const handleCancel = () => {
    dispatch({
      type: 'report/querySuccess',
      payload: {
        IntroInfoVisible: false,
        text: '',
      }
    })
  }

  return (
    <div>
      <Modal
        title="简介详情"
        visible
        onCancel={handleCancel}
        width='600px'
        footer={[
          <Button key="back" size="large" onClick={handleCancel}>关闭</Button>,
        ]}
      >
     <span style={{fontSize: '16px'}}>
       {report.text}
     </span>
      </Modal>
    </div>
  )
}
export default Form.create()(IntroInfo);
