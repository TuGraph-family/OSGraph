package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;

import java.util.regex.Pattern;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 16:10
 */
@Data
public class SigmaResource {

    /**
     * cpu
     */
    private String cpu;

    /**
     * 内存
     */
    private String memory;

    /**
     * 存储
     */
    private String ephemeralStorage;

    private static final Pattern pattern = Pattern.compile("^\\d+Gi\b?$");

    public void check() {
        if (cpu == null) {
            throw new IllegalArgumentException("cpu is null");
        }
        if (memory == null || !pattern.matcher(memory).find()) {
            throw new IllegalArgumentException("memory is not match");
        }
        if (ephemeralStorage == null || !pattern.matcher(ephemeralStorage).find()) {
            throw new IllegalArgumentException("ephemeralStorage is not match");
        }
    }
}
