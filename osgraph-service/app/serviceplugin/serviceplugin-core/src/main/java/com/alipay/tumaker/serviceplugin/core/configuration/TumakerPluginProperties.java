package com.alipay.tumaker.serviceplugin.core.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * tumaker 插件配置类
 */
@ConfigurationProperties(prefix = TumakerPluginProperties.TUMAKER_PLUGIN_PROP_PREFIX)
@Data
public class TumakerPluginProperties {

    public static final String TUMAKER_PLUGIN_PROP_PREFIX = "tumaker.store";

    private String engine;
}
