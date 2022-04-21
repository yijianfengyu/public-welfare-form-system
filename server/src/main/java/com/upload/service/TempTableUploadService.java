package com.upload.service;

import com.upload.dao.TempTableUploadDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by dragon_eight on 2018/12/4.
 */

@Service
public class TempTableUploadService {
    @Autowired
    TempTableUploadDao dao;

    public String downFromDataExcel(String columns, String define) throws Exception {
        return dao.downFromDataExcel(columns,define);
    }

    public String onTempTableExcelModel(String columns) throws Exception {
        return dao.onTempTableExcelModel(columns);
    }

}
