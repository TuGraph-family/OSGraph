package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/4/24 11:22
 */
@Data
public class OperatePodRequest {

    /**
     * api版本
     */
    private static final String apiVersion = "v1";

    /**
     * 资源类型
     */
    private static final String kind = "Pod";

    /**
     * 元数据
     */
    private SigmaOperateMateData metaData;
}

