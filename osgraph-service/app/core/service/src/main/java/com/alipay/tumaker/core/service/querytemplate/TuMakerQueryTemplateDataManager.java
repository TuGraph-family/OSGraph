package com.alipay.tumaker.core.service.querytemplate;

import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.QueryTemplateVO;

import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/19 16:48
 * Graph query template data management interface
 */
public interface TuMakerQueryTemplateDataManager {

    /**
     * Query template list
     * @return
     */
    Result<List<QueryTemplateVO>> listQueryTemplate();

    /**
     * Query template details based on id
     * @param templateId
     * @return
     */
    Result<QueryTemplateVO> queryTemplateById(Long templateId);
}
