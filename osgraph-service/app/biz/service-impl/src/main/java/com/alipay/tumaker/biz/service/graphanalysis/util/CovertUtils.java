package com.alipay.tumaker.biz.service.graphanalysis.util;

import com.alipay.tumaker.common.dal.mysql.model.TumakerQueryTemplateDO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.TemplateTypeEnum;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.QueryTemplateVO;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

public class CovertUtils {
    /**
     * 图查询模板DO转换为VO
     */
    public static List<QueryTemplateVO> convertToInt(List<TumakerQueryTemplateDO> templateDOS) {
        List<QueryTemplateVO> result = new ArrayList<>();
        if (CollectionUtils.isEmpty(templateDOS)){
            return result;
        }
        for (TumakerQueryTemplateDO templateDO : templateDOS){
            QueryTemplateVO vo = new QueryTemplateVO();
            BeanUtils.copyProperties(templateDO,vo);
            if (!StringUtils.isEmpty(templateDO.getTemplateType())){
                vo.setTemplateType(TemplateTypeEnum.valueOf(templateDO.getTemplateType()));
            }
            result.add(vo);
        }
        return result;
    }
}
