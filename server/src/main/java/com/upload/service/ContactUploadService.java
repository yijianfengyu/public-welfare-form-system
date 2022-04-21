package com.upload.service;

import com.upload.dao.ContactUploadDao;
import com.upload.entity.ContactUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by dragon_eight on 2018/12/4.
 */
@Service
public class ContactUploadService {
    @Autowired
    ContactUploadDao dao;

    public int insertContactUpload(ContactUpload contact, String companyCode){
        return dao.insertContactUpload(contact,companyCode);
    }

    public String onContactExcelModel() throws Exception {
        return dao.onContactExcelModel();
    }
}
