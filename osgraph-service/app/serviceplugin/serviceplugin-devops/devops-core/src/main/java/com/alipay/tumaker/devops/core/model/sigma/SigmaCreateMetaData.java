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
     * pod name
     */
    private String name;

    /**
     * namespace
     */
    private String namespace;

    /**
     * annotation
     */
    private Map<String, String> annotations = new HashMap<>();

    /**
     * Label
     */
    private final Map<String, String> labels = new HashMap<>();

    /**
     * quintuple
     */
    // Application name
    private String appName;
    // Application grouping
    private String instanceGroup;
    // deployment unit
    private String deployUnit;
    // engine room
    private String site;
    // Logic room
    private String zone;

    /**
     * Business party/batch
     */
    // Business party name
    private String bizName;
    // Business group name, optional
    private String bizGroup;
    // Business side task id, optional
    private Long bizGroupId;
    // The total number of pods that need to be delivered in the current batch, optional
    private Integer replicas = 1;
    // The minimum total number of pods delivered in the current batch, optional
    private Integer minReplicas = 1;

    /**
     * Move level
     */
    private MigrationLevelEnum migrationLevel = MigrationLevelEnum.L3;

    /**
     * Environmental information, optional
     */
    private String appEnv;

    /**
     * Tenant information, optional
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

        // Register to zappinfo, whether required
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
