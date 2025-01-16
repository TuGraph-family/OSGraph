package com.alipay.tumaker.core.service.graphanalysis;

import com.alipay.tumaker.common.facade.model.vo.common.Enum.GraphLanguageTypeEnum;
import com.alipay.tumaker.common.facade.model.vo.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.common.facade.model.ExecuteEngineEnum;

public interface TuMakerAnalysisManager {
    /**
     * Execute query statement
     */
    Result<AggregatedResultVO> execute(String gql, GraphLanguageTypeEnum graphLanguageType, Long graphId, Long limit, ExecuteEngineEnum engineType);
}
