package com.alipay.tumaker.common.util.errorcode;
/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
public enum TumakerErrorCodeEnum {
    /********************Public error code********************/

    /**
     * 请求参数错误
     */
    request_parameter_error("01-00-0001", "request parameter error", "请求参数错误"),

    /**
     * 发送请求失败
     */
    send_request_failed("01-00-0003", "send request failed", "发送请求失败"),

    /**
     * 不合法
     */
    not_legal("01-00-0004", "not legal", "不合法"),

    /**
     * 解析json失败
     */
    parse_json_failed("01-00-0005", "parse json failed", "解析json失败"),

    /**
     * 系统错误
     */
    error("01-00-0006", "error", "系统错误"),

    /**
     * 不支持
     */
    not_support("01-00-0007", "not support", "不支持"),

    /**
     * 系统异常
     */
    exception("01-00-0008", "exception", "系统异常"),

    /**
     * 默认异常
     */
    default_exception("01-00-0009", "default_exception", "系统异常"),

    /**
     * 操作被拒绝
     */
    operation_rejected("01-00-0009", "Operation rejected", "操作被拒绝"),
    /**
     * 操作成功
     */
    success("01-00-0010", "success","操作成功"),

    /**
     * 系统异常
     */
    tr_exception("01-00-0011", "tr_exception", "tr服务内部异常"),
    /********************图构建********************/
    /********************图查询********************/
    /**
     * 图查询模版不存在
     */
    tu_query_template_not_exists("01-01-0001", "tu query template not exists", "图查询模版不存在"),
    /**
     * 不支持的查询引擎
     */
    tu_query_engine_not_support("01-01-0002", "tu query engine not support", "不支持的查询引擎"),

    /********************运维********************/
    ;
    /**
     * 错误码
     */
    private final String errorCode;
    /**
     * 错误码英文解释
     */
    private final String englishDesc;
    /**
     * 错误码中文解释
     */
    private final String chineseDesc;

    TumakerErrorCodeEnum(String errorCode, String englishDesc, String chineseDesc) {
        this.errorCode = errorCode;
        this.englishDesc = englishDesc;
        this.chineseDesc = chineseDesc;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getEnglishDesc() {
        return englishDesc;
    }

    public String getChineseDesc() {
        return chineseDesc;
    }
}
