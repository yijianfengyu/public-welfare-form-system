package com.system.service;

import com.projectManage.entity.Daily;
import com.system.dao.SystemDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SystemService {
    @Autowired
    SystemDao dao;
    public List<Map<String,Object>>  getSelectOptions(Integer id) {
        return dao.getSelectOptions(id);
    }

    public List<Map<String, Object>> getRegionList(String address) {
        return dao.getRegionList(address);
    }
}
