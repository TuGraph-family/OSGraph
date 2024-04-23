package com.alipay.tumaker.core.service.graphanalysis;

import com.alibaba.fastjson.JSONObject;
import com.alipay.sofa.runtime.api.annotation.SofaReference;
import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.biz.service.graphanalysis.ElasticSearchClientManagerImpl;
import com.alipay.tumaker.common.facade.model.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.facade.model.analysis.view.Edge;
import com.alipay.tumaker.common.facade.model.analysis.view.Node;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.common.util.errorcode.TugraphDBErrorCodeEnum;
import com.alipay.tumaker.common.util.errorcode.TumakerErrorCodeEnum;
import com.alipay.tumaker.core.model.tumaker.graphproject.GraphProjectVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.*;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.QueryTemplateVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es.FullTextIndexNameEnum;
import com.alipay.tumakertugraphdb.config.DbConfig;
import lombok.extern.slf4j.Slf4j;
import com.alipay.tumaker.core.service.common.PlatformConfigManager;
import com.alipay.tumaker.core.service.querytemplate.TuMakerQueryTemplateDataManager;
import com.alipay.tumakertugraphdb.components.tuservice.request.TuQueryExecuteRequest;
import com.alipay.tumakertugraphdb.components.tuservice.request.TuQueryTypeEnum;
import com.alipay.tumakertugraphdb.components.tuservice.service.TuQueryService;
import com.alipay.tumakertugraphdb.model.GraphLanguageTypeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Created by XiangChen
 * @date 2024/3/15 10:42
 */
@SofaService
@Service
@Slf4j
public class TuMakerTemplateManagerImpl implements TuMakerTemplateManager{

    @SofaReference
    private TuMakerQueryTemplateDataManager tuMakerQueryTemplateDataManager;
    @SofaReference
    private TuMakerAnalysisManager tuMakerAnalysisManager;
    @SofaReference
    private ElasticSearchClientManager elasticSearchClientManager;

    @Autowired(required = false)
    private TuQueryService tuQueryService;
    @SofaReference
    private PlatformConfigManager platformConfigManager;
    @Autowired
    private DbConfig dbConfig;

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

        AggregatedResultVO aggregatedResultVO = new AggregatedResultVO();
        switch (request.getEngineType()) {
            case TU_GRAPH_DB:
                TuQueryExecuteRequest tuQueryExecuteRequest = new TuQueryExecuteRequest();
                tuQueryExecuteRequest.setGql(queryTemplateVO.getTemplate());
                tuQueryExecuteRequest.setQueryType(TuQueryTypeEnum.TEMPLATE_QUERY);
                tuQueryExecuteRequest.setParameters(convertTemplateParameters(request.getTemplateParameterList()));
                tuQueryExecuteRequest.setGraphName(graphProjectVO.getGraphName());
                tuQueryExecuteRequest.setLanguageType(GraphLanguageTypeEnum.CYPHER);
                com.alipay.tumakertugraphdb.model.Result<AggregatedResultVO> dbQueryResult;
                if (TemplateQueryTypeEnum.FUNCTION == queryTemplateVO.getQueryType()) {
                    dbQueryResult = tuQueryService.executeFunctionTemplate(tuQueryExecuteRequest);
                } else {
                    // todo: xc 非函数调用
                    dbQueryResult = com.alipay.tumakertugraphdb.model.Result.success(new AggregatedResultVO());
                }
                if (dbQueryResult.whetherFailed()) {
                    log.error("exec tugraph-db plugin failed. dbQueryResult={}", JSONObject.toJSONString(dbQueryResult));
                    return Result.failed(TugraphDBErrorCodeEnum.getTugraphDbErrorCode(dbQueryResult.getCode()), dbQueryResult.getMessage(), null);
                }
                aggregatedResultVO.setGraphId(request.getGraphId().toString());
                aggregatedResultVO = dbQueryResult.getData();
                aggregatedResultVO.setEngineType(ExecuteEngineEnum.TU_GRAPH_DB.name());
                break;
            default:
                return Result.failed(TumakerErrorCodeEnum.tu_query_engine_not_support);
        }

        // 切分数据
        sliceGraphData(aggregatedResultVO, request.getLimit());
        return Result.success(aggregatedResultVO);
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
        log.info("yayatest");
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
