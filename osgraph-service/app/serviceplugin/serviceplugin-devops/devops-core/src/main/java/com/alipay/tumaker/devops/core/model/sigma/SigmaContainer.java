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
     * name
     */
    private String name;

    // Fields allowed to be modified start //
    /**
     * containerimage
     */
    private String image;

    /**
     * Container env
     */
    private String env;

    /**
     * entrypoint
     */
    private String command;

    /**
     * Startup parameters
     */
    private String args;
    // Fields allowed to be modified end //

    /**
     * Resource specification
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
