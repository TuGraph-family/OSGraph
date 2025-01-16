package com.alipay.tumaker.common.util.errorcode;
/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
public enum TugraphDBErrorCodeEnum {
    GDB_COMMON__UNKNOWN_ERROR("02-01-0000", "UNKNOWN ERROR", "未知错误", ""),
    GDB_COMMON_INVALID_ARGUMENT("02-01-0001", "COMMON: buf invalid argument", "参数不合法", "02-00-0001"),
    GDB_COMMON_NOT_SUPPORT("02-01-0002", "COMMON: not support", "不支持的语句类型", "02-02-0001"),
    GDB_COMMON_PARSE_ERROR("02-01-0003", "COMMON: parse error", "语法错误，请检查语法", "02-02-0004"),
    GDB_COMMON_RETURN_EXCEPTION("02-01-0004", "COMMON: tu_graph_db return exception", "tu_graph_db 返回数据异常", "02-02-0002"),
    GDB_COMMON_PARAMETER_NOT_MATCH("02-01-0005", "COMMON: parameter not match", "图查询模版查询参数不匹配", "02-02-0003"),
    ;
    /**
     * error code
     */
    private final String errorCode;
    /**
     * English explanation of error code
     */
    private final String englishDesc;
    /**
     * Error code Chinese explanation
     */
    private final String chineseDesc;
    /**
     * The errorcode of tugraphdb, -1 is not the error code of geabase
     */
    private final String tugraphDbErrorCode;

    TugraphDBErrorCodeEnum(String errorCode, String englishDesc, String chineseDesc, String tugraphDbErrorCode) {
        this.errorCode = errorCode;
        this.englishDesc = englishDesc;
        this.chineseDesc = chineseDesc;
        this.tugraphDbErrorCode = tugraphDbErrorCode;
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

    public String getTugraphDbErrorCode() {
        return tugraphDbErrorCode;
    }


    public static TugraphDBErrorCodeEnum getTugraphDbErrorCode(String errcode) {
        for (TugraphDBErrorCodeEnum value : TugraphDBErrorCodeEnum.values()) {
            if (value.getTugraphDbErrorCode().equals(errcode)) {
                return value;
            }
        }
        return GDB_COMMON__UNKNOWN_ERROR;
    }
}
