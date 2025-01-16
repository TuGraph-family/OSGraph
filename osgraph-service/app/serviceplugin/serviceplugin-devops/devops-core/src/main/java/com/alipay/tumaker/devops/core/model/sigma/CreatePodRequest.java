package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 15:59
 */
@Data
public class CreatePodRequest {

    /**
     * api version
     */
    private final String apiVersion = "v1";

    /**
     * Resource type
     */
    private final String kind = "Pod";

    /**
     * Metadata
     */
    private SigmaCreateMetaData metaData;

    /**
     * Specification
     */
    private SigmaSpec spec;

    public void check() throws Exception {
        if (metaData == null) {
            throw new IllegalAccessException("metaData is null");
        } else {
            metaData.check();
        }
        if (spec == null) {
            throw new IllegalAccessException("spec is null");
        } else {
            spec.check();
        }
    }

}
