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
     * 执行查询模板
     * @param tuMakerExecuteTemplateRequest
     * @return
     */
    Result<AggregatedResultVO> executeQueryTemplate(TuMakerExecuteTemplateRequest tuMakerExecuteTemplateRequest);

    /**
     * 执行全文查询
     */
    Result<List<FullTextQueryGithubRepoVO>> executeFullTextQuery(String keyword, String indexName);

    /**
     * 执行分享查询模版
     * @param templateId
     * @param params
     * @return
     */
    Result<AggregatedResultVO> executeShareQueryTemplate(Long templateId, String params);
}
