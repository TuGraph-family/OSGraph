package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 18:01
 * Resource specifications specified when creating the container
 */
@Data
public class SigmaSpecResource {

    /**
     * The maximum amount of resources that a container can use while running
     */
    private SigmaResource limits;

    /**
     * The minimum amount of resources required when the container starts
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
