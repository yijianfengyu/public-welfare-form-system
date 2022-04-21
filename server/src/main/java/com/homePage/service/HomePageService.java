package com.homePage.service;


import com.homePage.dao.HomePageDao;
import com.homePage.entity.ClickCount;
//import com.setting.kv.Exchange;
import com.utils.Handle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class HomePageService {

    @Autowired
    HomePageDao dao;

//    public List queryCompanySumChart(String fromDate, String toDate, String month) {
//        return dao.queryCompanySumChart(fromDate,toDate,month);
//    }
//    public List<Exchange> queryRateChart(String dateString) {
//        return dao.queryRateChart(dateString);
//    }

//    public Handle saveClickCount(ClickCount cc) {
//        return dao.saveClickCount(cc);
//    }
//
//    public Handle saveFilterClickCount(ClickCount cc) {
//        return dao.saveFilterClickCount(cc);
//    }

}
