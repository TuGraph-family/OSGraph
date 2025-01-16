package com.alipay.tumaker.core.service.common;
/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/19
 */
public interface PlatformConfigManager {
    /**
     *Get es service address
     */
    String getEsServerUrl();

    /**
     * Get es service account
     * @return
     */
    String getEsServerUsername();

    /**
     * Get es service password
     * @return
     */
    String getEsServerPassword();

}
