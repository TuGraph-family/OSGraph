package com.alipay.tumaker.biz.service.graphanalysis;

import com.alibaba.fastjson.JSONObject;
import com.alipay.sofa.runtime.api.annotation.SofaReference;
import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.common.facade.api.tuservice.TuQueryFacade;
import com.alipay.tumaker.common.facade.model.vo.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.facade.model.vo.analysis.view.Edge;
import com.alipay.tumaker.common.facade.model.vo.analysis.view.Node;
import com.alipay.tumaker.common.facade.model.vo.common.Enum.GraphLanguageTypeEnum;
import com.alipay.tumaker.common.util.MyCache;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.common.util.errorcode.TugraphDBErrorCodeEnum;
import com.alipay.tumaker.common.util.errorcode.TumakerErrorCodeEnum;
import com.alipay.tumaker.core.model.tumaker.graphproject.GraphProjectVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.*;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es.FullTextIndexNameEnum;
import com.alipay.tumaker.core.service.common.PlatformConfigManager;
import com.alipay.tumaker.core.service.graphanalysis.ElasticSearchClientManager;
import com.alipay.tumaker.core.service.graphanalysis.TuMakerAnalysisManager;
import com.alipay.tumaker.core.service.graphanalysis.TuMakerTemplateManager;
import com.alipay.tumaker.core.service.querytemplate.TuMakerQueryTemplateDataManager;
import com.alipay.tumaker.common.facade.model.request.TuQueryExecuteRequest;
import com.alipay.tumaker.common.facade.model.request.TuQueryTemplateExecuteRequest;
import com.alipay.tumaker.common.facade.model.ExecuteEngineEnum;
import com.alipay.tumaker.common.facade.model.vo.PluginResult;
import com.alipay.tumakertugraphdb.config.DbConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Created by XiangChen
 * @date 2024/3/15 10:42
 */
@SofaService
@Service
@Slf4j
public class TuMakerTemplateManagerImpl implements TuMakerTemplateManager {

    @SofaReference
    private TuMakerQueryTemplateDataManager tuMakerQueryTemplateDataManager;
    @SofaReference
    private TuMakerAnalysisManager tuMakerAnalysisManager;
    @SofaReference
    private ElasticSearchClientManager elasticSearchClientManager;

    @Autowired
    private TuQueryFacade tuQueryFacade;
    @SofaReference
    private PlatformConfigManager platformConfigManager;
    @Autowired
    private DbConfig dbConfig;
    private final static MyCache TEMPLATE_QUERY_CACHE = new MyCache();

    /**
     * 查询默认点语句
     */
    private static final String DEFAULT_TUGRAPH_DB_NODE_GQL = "MATCH (n:%s {id:%s}) RETURN n";
    /**
     * 开发者id
     */
    private static final String DEVELOPER_ID_PARAMETER_NAME = "developer_id";
    /**
     * 仓库id
     */
    private static final String REPO_ID_PARAMETER_NAME = "repo_id";

    /**
     * 模版查询缓存key
     */
    private static final String TEMPLATE_QUERY_CACHE_KEY = "TQC_%s_%s";
    /**
     * 设置缓存超时时间
     */
    private static final Long TEMPLATE_QUERY_CACHE_EXPIRE = 60*60*24L;


    @Override
    public Result<AggregatedResultVO> executeQueryTemplate(TuMakerExecuteTemplateRequest request) {
        Result<Object> result = request.check();
        if (result.whetherFailed()) {
            return Result.failed(result);
        }
        // 查询模版
        Result<QueryTemplateVO> templateResult = tuMakerQueryTemplateDataManager.queryTemplateById(request.getTemplateId());
        if (templateResult.whetherFailed()) {
            return Result.failed(templateResult);
        }
        QueryTemplateVO queryTemplateVO = templateResult.getData();

        // 根据图id查询图项目
        Result<GraphProjectVO> projectResult = queryTuMakerProjectById(request.getGraphId());
        if (projectResult.whetherFailed()) {
            return Result.failed(projectResult);
        }
        GraphProjectVO graphProjectVO = projectResult.getData();
        String nodeId = findNodeId(queryTemplateVO, request.getTemplateParameterList());

        // 查询缓存
        String cacheKey = String.format(TEMPLATE_QUERY_CACHE_KEY, request.getTemplateId(), nodeId);
        Object o = TEMPLATE_QUERY_CACHE.get(cacheKey);
        if (o instanceof AggregatedResultVO) {
            return Result.success((AggregatedResultVO) o);
        }

        AggregatedResultVO aggregatedResultVO;
        TuQueryTemplateExecuteRequest tuQueryTemplateExecuteRequest = new TuQueryTemplateExecuteRequest();
        tuQueryTemplateExecuteRequest.setGql(queryTemplateVO.getTemplate());
        tuQueryTemplateExecuteRequest.setParameters(convertTemplateParameters(request.getTemplateParameterList()));
        tuQueryTemplateExecuteRequest.setGraphName(graphProjectVO.getGraphName());
        tuQueryTemplateExecuteRequest.setLanguageType(GraphLanguageTypeEnum.CYPHER);
        PluginResult<AggregatedResultVO> dbQueryResult;
        if (TemplateQueryTypeEnum.FUNCTION == queryTemplateVO.getQueryType()) {
            dbQueryResult = tuQueryFacade.executeQueryTemplateFunction(tuQueryTemplateExecuteRequest);
        } else {
            dbQueryResult = PluginResult.success(new AggregatedResultVO());
        }
        if (!dbQueryResult.isSuccess()) {
            log.error("exec tugraph-db plugin failed. dbQueryResult={}", JSONObject.toJSONString(dbQueryResult));
            return Result.failed(TugraphDBErrorCodeEnum.getTugraphDbErrorCode(dbQueryResult.getCode()), dbQueryResult.getErrorMsg(), null);
        }
        aggregatedResultVO = dbQueryResult.getData();
        // 图谱数据为空，默认返回该节点数据
        if (aggregatedResultVO.getNodes() == null || aggregatedResultVO.getNodes().length == 0) {
            String gql = String.format(DEFAULT_TUGRAPH_DB_NODE_GQL, queryTemplateVO.getQuerySource().name().toLowerCase(Locale.ROOT), nodeId);
            TuQueryExecuteRequest tuQueryExecuteRequest = new TuQueryExecuteRequest();
            tuQueryExecuteRequest.setGql(gql);
            tuQueryExecuteRequest.setGraphName(graphProjectVO.getGraphName());
            tuQueryExecuteRequest.setLanguageType(GraphLanguageTypeEnum.CYPHER);
            tuQueryExecuteRequest.setLimit(request.getLimit());
            dbQueryResult = tuQueryFacade.executeQueryGQL(tuQueryExecuteRequest);
            if (!dbQueryResult.isSuccess()) {
                log.error("exec tugraph-db plugin failed. dbQueryResult={}", JSONObject.toJSONString(dbQueryResult));
                return Result.failed(TugraphDBErrorCodeEnum.getTugraphDbErrorCode(dbQueryResult.getCode()), dbQueryResult.getErrorMsg(), null);
            }
            aggregatedResultVO.setNodes(dbQueryResult.getData().getNodes());
        }
        aggregatedResultVO.setGraphId(request.getGraphId().toString());
        aggregatedResultVO.setEngineType(ExecuteEngineEnum.TU_GRAPH_DB.name());

        // 切分数据
        sliceGraphData(aggregatedResultVO, request.getLimit());

        // 设置缓存
        TEMPLATE_QUERY_CACHE.put(cacheKey, aggregatedResultVO, TEMPLATE_QUERY_CACHE_EXPIRE, TimeUnit.SECONDS);
        return Result.success(aggregatedResultVO);
    }

    private String findNodeId(QueryTemplateVO queryTemplateVO, List<TemplateParameterRequest> templateParameterList) {
        for (TemplateParameterRequest request : templateParameterList) {
            if (FullTextIndexNameEnum.github_repo == queryTemplateVO.getQuerySource() && REPO_ID_PARAMETER_NAME.equals(request.getParameterName())) {
                return request.getParameterValue();
            }
            if (FullTextIndexNameEnum.github_user == queryTemplateVO.getQuerySource() && DEVELOPER_ID_PARAMETER_NAME.equals(request.getParameterName())) {
                return request.getParameterValue();
            }
        }
        return String.valueOf(0L);
    }

    @Override
    public Result<AggregatedResultVO> executeShareQueryTemplate(Long templateId, String paramsStr) {
        // 查询模版
        Result<QueryTemplateVO> templateResult = tuMakerQueryTemplateDataManager.queryTemplateById(templateId);
        if (templateResult.whetherFailed()) {
            return Result.failed(templateResult);
        }
        String[] params = paramsStr.split(",");
        QueryTemplateVO queryTemplateVO = templateResult.getData();
        List<TemplateParameterRequest> templateParameterList = queryTemplateVO.getTemplateParameterList();
        for (int i = 0; i < params.length; i++) {
            templateParameterList.get(i).setParameterValue(params[i]);
        }

        TuMakerExecuteTemplateRequest request = new TuMakerExecuteTemplateRequest();
        request.setTemplateId(templateId);
        request.setTemplateParameterList(templateParameterList);

        return executeQueryTemplate(request);
    }

    @Override
    public Result<List<FullTextQueryGithubRepoVO>> executeFullTextQuery(String keyword, String indexName){
        Map<String, String> keyWordMap = new HashMap<>();
        keyWordMap.put(ElasticSearchClientManagerImpl.esIndexBodyNameTag, keyword);
        FullTextIndexNameEnum indexNameEnum = FullTextIndexNameEnum.convertToFullTextIndexNameEnum(indexName);
        try {
            log.error("start search 1=");
            return  elasticSearchClientManager.search(indexNameEnum, keyWordMap);
        } catch (Exception e) {
            log.error("query full text error:", JSONObject.toJSONString(e));
        }
        return Result.failed(TumakerErrorCodeEnum.error, "query full text failed");
    }

    private Map<String, Object> convertTemplateParameters(List<TemplateParameterRequest> templateParameterList) {
        Map<String, Object> parameters = new HashMap<>();
        for (TemplateParameterRequest templateParameterRequest : templateParameterList) {
            parameters.put(templateParameterRequest.getParameterName(), templateParameterRequest.convertValueType());
        }
        return parameters;
    }

    private Result<GraphProjectVO> queryTuMakerProjectById(Long graphId) {
        // todo: xc 目前仅一个项目，后续迁移之后补全
        return Result.success(new GraphProjectVO(graphId, dbConfig.getDbName()));
    }

    //对返回结果切片
    private void sliceGraphData(AggregatedResultVO aggregatedResultVO, Long limit) {
        if (limit == null || limit <= 0) {
            return;
        }

        Node[] nodes = aggregatedResultVO.getNodes();
        Edge[] edges = aggregatedResultVO.getEdges();

        Map<String, Node> nodeMap = Arrays.stream(nodes).collect(Collectors.toMap(Node::getId, Function.identity(), (key1, key2) -> key2));
        List<Node> nodeList = new ArrayList<>(nodeMap.values());

        if (nodeList.size() > limit) {
            nodeList = nodeList.stream().limit(limit).collect(Collectors.toList());
        }

        //获取nodes的所有id
        Set<String> nodeSet = nodeList.stream().map(Node::getId).collect(Collectors.toSet());
        //若边的起点、终点都在nodeSet中，则保留该边
        List<Edge> edgesList = Arrays.stream(edges).filter(o -> (nodeSet.contains(o.getSource()) && nodeSet.contains(o.getTarget()))).collect(Collectors.toList());

        Node[] sliceNodes = new Node[nodeList.size()];
        aggregatedResultVO.setNodes(nodeList.toArray(sliceNodes));
        if (!CollectionUtils.isEmpty(edgesList)) {
            Edge[] sliceEdges = new Edge[edgesList.size()];
            aggregatedResultVO.setEdges(edgesList.toArray(sliceEdges));
        }
    }

}
