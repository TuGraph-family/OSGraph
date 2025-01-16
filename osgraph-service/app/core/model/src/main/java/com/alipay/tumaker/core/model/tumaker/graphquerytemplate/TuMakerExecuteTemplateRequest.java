package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;


import com.alipay.tumaker.common.facade.model.ExecuteEngineEnum;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.common.util.errorcode.TumakerErrorCodeEnum;
import lombok.Data;
import org.apache.commons.lang.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.LinkedList;
import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 18:23
 */
@Data
public class TuMakerExecuteTemplateRequest {

    /**
     * template id
     */
    private Long templateId;

    /**
     * Parameterized list
     */
    private List<TemplateParameterRequest> templateParameterList = new LinkedList<>();

    /**
     * graphId graph id - reserved field, can not be passed
     */
    private Long graphId = 0L;

    /**
     * limit - Reserved fields, do not need to be passed
     */
    private Long limit = 100L;

    /**
     * Execution engine - default tugraph-db
     */
    private ExecuteEngineEnum engineType = ExecuteEngineEnum.TU_GRAPH_DB;

    public <T> Result<T> check() {
        if (templateId == null) {
            return Result.failed(TumakerErrorCodeEnum.not_legal, "模版id不能为空");
        }
        if (CollectionUtils.isEmpty(templateParameterList)) {
            return Result.failed(TumakerErrorCodeEnum.not_legal, "参数不能为空");
        } else {
            for (TemplateParameterRequest templateParameterRequest : templateParameterList) {
                if (StringUtils.isBlank(templateParameterRequest.getParameterName())) {
                    return Result.failed(TumakerErrorCodeEnum.not_legal, "参数名不能为空");
                }
                if (StringUtils.isBlank(templateParameterRequest.getParameterValue())) {
                    return Result.failed(TumakerErrorCodeEnum.not_legal, "参数值不能为空");
                }
            }
        }
        return Result.success(null);
    }
}
