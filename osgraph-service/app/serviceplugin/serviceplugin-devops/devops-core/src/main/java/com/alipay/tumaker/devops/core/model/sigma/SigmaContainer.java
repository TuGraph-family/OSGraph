package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;
import org.apache.commons.lang3.StringUtils;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 16:07
 */
@Data
public class SigmaContainer {

    /**
     * 名称
     */
    private String name;

    // 允许修改的字段 start //
    /**
     * 容器image
     */
    private String image;

    /**
     * 容器的env
     */
    private String env;

    /**
     * entrypoint
     */
    private String command;

    /**
     * 启动参数
     */
    private String args;
    // 允许修改的字段 end //

    /**
     * 资源规格
     */
    private SigmaSpecResource resource;

    public void check() {
        if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("SigmaContainer name is blank");
        }
        if (StringUtils.isBlank(image)) {
            throw new IllegalArgumentException("SigmaContainer image is blank");
        }
        if (resource == null) {
            throw new IllegalArgumentException("SigmaContainer resource is null");
        }
        resource.check();
    }
}
