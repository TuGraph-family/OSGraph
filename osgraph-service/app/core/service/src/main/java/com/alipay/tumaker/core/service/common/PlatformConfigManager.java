package com.alipay.tumaker.core.service.common;
/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/19
 */
public interface PlatformConfigManager {
    /**
     *获取es 服务地址
     */
    String getEsServerUrl();

    /**
     * 获取es 服务账号
     * @return
     */
    String getEsServerUsername();

    /**
     * 获取es 服务密码
     * @return
     */
    String getEsServerPassword();

}
