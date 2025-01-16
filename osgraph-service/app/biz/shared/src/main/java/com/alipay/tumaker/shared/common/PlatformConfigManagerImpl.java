package com.alipay.tumaker.shared.common;

import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.core.service.common.PlatformConfigManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/19
 */
@SofaService
@Service
@Slf4j
@Configuration
@PropertySource(value = {"classpath:config/application.properties"})
public class PlatformConfigManagerImpl implements PlatformConfigManager{

    @Value("${es.server.url}")
    private String esserverUrl;

    @Value("${es.server.username}")
    private String esServerUsername;

    @Value("${es.server.password}")
    private String esServerPassword;
    private final static String esserverUrlTag = "es_server_url";

    @Override
    public String getEsServerUrl(){
        return esserverUrl;
        //Replace todo into db to get the value
        //return getValueFromConfigTable();
    }

    @Override
    public String getEsServerUsername() {
        return esServerUsername;
    }

    @Override
    public String getEsServerPassword() {
        return esServerPassword;
    }

}
