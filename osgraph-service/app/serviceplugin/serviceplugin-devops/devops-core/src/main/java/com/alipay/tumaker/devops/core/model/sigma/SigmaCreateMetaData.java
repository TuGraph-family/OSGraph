package com.alipay.tumaker.devops.core.model.sigma;

import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 16:05
 */
@Data
public class SigmaCreateMetaData {

    /**
     * pod名称
     */
    private String name;

    /**
     * 命名空间
     */
    private String namespace;

    /**
     * 注解
     */
    private Map<String, String> annotations = new HashMap<>();

    /**
     * 标签
     */
    private final Map<String, String> labels = new HashMap<>();

    /**
     * 五元组
     */
    // 应用名称
    private String appName;
    // 应用分组
    private String instanceGroup;
    // 部署单元
    private String deployUnit;
    // 机房
    private String site;
    // 逻辑机房
    private String zone;

    /**
     * 业务方/批次
     */
    // 业务方名称
    private String bizName;
    // 业务组名称，选填
    private String bizGroup;
    // 业务方任务id，选填
    private Long bizGroupId;
    // 当前批次需要交付pod总数，选填
    private Integer replicas = 1;
    // 当前批次最少交付pod总数，选填
    private Integer minReplicas = 1;

    /**
     * 腾挪等级
     */
    private MigrationLevelEnum migrationLevel = MigrationLevelEnum.L3;

    /**
     * 环境信息，选填
     */
    private String appEnv;

    /**
     * 租户信息,选填
     */
    private String appFhcTenant = "MAIN_SITE";

    public SigmaCreateMetaData() {
        labels.put("sigma.ali/app-name", appName);
        labels.put("sigma.ali/instance-group", instanceGroup);
        labels.put("sigma.ali/deploy-unit", deployUnit);
        labels.put("sigma.ali/site", site);
        labels.put("meta.k8s.alipay.com/zone", zone);

        labels.put("meta.k8s.alipay.com/migration-level", migrationLevel.name());

        labels.put("meta.k8s.alipay.com/biz-name", bizName);
        labels.put("meta.k8s.alipay.com/replicas", replicas.toString());
        labels.put("meta.k8s.alipay.com/min-replicas", minReplicas.toString());

        if (StringUtils.isNotBlank(bizGroup)) {
            labels.put("meta.k8s.alipay.com/biz-group", bizGroup);
        }
        if (bizGroupId != null) {
            labels.put("meta.k8s.alipay.com/biz-group-id", bizGroupId.toString());
        }
        if (StringUtils.isNotBlank(appEnv)) {
            labels.put("meta.k8s.alipay.com/app-env", appEnv);
        }
        if (StringUtils.isNotBlank(appFhcTenant)) {
            labels.put("meta.k8s.alipay.com/app-fhc-tenant", appFhcTenant);
        }

        // 注册到zappinfo，是否需要
//        annotations.put("meta.k8s.alipay.com/pod-zappinfo", "{}");
    }

    public void check() {
        if (StringUtils.isBlank(name)) {
            throw new RuntimeException("SigmaMetaData pod name is empty!");
        }
        if (StringUtils.isBlank(namespace)) {
            throw new RuntimeException("SigmaMetaData namespace is empty!");
        }
        if (StringUtils.isBlank(appName)) {
            throw new RuntimeException("SigmaMetaData appName is empty!");
        }
        if (StringUtils.isBlank(instanceGroup)) {
            throw new RuntimeException("SigmaMetaData instanceGroup is empty!");
        }
        if (StringUtils.isBlank(deployUnit)) {
            throw new RuntimeException("SigmaMetaData deployUnit is empty!");
        }
        if (StringUtils.isBlank(site)) {
            throw new RuntimeException("SigmaMetaData site is empty!");
        }
        if (StringUtils.isBlank(zone)) {
            throw new RuntimeException("SigmaMetaData zone is empty!");
        }
        if (StringUtils.isBlank(bizName)) {
            throw new RuntimeException("SigmaMetaData bizName is empty!");
        }
        if (migrationLevel == null) {
            throw new RuntimeException("SigmaMetaData migrationLevel is empty!");
        }
    }

}
