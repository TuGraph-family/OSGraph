package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 18:01
 * 创建容器时指定的资源规格
 */
@Data
public class SigmaSpecResource {

    /**
     * 容器运行过程中能够使用的最大资源量
     */
    private SigmaResource limits;

    /**
     * 容器启动时至少需要的资源量
     */
    private SigmaResource requests;

    public void check() {
        if (limits == null) {
            throw new RuntimeException("limits is null");
        }
        if (requests == null) {
            throw new RuntimeException("requests is null");
        }
        limits.check();
        requests.check();
    }
}
