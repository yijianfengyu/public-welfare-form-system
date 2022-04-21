package com.projectManage.service;

import com.auth.entity.User;
import com.projectManage.dao.PMDao;
import com.projectManage.dao.PMResourceDao;
import com.projectManage.dao.ResourceDao;
import com.projectManage.entity.Daily;
import com.projectManage.entity.Project;
import com.projectManage.entity.ProjectReport;
import com.projectManage.entity.ProjectResource;
import com.utils.Handle;
import com.utils.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Service
public class ResourceService {

    @Autowired
    ResourceDao dao;

    public Page queryHistoryResources(ProjectResource pr) {
        return dao.queryHistoryResources(pr);
    }

    public Handle uploadResource(ProjectResource resource, User user) {
        return dao.uploadResource(resource,user);
    }
    public void deleteResource(ProjectResource resource) {
         dao.deleteResource(resource);
    }

    public Handle updateResource(ProjectResource resource, User user) {
        return dao.addProjectResourceModel(resource,user);
    }
}
