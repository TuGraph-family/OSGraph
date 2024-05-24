package com.alipay.tumaker.spi.agent.agent.core.model;

import java.io.Serializable;
/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
public class BaseHostResponse implements Serializable {
    private static final long serialVersionUID = -7009665951460964588L;
    private String ip;
    private Boolean success;
    private String message;
}
