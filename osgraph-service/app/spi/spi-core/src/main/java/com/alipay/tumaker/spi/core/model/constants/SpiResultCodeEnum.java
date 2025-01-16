package com.alipay.tumaker.spi.core.model.constants;


public enum SpiResultCodeEnum {
    /**
     * Operation successful
     */
    SUCCESS("SUCCESS", "操作成功"),
    /**
     * In operation
     */
    RUNNING("RUNNING", "操作中"),

    /**
     * Error executing cmdAgent command
     */
    CmdAgentexecuteError("CmdAgentexecuteError","cmdAgent 执行命令失败");

    private final String code;
    private final String desc;

    SpiResultCodeEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }
    public String getDesc() {
        return desc;
    }
}
