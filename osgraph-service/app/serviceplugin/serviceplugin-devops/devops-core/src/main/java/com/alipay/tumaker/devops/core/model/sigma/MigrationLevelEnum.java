package com.alipay.tumaker.devops.core.model.sigma;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 18:54
 *
 * The movement level of the pod,
 * 参照规范：https://developer.alipay.com/wiki/rules/dev_kb/dev?slug=al3t55
 */
public enum MigrationLevelEnum {
    /**
     * 3 days, forced deletion in 3 days, need approval before access
     */
    L1,
    /**
     * 4 hours, ODPS, 8 hours forced deletion, need approval before access
     */
    L2,
    /**
     *  1 hour, database, Tair, Spanner, some offline tasks, etc., forced deletion in 2 hours
     */
    L3,
    /**
     * 20 minutes, SOFA/SOFABoot and other online applications, 40 minutes forced deletion
     */
    L4,
    /**
     * 1 minute, FaaS application, 2 minutes forced deletion
     */
    L5,
    ;

}
