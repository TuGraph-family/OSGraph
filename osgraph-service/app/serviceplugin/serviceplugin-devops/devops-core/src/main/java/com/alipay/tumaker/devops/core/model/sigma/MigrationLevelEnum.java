package com.alipay.tumaker.devops.core.model.sigma;

/**
 * @author Created by XiangChen
 * @date 2024/4/23 18:54
 *
 * pod的腾挪等级，
 * 参照规范：https://developer.alipay.com/wiki/rules/dev_kb/dev?slug=al3t55
 */
public enum MigrationLevelEnum {
    /**
     * 3 天，3天强制删除，需要审批后才能接入
     */
    L1,
    /**
     * 4小时，ODPS，8小时强制删除，需要审批后才能接入
     */
    L2,
    /**
     *  1小时，数据库、Tair、Spanner、部分离线任务等，2小时强制删除
     */
    L3,
    /**
     * 20分钟，SOFA/SOFABoot 等在线应用，40分钟强制删除
     */
    L4,
    /**
     * 1分钟，FaaS 应用，2分钟强制删除
     */
    L5,
    ;

}
