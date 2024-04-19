package com.alipay.tumaker.core.model.tumaker.graphquerytemplate;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class FullTextQueryGithubRepoVO extends FullTextQueryVO{
    /**
     * 关注数
     */
    Long star;
}
