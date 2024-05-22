package com.alipay.tumaker.spi.agent.agent.core.model;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
@Data
@NoArgsConstructor
public class SingHostSyncResponse {
    private String uid;
    private String errorCode;
    private String errorMessage;
    private String errorType;
    private String errorUrl;
    private String jobName;
    private String jobResult;
    private String script;
}
