package com.alipay.tumaker.core.service.graphanalysis;

import com.alipay.tumaker.common.facade.model.common.Enum.GraphLanguageTypeEnum;
import com.alipay.tumaker.common.facade.model.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.ExecuteEngineEnum;

public interface TuMakerAnalysisManager {
    /**
     * 执行查询语句
     */
    Result<AggregatedResultVO> execute(String gql, GraphLanguageTypeEnum graphLanguageType, Long graphId, Long limit, ExecuteEngineEnum engineType);
}
