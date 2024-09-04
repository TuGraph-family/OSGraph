package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;
/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/18
 */
public class IndexClientSearchException extends Exception {
    public IndexClientSearchException(String cause){
        super(cause);
    }

    public IndexClientSearchException(Throwable t){
        super(t);
    }

    public IndexClientSearchException(String cause, Throwable t){
        super(cause, t);
    }

}
