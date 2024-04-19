package com.alipay.tumaker.core.service.querytemplate;

import com.alibaba.fastjson.JSONObject;
import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.common.dal.mysql.mapper.TumakerQueryTemplateMapper;
import com.alipay.tumaker.common.dal.mysql.model.TumakerQueryTemplateDO;
import com.alipay.tumaker.common.facade.model.common.StringUtils;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.common.util.errorcode.TumakerErrorCodeEnum;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.TemplateParameterRequest;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.TemplateQueryTypeEnum;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.TemplateTypeEnum;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.QueryTemplateVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es.FullTextIndexNameEnum;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/19 16:49
 */
@Service
@SofaService
public class TuMakerQueryTemplateDataManagerImpl implements TuMakerQueryTemplateDataManager{

    @Autowired
    private TumakerQueryTemplateMapper tumakerQueryTemplateMapper;

    @Override
    public Result<List<QueryTemplateVO>> listQueryTemplate() {
        List<QueryTemplateVO> queryTemplateVOList = new ArrayList<>();
        LambdaQueryWrapper<TumakerQueryTemplateDO> wrapper = new LambdaQueryWrapper<>();
        List<TumakerQueryTemplateDO> templateDOList = tumakerQueryTemplateMapper.selectList(wrapper);
        for (TumakerQueryTemplateDO tumakerQueryTemplateDO : templateDOList) {
            QueryTemplateVO queryTemplateVO = new QueryTemplateVO();
            BeanUtils.copyProperties(tumakerQueryTemplateDO, queryTemplateVO);
            queryTemplateVO.setTemplateType(TemplateTypeEnum.obtainQueryTemplateType(tumakerQueryTemplateDO.getTemplateType()));
            queryTemplateVO.setQueryType(TemplateQueryTypeEnum.obtainTemplateQueryType(tumakerQueryTemplateDO.getTemplateQueryType()));
            if (StringUtils.isNotBlank(tumakerQueryTemplateDO.getTemplateParameter())) {
                queryTemplateVO.setTemplateParameterList(JSONObject.parseArray(tumakerQueryTemplateDO.getTemplateParameter(), TemplateParameterRequest.class));
            }
            queryTemplateVO.setQuerySource(FullTextIndexNameEnum.convertToFullTextIndexNameEnum(tumakerQueryTemplateDO.getQuerySource()));
            queryTemplateVOList.add(queryTemplateVO);
        }
        return Result.success(queryTemplateVOList);
    }

    @Override
    public Result<QueryTemplateVO> queryTemplateById(Long templateId) {
        QueryTemplateVO queryTemplateVO = new QueryTemplateVO();
        TumakerQueryTemplateDO tumakerQueryTemplateDO = tumakerQueryTemplateMapper.selectById(templateId);
        if (tumakerQueryTemplateDO == null) {
            return Result.failed(TumakerErrorCodeEnum.tu_query_template_not_exists);
        }
        BeanUtils.copyProperties(tumakerQueryTemplateDO, queryTemplateVO);
        queryTemplateVO.setTemplateType(TemplateTypeEnum.obtainQueryTemplateType(tumakerQueryTemplateDO.getTemplateType()));
        queryTemplateVO.setQueryType(TemplateQueryTypeEnum.obtainTemplateQueryType(tumakerQueryTemplateDO.getTemplateQueryType()));
        queryTemplateVO.setTemplateParameterList(JSONObject.parseArray(tumakerQueryTemplateDO.getTemplateParameter(), TemplateParameterRequest.class));
        return Result.success(queryTemplateVO);
    }
}
