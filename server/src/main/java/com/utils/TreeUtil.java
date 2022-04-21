package com.utils;

import com.projectManage.entity.Project;
import net.sf.json.JSONArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 将有父子关系的数据迭代为json数据
 * Created by Administrator on 2018/7/25.
 */
public class TreeUtil {

    /**
     * 数据集合转tree json
     * @param list
     * @return
     */
    public static String toTreeJson(List<Project> list){
        list.add(new Project("0","项目管理"));
        List<Project> tree = getTreeByNodes(list);
        JSONArray json = JSONArray.fromObject(tree);
        return json.get(0).toString();
    }

    public static List<Project> getTreeByNodes(List<Project> nodes){
        Map<Object,List<Project>> nodeMap = new HashMap<Object, List<Project>>();
        for(Project node : nodes){
            Object parentId = node.getParentId();
            List<Project> childrenNodes ;
            if(nodeMap.containsKey(parentId)){
                childrenNodes = nodeMap.get(parentId);
            }else{
                childrenNodes = new ArrayList<Project>();
                nodeMap.put(parentId, childrenNodes);
            }
            childrenNodes.add(node);
        }
        return getTreeNodeByNodeMap(nodeMap, null);
    }

    /**
     * 数据集合转tree json
     * @param list
     * @return
     */
    public static  List<Map<String,Object>> toTreeJsonForSelect(List<Project> list){
        list.add(new Project("0","项目管理"));
        List<Map<String,Object>> tree = getTreeByNodesForSelect(list);
        return (List)((Map)((List)tree.get(0).get("children")).get(0)).get("children");
    }
    public static List<Map<String,Object>> getTreeByNodesForSelect(List<Project> nodes){
        Map<Object,List<Map<String,Object>>> nodeMap = new HashMap<Object, List<Map<String,Object>>>();
        for(Project node : nodes){
            Object parentId = node.getParentId();
            Map<String,Object> newNode=new HashMap<String,Object>();
            newNode.put("value",node.getId());
            newNode.put("key",node.getId());
            newNode.put("label",node.getProjectName());
            newNode.put("parentId",node.getParentId());
            List<Map<String,Object>> childrenNodes ;
            if(nodeMap.containsKey(parentId)){
                childrenNodes = nodeMap.get(parentId);
            }else{
                childrenNodes = new ArrayList<Map<String,Object>>();
                nodeMap.put(parentId, childrenNodes);
            }

            childrenNodes.add(newNode);
        }
        return getTreeNodeByNodeMapForSelect(nodeMap, null);
    }

    /**
     * 数据递归
     * @param nodeMap
     * @param parentId
     * @return
     */
    private static List<Map<String,Object>> getTreeNodeByNodeMapForSelect(Map<Object,List<Map<String,Object>>> nodeMap, Object parentId){
        List<Map<String,Object>> childrens = nodeMap.get(parentId);
        if(childrens == null){
            return null;
        }
        for(Map<String,Object> node : childrens){
            node.put("children",getTreeNodeByNodeMapForSelect(nodeMap, node.get("key")));
        }
        return childrens;
    }

    /**
     * 数据递归
     * @param nodeMap
     * @param parentId
     * @return
     */
    private static List<Project> getTreeNodeByNodeMap(Map<Object,List<Project>> nodeMap, Object parentId){
        List<Project> childrens = nodeMap.get(parentId);
        if(childrens == null){
            return null;
        }
        for(Project node : childrens){
            node.setChildren(getTreeNodeByNodeMap(nodeMap, node.getId()));
        }
        return childrens;
    }

    public static List<Project> filterTreeExecutor(List<Project> allProjects, String key){
        List<Project> listProject = new ArrayList<Project>();
        Map<String, Project> allProjectMap = new HashMap<String, Project>();
        for (Project project : allProjects) {
            allProjectMap.put(project.getId(), project);
        }
        // 遍历allRrecords找出所有的nodeName和关键字keywords相关的数据
        if (allProjects != null && allProjects.size() > 0 && key !=null) {
            for (Project project : allProjects) {
                // 比较
                if (key.equals(project.getExecutor())) {
                    listProject.add(project);
                }
            }

        }
        // 查找过滤出来的节点和他们的父节点
        listProject = getSelfAndTheirParentRecord(listProject, new ArrayList<Project>(),new HashMap<String, Project>(), allProjectMap);
        // 将过滤出来的数据变成树tree结构
//        listProject = this.useListRecordToTree(listProject);
        return listProject;

    }

    private static List<Project> getSelfAndTheirParentRecord(List<Project> parentList, List<Project> resultList,
                                                             Map<String, Project> filterProjectMap,
                                                             Map<String, Project> allProjectMap) {
        // 当父节点为null或者节点数量为0时返回结果，退出递归
        if (parentList == null || parentList.size() == 0) {
            return resultList;
        }
        // 重新创建父节点集合
        List<Project> listParentRecord = new ArrayList<Project>();
        // 遍历已经过滤出来的节点
        for (Project project : parentList) {

            String id = project.getId();
            String parent_id = project.getParentId();

            // 如果已经过滤出来的节点不存在则添加到list中
            if (!filterProjectMap.containsKey(id)) {
                listParentRecord.add(project);// 添加到父节点中
                filterProjectMap.put(id, project);// 添加到已过滤的map中
                allProjectMap.remove(id);// 移除集合中相应的元素
                resultList.add(project);// 添加到结果集中
            }

            // 找出本节点的父节点并添加到listParentRecord父节点集合中，并移除集合中相应的元素
            if (!"".equals(parent_id) || parent_id != null) {
                Project parentRecord = allProjectMap.get(parent_id);
                if (parentRecord != null) {
                    listParentRecord.add(parentRecord);
                    allProjectMap.remove(parent_id);
                }
            }
        }
        // 递归调用
        getSelfAndTheirParentRecord(listParentRecord, resultList, filterProjectMap, allProjectMap);

        return resultList;
    }
}
