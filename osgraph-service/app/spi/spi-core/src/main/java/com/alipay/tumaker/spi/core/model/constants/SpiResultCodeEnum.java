package com.alipay.tumaker.spi.core.model.constants;


public enum SpiResultCodeEnum {
    /**
     * 操作成功
     */
    SUCCESS("SUCCESS", "操作成功"),
    /**
     * 操作中
     */
    RUNNING("RUNNING", "操作中"),

    /**
     * 执行 cmdAgent 命令错误
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
