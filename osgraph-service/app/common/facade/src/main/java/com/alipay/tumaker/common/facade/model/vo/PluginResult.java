package com.alipay.tumaker.common.facade.model.vo;

import java.io.Serializable;

/**
 * 插件统一返回结构体
 */
public class PluginResult<T> implements Serializable {
    private static final long serialVersionUID = -1009665951460964501L;
    private T data;
    private boolean success = false;
    private String errorMsg;
    private String code;

    public PluginResult() {
    }

    private PluginResult(T data) {
        this.data = data;
        this.success = true;
    }

    private PluginResult(String errorMsg) {
        this.errorMsg = errorMsg;
        this.success = false;
    }

    private PluginResult(String code, String errorMsg) {
        this.code = code;
        this.errorMsg = errorMsg;
    }

    private PluginResult(String errorMsg, T data) {
        this.errorMsg = errorMsg;
        this.data = data;
        this.success = false;
    }

    public static <T> PluginResult<T> success(T data) {
        return new PluginResult(data);
    }

    public static <T> PluginResult<T> success(String code, T data) {
        PluginResult spiResult = new PluginResult();
        spiResult.setCode(code);
        spiResult.setSuccess(true);
        spiResult.setData(data);
        return spiResult;
    }

    public static <T> PluginResult<T> failed(String errorMsg, T data) {
        return new PluginResult(errorMsg, data);
    }

    public static <T> PluginResult<T> failed(String code, String errorMsg) {
        return new PluginResult(code, errorMsg);
    }

    public static <T> PluginResult<T> failed(String errorMsg, String code, T data) {
        PluginResult spiResult = new PluginResult();
        spiResult.setCode(code);
        spiResult.setData(data);
        spiResult.setSuccess(false);
        spiResult.setErrorMsg(errorMsg);
        return spiResult;
    }

    public static <T> PluginResult<T> failed(String errorMsg) {
        return new PluginResult(errorMsg);
    }

    public static <T> PluginResult<T> failed(PluginResult result) throws Exception {
        if (result.isSuccess()) {
            throw new Exception("cannot copy success result!");
        }

        PluginResult<T> newRs = new PluginResult<T>();
        newRs.setSuccess(false);
        newRs.setErrorMsg(result.getErrorMsg());
        newRs.setCode(result.getCode());
        return newRs;
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return this.success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorMsg() {
        return this.errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "PluginResult{" +
                "data=" + data +
                ", success=" + success +
                ", errorMsg='" + errorMsg + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
}
