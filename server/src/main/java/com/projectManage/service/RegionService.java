package com.projectManage.service;

import com.auth.entity.User;
import com.projectManage.dao.PMDao;
import com.projectManage.dao.PMResourceDao;
import com.projectManage.dao.RegionDao;
import com.projectManage.entity.*;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class RegionService {

    @Autowired
    RegionDao dao;

    public Page queryRegion(Region e) {
        return dao.queryRegion(e);
    }

    public int updateRegion(Region e) throws SQLException {
        return dao.updateRegion(e);
    }

    public int deleteRegion(Region e) {
        return dao.deleteRegion(e);
    }

    public boolean exitsId(String id) {
        return dao.exitsId(id);
    }

    public RegionDao getDao() {
        return dao;
    }

    public void setDao(RegionDao dao) {
        this.dao = dao;
    }

    public List<Map<String, Object>> getAll(){
        return dao.getAll();
    }
    public String text_value(String response_id){
        return dao.text_value(response_id);
    }
    public int num(String lng,String lat,String regionId){
        return dao.num(lng,lat,regionId);
    }
}
