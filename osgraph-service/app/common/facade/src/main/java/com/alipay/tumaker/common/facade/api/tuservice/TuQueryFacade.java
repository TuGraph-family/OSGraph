package com.alipay.tumaker.common.facade.api.tuservice;

import com.alipay.tumaker.common.facade.model.request.TuQueryExecuteRequest;
import com.alipay.tumaker.common.facade.model.request.TuQueryTemplateExecuteRequest;
import com.alipay.tumaker.common.facade.model.vo.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.facade.model.vo.PluginResult;

/**
 * Graph query unified interface definition
 */
public interface TuQueryFacade {

    /**
     * Execute template query-function call
     * @param tuQueryTemplateExecuteRequest
     * @return
     */
    PluginResult<AggregatedResultVO> executeQueryTemplateFunction(TuQueryTemplateExecuteRequest tuQueryTemplateExecuteRequest);

    /**
     * Execution graph query-GQL call
     * @param tuQueryExecuteRequest
     * @return
     */
    PluginResult<AggregatedResultVO> executeQueryGQL(TuQueryExecuteRequest tuQueryExecuteRequest);
}
