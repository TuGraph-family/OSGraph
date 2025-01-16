package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 16:06
 */
@Data
public class SigmaSpec {

    /**
     * Container list, only one container is created by default
     */
    private List<SigmaContainer> containers;

    public void check() {
        if (containers == null || containers.isEmpty()) {
            throw new IllegalArgumentException("containers is empty");
        }
        for (SigmaContainer container : containers) {
            container.check();
        }
    }
}
