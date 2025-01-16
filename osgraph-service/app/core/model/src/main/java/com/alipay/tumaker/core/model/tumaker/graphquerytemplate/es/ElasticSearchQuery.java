package com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es;

import lombok.Data;

import java.util.List;

@Data
public class ElasticSearchQuery {
    /**
     * Query template
     */
    private MatchPhrase query;
    /**
     * Query returns the number of rows
     */
    private int size = 10;
    /**
     * troubleshooting
     */
    private List<Object> sort;

}
