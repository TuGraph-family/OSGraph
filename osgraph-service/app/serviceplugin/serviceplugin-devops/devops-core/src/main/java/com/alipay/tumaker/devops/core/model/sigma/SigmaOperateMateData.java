package com.alipay.tumaker.devops.core.model.sigma;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Created by XiangChen
 * @date 2024/4/24 11:24
 */
@Data
public class SigmaOperateMateData {

    /**
     * annotation
     */
    private final Map<String, String> annotations = new HashMap<>();

    /**
     * app name
     */
    private String appName;
    /**
     * state
     */
    private PodStatusEnum status;

    private static final String PROPERTY_STATES = "states";

    public SigmaOperateMateData() {
        this.annotations.put("pod.beta1.sigma.ali/container-state-spec", getStatesJson());
    }

    public void check() {
        if (StringUtils.isBlank(appName)) {
            throw new IllegalArgumentException("appName is blank");
        }
        if (status == null) {
            throw new IllegalArgumentException("status is null");
        }
    }

    private String getStatesJson() {
        Map<String, Map<String, String>> statesMap = new HashMap<>();
        Map<String, String> appMap = new HashMap<>();
        appMap.put(appName, status.name());
        statesMap.put(PROPERTY_STATES, appMap);
        return JSONObject.toJSONString(statesMap);
    }

}
