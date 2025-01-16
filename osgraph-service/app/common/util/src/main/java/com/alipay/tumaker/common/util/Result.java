package com.alipay.tumaker.common.util;


import com.alibaba.fastjson.JSONObject;
import com.alipay.tumaker.common.util.errorcode.TugraphDBErrorCodeEnum;
import com.alipay.tumaker.common.util.errorcode.TumakerErrorCodeEnum;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/02/04
 * @version
 */
@Data
@AllArgsConstructor
@Slf4j
public class Result <T>{
    private static final String HOST_ADDRESS;

    static {
        String HOST_ADDRESS1;
        try {
            HOST_ADDRESS1 = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.info(JSONObject.toJSONString(e));
            HOST_ADDRESS1 = CommonUtil.getLocalAddress();
        }
        HOST_ADDRESS = HOST_ADDRESS1;
    }

    public static String getHostAddress() {
        return HOST_ADDRESS;
    }

    /**
     * Indicates success
     */
    private boolean success;

    /**
     * response message
     */
    private String message = "";

    /**
     * message link
     */
    private List<String> msgTraceList = new ArrayList<>();

    /**
     * Request processing server unique ID
     */
    private String id;

    /**
     * Machine information
     */
    private String server;
    /**
     * The machine IP
     */
    private String ip;

    /**
     * IP link
     */
    private List<String> ipTraceList = new ArrayList<>();

    /**
     * response data
     */
    private T data;

    /**
     * Platform unified error code
     */
    private TumakerErrorCodeEnum responseCode;

    /**
     * English explanation of error code
     */
    private String ecEnglishMsg;

    /**
     * Error code Chinese explanation
     */
    private String ecChineseMsg;

    /**
     * Engine corresponding original error code
     */
    private String engineErrorCode;

    /**
     * Generate results
     */
    private Result() {
        this.ip = HOST_ADDRESS;
    }

    /**
     * set data
     */

    public Result<T> setData(final T data) {
        this.data = data;
        return this;
    }
    /**
     * get data
     */

    public T getData() {
        return data;
    }

    /**
     * Set response code
     */
    public Result<T> setResponseCode(final TumakerErrorCodeEnum responseCode) {
        this.responseCode = responseCode;
        return this;
    }
    /**
     * Get response code
     */
    public TumakerErrorCodeEnum  getResponseCode() {

        return responseCode;
    }

    /**
     * Get response information
     *
     * @return return message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Set response message
     *
     * @param message response message
     * @return this
     */
    public Result<T> setMessage(final String message) {
        this.message = message;
        return this;
    }
    public Result<T> setEngineErrorCode(final  String engineErrorCode) {
        this.engineErrorCode = engineErrorCode;
        return this;
    }
    public String getEngineErrorCode() {
        return engineErrorCode;
    }

    public void putMsgTrace(String message) {
        if (msgTraceList.size() > 10 || CommonUtil.isEmpty(message)) {
            return;
        }
        msgTraceList.add(message);
    }

    public void addIpTrace(String ip) {
        if (!this.ip.equals(ip) && !ipTraceList.contains(ip)) {
            ipTraceList.add(ip);
        }
    }

    public boolean isSuccess() {
        success = TumakerErrorCodeEnum.success.getErrorCode().equals(responseCode.getErrorCode());
        return success;
    }


    public boolean whetherFailed() {
        return !isSuccess();
    }

    /**
     * success data
     *
     * @param data data object
     * @return result
     */
    public static <T> Result<T> success(T data) {
        return new Result<T>().setResponseCode(TumakerErrorCodeEnum.success).setData(data);
    }

    /**
     * success message
     *
     * @param message message
     * @return result
     */
    public static Result<String> successMsg(String message) {
        return success("success").setMessage(message);
    }

    /**
     * Success message + data
     *
     * @param message message
     * @param data    data
     * @return result //
     */
    public static <T> Result<T> success(String message, T data) {
        return success(data).setMessage(message);
    }

    /**
     * Only successful results
     *
     * @return result
     */
    public static Result<String> success() {
        return success("success");
    }

    private static <T> Result<T> setTugraphEcRequiredParam(Result<T> result, TugraphDBErrorCodeEnum tugraphDBErrorCodeEnum) {
        result.setEngineErrorCode(tugraphDBErrorCodeEnum.getErrorCode());
        result.setEcEnglishMsg(tugraphDBErrorCodeEnum.getEnglishDesc());
        result.setEcChineseMsg(tugraphDBErrorCodeEnum.getChineseDesc());
        return result;
    }

    private static <T> Result<T> setTuMakerEcRequiredParam(Result<T> result, TumakerErrorCodeEnum tumakerErrorCodeEnum) {
        result.setResponseCode(tumakerErrorCodeEnum);
        result.setEcEnglishMsg(tumakerErrorCodeEnum.getEnglishDesc());
        result.setEcChineseMsg(tumakerErrorCodeEnum.getChineseDesc());
        return result;
    }

    /**
     * Return engine failed
     */
    public static <T> Result<T> failed(TugraphDBErrorCodeEnum tugraphDBErrorCodeEnum, String errorMsg, T data) {
        TumakerErrorCodeEnum responseCodeEnum = TumakerErrorCodeEnum.error;
        Result<T> result = new Result<T>().setResponseCode(responseCodeEnum).setMessage(tugraphDBErrorCodeEnum.getChineseDesc() + tugraphDBErrorCodeEnum.name()).setMessage(errorMsg);
        result.setData(data);
        return setTugraphEcRequiredParam(result, tugraphDBErrorCodeEnum);
    }

    public static <T> Result<T> failed(TumakerErrorCodeEnum tumakerErrorCodeEnum, String chineseExtraMsg, String englishErrorMsg, T data) {
        Result<T> result = new Result<T>().setResponseCode(tumakerErrorCodeEnum).setMessage(tumakerErrorCodeEnum.getEnglishDesc()+ ",error : " + englishErrorMsg);
        result.setEcEnglishMsg(tumakerErrorCodeEnum.getEnglishDesc() + ",error : " + englishErrorMsg);
        result.setEcChineseMsg(tumakerErrorCodeEnum.getChineseDesc() + ",错误详情 : " + chineseExtraMsg);
        result.setMessage(englishErrorMsg).setData(data);
        return setTuMakerEcRequiredParam(result, tumakerErrorCodeEnum);
    }

    public static <T> Result<T> failed(TumakerErrorCodeEnum tumakerErrorCodeEnum, String message) {
        return new Result<T>().setResponseCode(tumakerErrorCodeEnum).setMessage(message);
    }

    public static <T> Result<T> failed(TumakerErrorCodeEnum tumakerErrorCodeEnum) {
        return new Result<T>().setResponseCode(tumakerErrorCodeEnum).setMessage(tumakerErrorCodeEnum.getChineseDesc());
    }

    public static <T> Result<T> failed(Result result) {
        return new Result<T>().setResponseCode(result.getResponseCode()).setMessage(result.getMessage());
    }

}
