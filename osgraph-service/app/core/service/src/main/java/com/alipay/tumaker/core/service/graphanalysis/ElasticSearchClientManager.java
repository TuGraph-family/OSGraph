package com.alipay.tumaker.core.service.graphanalysis;

import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.FullTextQueryGithubRepoVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.IndexClientSearchException;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es.FullTextIndexNameEnum;
import org.springframework.beans.factory.InitializingBean;

import java.util.List;
import java.util.Map;

/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/18
 */
public interface ElasticSearchClientManager extends InitializingBean {
    // es 8.10 version query
    Result<List<FullTextQueryGithubRepoVO>> search(FullTextIndexNameEnum indexNameEnum, Map<String, String> searchKeyMap) throws  IndexClientSearchException;
}
