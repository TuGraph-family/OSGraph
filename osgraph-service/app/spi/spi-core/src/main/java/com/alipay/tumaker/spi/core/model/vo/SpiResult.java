package com.alipay.tumaker.spi.core.model.vo;

import java.io.Serializable;
/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
public class SpiResult<T> implements Serializable {
    private static final long serialVersionUID = -1009665951460964501L;
    private T data;
    private boolean success = false;
    private String errorMsg;
    private String code;

    public SpiResult() {
    }

    private SpiResult(T data) {
        this.data = data;
        this.success = true;
    }

    private SpiResult(String errorMsg) {
        this.errorMsg = errorMsg;
        this.success = false;
    }

    private SpiResult(String code, String errorMsg) {
        this.code = code;
        this.errorMsg = errorMsg;
    }

    private SpiResult(String errorMsg, T data) {
        this.errorMsg = errorMsg;
        this.data = data;
        this.success = false;
    }

    public static <T> SpiResult<T> success(T data) {
        return new SpiResult(data);
    }

    public static <T> SpiResult<T> success(String code, T data) {
        SpiResult spiResult = new SpiResult();
        spiResult.setCode(code);
        spiResult.setSuccess(true);
        spiResult.setData(data);
        return spiResult;
    }

    public static <T> SpiResult<T> failed(String errorMsg, T data) {
        return new SpiResult(errorMsg, data);
    }

    public static <T> SpiResult<T> failed(String code, String errorMsg) {
        return new SpiResult(code, errorMsg);
    }

    public static <T> SpiResult<T> failed(String errorMsg, String code, T data) {
        SpiResult spiResult = new SpiResult();
        spiResult.setCode(code);
        spiResult.setData(data);
        spiResult.setSuccess(false);
        spiResult.setErrorMsg(errorMsg);
        return spiResult;
    }

    public static <T> SpiResult<T> failed(String errorMsg) {
        return new SpiResult(errorMsg);
    }

    public static <T> SpiResult<T> failed(SpiResult result) throws Exception {
        if (result.isSuccess()) {
            throw new Exception("cannot copy success result!");
        }

        SpiResult<T> newRs = new SpiResult<T>();
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
        return "SpiResult{" +
                "data=" + data +
                ", success=" + success +
                ", errorMsg='" + errorMsg + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
}
