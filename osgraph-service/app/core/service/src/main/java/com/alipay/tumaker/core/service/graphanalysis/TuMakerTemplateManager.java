package com.alipay.tumaker.core.service.graphanalysis;

import com.alipay.tumaker.common.facade.model.vo.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.FullTextQueryGithubRepoVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.TuMakerExecuteTemplateRequest;

import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/15 10:42
 */
public interface TuMakerTemplateManager {

    /**
     * Execute query template
     * @param tuMakerExecuteTemplateRequest
     * @return
     */
    Result<AggregatedResultVO> executeQueryTemplate(TuMakerExecuteTemplateRequest tuMakerExecuteTemplateRequest);

    /**
     * Perform full text query
     */
    Result<List<FullTextQueryGithubRepoVO>> executeFullTextQuery(String keyword, String indexName);

    /**
     * Execute shared query template
     * @param templateId
     * @param params
     * @return
     */
    Result<AggregatedResultVO> executeShareQueryTemplate(Long templateId, String params);
}
