import React from 'react'
import {Icon, Tooltip, Popconfirm} from 'antd'
import {Link} from 'dva/router'
import styles2 from '../../utils/commonStyle.less'
import {message} from "antd/lib/index";
import {CopyToClipboard} from 'react-copy-to-clipboard'
//addVpoItemIcon 添加vpo item的图标 ，auditIcon 审核图标，productReceivedIcon 录入到货图标，deleteIcon 删除图标
//cancleIcon 取消PI的图标 ，rejectIcon 驳回PO的图标,payIcon 工资付款的图标
const DropOption = ({
  detailIcon, detailClick, editIcon, onClick, editDisabled,editIconOne,editIconOneTitle, auditIcon,onClickOne,editDisabledOne, auditClick, addItemClick,addItemTitle, addItemIcon, productReceivedIcon, addProductReceived, deleteIcon, deleteClick, buttonStyle,
  cancelIcon, cancelClick, rejectIcon, rejectClick, addDisabled, auditDisabled, produceReceivedDisabled, deleteDisabled, cancelDisabled, rejectDisabled,
  payIcon, payDisabled, payClick, deliverIcon, deliverDisabled, deliverClick, gpIcon, gpDisabled, gpClick, handleIcon, handleDisabled, handleClick,circleIcon,circleDisabled,circleClick,payTitle,gpTitle,
  solutionIcon,solutionClick,solutionDisabled,transferIcon,transferDisabled,transferClick,addCashIcon,addCashDisabled,addCashClick,addtovpomanagerIcon,addtovpomanagerDisabled,addtovpomanagerClick,
  manufactureIcon,manufactureDisabled,manufactureClick,importDisabled,importIcon,importClick,uploadDisabled,uploadIcon,uploadClick,queryIcon,queryClick,queryDisabled,copyIcon,copyContent,viewIcon,viewLink,viewTaget
}) => {
  return <div className={styles2.textEllipsis} >
    {!editIcon &&
    <Tooltip placement="top" title="修改">
      <Link onClick={onClick} disabled={editDisabled} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
        <Icon type="toihk-edit"></Icon></Link>
    </Tooltip>
    }
    {editIconOne &&
    <Tooltip placement="top" title={editIconOneTitle?editIconOneTitle:'填写数据'}>
      <Link onClick={onClickOne} disabled={editDisabledOne} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
        <Icon type="toihk-edit"></Icon></Link>
    </Tooltip>
    }
    {uploadIcon &&
    <Tooltip placement="top" title="上传资源">
      <Link onClick={uploadClick} disabled={uploadDisabled} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
        <Icon type="download"></Icon></Link>
    </Tooltip>
    }
    {solutionIcon &&
    <Tooltip placement="top" title="read">
      <Link onClick={solutionClick} disabled={solutionDisabled} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
        <Icon type="solution"></Icon></Link>
    </Tooltip>
    }
    {circleIcon && <Tooltip placement="top" title="提交任务">
      <Popconfirm placement="left" title="你确定完成这项任务吗?" onConfirm={circleClick} okText="确定"
                  cancelText="取消">
        <Link style={{marginRight: "5px"}} disabled={circleDisabled}><Icon type="check-circle-o"/></Link>
      </Popconfirm>
    </Tooltip>}
    {addItemIcon &&
    <Link onClick={addItemClick} disabled={addDisabled} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
      <Tooltip placement="top" title={addItemTitle?addItemTitle:"添加"}>
        <Icon type="toihk-add"></Icon></Tooltip></Link>}
    {handleIcon && <Tooltip placement="top" title="receive handle">
      <Link style={{marginRight: "5px"}} disabled={handleDisabled} onClick={handleClick}><Icon type="toihk-handle"/></Link>
    </Tooltip>}
    {auditIcon && <Tooltip placement="top" title="审核">
      <Popconfirm placement="left" title="你确定要提交审核吗?" onConfirm={auditClick} okText="确定"
                  cancelText="取消">
        <Link style={{marginRight: "5px"}} disabled={auditDisabled}><Icon type="toihk-audit"/></Link>
      </Popconfirm>
    </Tooltip>}
    {productReceivedIcon && <Link onClick={addProductReceived} disabled={produceReceivedDisabled}
                                  style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
      <Tooltip placement="top" title="录入到货">
        <Icon type="toihk-received"></Icon></Tooltip></Link>}
    {deleteIcon && <Tooltip placement="top" title="删除">
      <Popconfirm placement="left" title="你确定删除这个?" onConfirm={deleteClick} okText="确定"
                  cancelText="取消">
        <Link style={{marginRight: "5px"}} disabled={deleteDisabled}><Icon type="toihk-delete"/></Link>
      </Popconfirm>
    </Tooltip>}
    {cancelIcon && <Tooltip placement="top" title="Cancel">
      <Popconfirm placement="left" title="你确定取消这个?" onConfirm={cancelClick} okText="确定"
                  cancelText="取消">
        <Link style={{marginRight: "5px"}} disabled={cancelDisabled}><Icon type="toihk-cancel"/></Link>
      </Popconfirm>
    </Tooltip>}
    {rejectIcon && <Tooltip placement="top" title="Reject">
      <Link style={{marginRight: "5px"}} disabled={rejectDisabled} onClick={rejectClick}><Icon
        type="toihk-reject"/></Link>
    </Tooltip>}
    {payIcon && <Tooltip placement="top" title="Can Pay">
      <Link style={{marginRight: "5px"}} disabled={payDisabled} onClick={payClick}><Icon type="toihk-pay"/></Link>
    </Tooltip>}
    {detailIcon && <Tooltip placement="top" title="detail">
      <Link style={{marginRight: "5px"}} onClick={detailClick}><Icon type="toihk-detail"/></Link>
    </Tooltip>}
    {deliverIcon && <Tooltip placement="top" title="can deliver">
      <Link style={{marginRight: "5px"}} disabled={deliverDisabled} onClick={deliverClick}><Icon type="toihk-deliver"/></Link>
    </Tooltip>}
    {gpIcon && <Tooltip placement="top" title="set GP">
      <Link style={{marginRight: "5px"}} disabled={gpDisabled} onClick={gpClick}><Icon type="toihk-gp"/></Link>
    </Tooltip>}
    {transferIcon && <Tooltip placement="top" title="修改客户所属">
      <Link style={{marginRight: "5px"}} disabled={transferDisabled} onClick={transferClick}><Icon type="toihk-transfer"/></Link>
    </Tooltip>}
    {addCashIcon && <Tooltip placement="top" title="生成Cash记录">
      <Link style={{marginRight: "5px"}} disabled={addCashDisabled} onClick={addCashClick}><Icon type="toihk-addCash"/></Link>
    </Tooltip>}
    {manufactureIcon && <Tooltip placement="top" title="加工生成库存">
      <Link style={{marginRight: "5px"}} disabled={manufactureDisabled} onClick={manufactureClick}><Icon type="toihk-manufacture"/></Link>
    </Tooltip>}
    {importIcon &&
    <Tooltip placement="top" title="下载资源">
      <Link onClick={importClick} disabled={importDisabled} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
        <Icon type="import"></Icon></Link>
    </Tooltip>}
    {queryIcon &&
    <Tooltip placement="top" title="查看数据">
      <Link onClick={queryClick} disabled={queryDisabled} style={{border: 'none', ...buttonStyle, marginRight: "5px"}}>
        <Icon type="search"></Icon></Link>
    </Tooltip>}
    {copyIcon &&
    <CopyToClipboard text={copyContent}>
      <Icon type="copy" onClick={() => message.success("链接复制成功！")} title="复制" style={{color:"#71A3CD"}}/>
    </CopyToClipboard>}
    {viewIcon &&
    <Tooltip placement="top" title="查看数据">
      <Link  target={viewTaget} to={viewLink} style={{border: 'none', marginLeft: "5px"}}>
        <Icon type="search"></Icon></Link>
    </Tooltip>}
  </div>
}

export default DropOption
