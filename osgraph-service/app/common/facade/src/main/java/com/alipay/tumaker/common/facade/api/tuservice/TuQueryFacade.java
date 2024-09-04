package com.alipay.tumaker.common.facade.api.tuservice;

import com.alipay.tumaker.common.facade.model.request.TuQueryExecuteRequest;
import com.alipay.tumaker.common.facade.model.request.TuQueryTemplateExecuteRequest;
import com.alipay.tumaker.common.facade.model.vo.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.facade.model.vo.PluginResult;

/**
 * 图查询统一接口定义
 */
public interface TuQueryFacade {

    /**
     * 执行模版查询-函数调用
     * @param tuQueryTemplateExecuteRequest
     * @return
     */
    PluginResult<AggregatedResultVO> executeQueryTemplateFunction(TuQueryTemplateExecuteRequest tuQueryTemplateExecuteRequest);

    /**
     * 执行图查询-GQL调用
     * @param tuQueryExecuteRequest
     * @return
     */
    PluginResult<AggregatedResultVO> executeQueryGQL(TuQueryExecuteRequest tuQueryExecuteRequest);
}
