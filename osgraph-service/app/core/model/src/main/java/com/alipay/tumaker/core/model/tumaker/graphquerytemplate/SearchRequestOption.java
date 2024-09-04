package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;
/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/18
 */
public class SearchRequestOption {
    public static final SearchRequestOption DEFAULT_OPTION = newBuilder().build();

    private final int timeoutMs;

    public static Builder newBuilder(){
        return new Builder();
    }

    private SearchRequestOption(SearchRequestOption.Builder builder) {
        this.timeoutMs = builder.timeoutMs;
    }

    public int getTimeoutMs() {
        return timeoutMs;
    }

    public static class Builder {

        private int timeoutMs = 5000;

        public SearchRequestOption.Builder timeoutMs(int timeoutMs) {
            this.timeoutMs = timeoutMs;
            return this;
        }

        public SearchRequestOption build() {
            return new SearchRequestOption(this);
        }
    }
}
