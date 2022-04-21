package com.auth.service;

import com.auth.dao.UserDao;
import com.auth.entity.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by dragon_eight on 2018/9/3.
 */
@Service
public class UserService {
    @Autowired
    UserDao dao;

    public Handle registerUser(Organization organization){
        return dao.registerUser(organization);
    }

    public List getAndVertifyUser(User user){
        return dao.getAndVertifyStaff(user);
    }


    public boolean vertifyUserRegister(String tel){
        return dao.vertifyUserRegister(tel);
    }


    public String insertCodeToSms(String tel){
        return dao.insertCodeToSms(tel);
    }

    public Page getAllUser(User user){
        return dao.getAllUser(user);
    }

    public Handle insertUser(User user) {
        return dao.insertUser(user);
    }

    public Handle updateUser(User user,String oldEmail,String oldTel) {
        return dao.updateUser(user,oldEmail,oldTel);
    }

    public Handle deleteUser(User user){
        return dao.deleteUser(user);
    }

    public List<User> queryAllActiveUser(String companyCode){
        return dao.queryAllActiveUser(companyCode);
    }

    public int queryCountUser(String companyCode){
        return dao.queryCountUser(companyCode);
    }

    public int queryCountContact(String companyCode){
        return dao.queryCountContact(companyCode);
    }

    public Page getAllContact(Contact contact, String companyCode){
        return dao.getAllContact(contact,companyCode);
    }

    public Handle insertContact(Contact contact){
        return dao.insertContact(contact);
    }

    public Handle updateContact(Contact contact){
        return dao.updateContact(contact);
    }

    public Handle deleteContact(Contact contact){
        return dao.deleteContact(contact);
    }

    public List queryOrganization(String companyCode){
        return dao.queryOrganization(companyCode);
    }

    public Handle updateOrganization(Organization organization){
        return dao.updateOrganization(organization);
    }

    public List queryContactRepeatList(Contact contact,User user){
        return dao.queryContactRepeatList(contact,user);
    }

    public Page queryContactTempDataList(Contact contact,User user){
        return dao.queryContactTempDataList(contact,user);
    }

    public String queryConcatMapData(String companyCode) throws JsonProcessingException {
        List<Map<String,Object>> result = dao.queryConcatMapData(companyCode);
        List<CityGeo> geoList = translate(result);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(geoList);

    }
    public List<CityGeo> queryConcatMap(String companyCode) throws JsonProcessingException {
        List<Map<String,Object>> result = dao.queryConcatMapData(companyCode);
        return translate(result);

    }
    private List<CityGeo> translate(List<Map<String,Object>> result) {
        List<CityGeo> arr=new ArrayList<CityGeo>();
        for(int i=0;i<result.size();i++){
            Map<String, Object> item = result.get(i);
            CityGeo geo=new CityGeo();
            geo.setName(item.get("name").toString());
            geo.setGeo(item.get("geo").toString());
            geo.setValue(Long.parseLong(item.get("value").toString()));
            arr.add(geo);
        }
        return arr;
    }

    public String downloadContactData(Contact contact,User user) throws Exception {
        return  dao.downloadContactData(contact,user);
    }
    public Page queryContactDefineDataList(Contact contact) {
        return dao.queryContactDefineDataList(contact);
    }


    public Page getPersonalCenter(User user) {
        return dao.getPersonalCenter(user);
    }

    public  User selectAccount(User u){
        return dao.selectAccount(u);
    }

    public List<Map<String, Object>> getRootMenu(User su) {
        return dao.getRootMenu(su);
    }

    public void insertMenu(Menu su) throws SQLException {
         dao.insertMenu(su);
    }
}
