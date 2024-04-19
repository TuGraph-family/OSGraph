package com.alipay.tumaker.biz.service.graphanalysis;

import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.common.facade.model.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.facade.model.common.Enum.GraphLanguageTypeEnum;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.ExecuteEngineEnum;
import com.alipay.tumaker.core.service.graphanalysis.TuMakerAnalysisManager;
import org.springframework.stereotype.Service;

@Service
@SofaService
public class TuMakerAnalysisManagerImpl implements TuMakerAnalysisManager {
    @Override
    public Result<AggregatedResultVO> execute(String gql, GraphLanguageTypeEnum graphLanguageType, Long graphId, Long limit, ExecuteEngineEnum engineType) {
        return null;
    }
}
