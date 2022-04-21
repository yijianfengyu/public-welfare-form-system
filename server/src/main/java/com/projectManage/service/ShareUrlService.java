package com.projectManage.service;

import com.projectManage.dao.ShareUrlDao;
import com.projectManage.entity.ShareUrl;
import com.utils.Handle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/10/29.
 */
@Service
public class ShareUrlService {
    @Autowired
    ShareUrlDao shareUrlDao;
    @Autowired
    TempTableService service;

    public Handle createShareUrl(ShareUrl su) {
        return shareUrlDao.createShareUrl(su);
    }
    public ShareUrl selectShareUrl(String id){
        return shareUrlDao.selectShareUrl(id);
    }
    public int updateShareUrl(ShareUrl su) {
        return  shareUrlDao.updateShareUrl(su);
    }

    public List<Map<String, Object>> getDropdownOptions(String columnName, String tableName) {
        return service.getDropdownOptions(columnName,tableName);
    }
}
