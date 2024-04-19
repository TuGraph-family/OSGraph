package com.alipay.tumaker.core.service.querytemplate;

import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.QueryTemplateVO;

import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/19 16:48
 * 图查询模版数据管理接口
 */
public interface TuMakerQueryTemplateDataManager {

    /**
     * 查询模版列表
     * @return
     */
    Result<List<QueryTemplateVO>> listQueryTemplate();

    /**
     * 根据id查询模版详情
     * @param templateId
     * @return
     */
    Result<QueryTemplateVO> queryTemplateById(Long templateId);
}
