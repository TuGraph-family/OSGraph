package com.alipay.tumaker.biz.service.graphanalysis;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.*;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchPhraseQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.common.util.errorcode.TumakerErrorCodeEnum;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.FullTextQueryGithubRepoVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.IndexClientSearchException;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.es.FullTextIndexNameEnum;
import com.alipay.tumaker.core.service.common.PlatformConfigManager;
import com.alipay.tumaker.core.service.graphanalysis.ElasticSearchClientManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@SofaService
@Service
@Slf4j
public class ElasticSearchClientManagerImpl implements ElasticSearchClientManager {

    @Autowired
    PlatformConfigManager platformConfigManager;

    private final static String SERVER_URL_SPLIT = ",";
    public final static String esIndexBodyNameTag = "name";
    public final static String esIndexBodyIdTag = "id";
    public final static String esIndexBodyStarTag = "star";
    public final static String esIndexBodySortDescTag = "desc";
    private ElasticsearchClient  esClient;

    @Override
    public void afterPropertiesSet() throws Exception {
        String serverUrl = platformConfigManager.getEsServerUrl();
        String esServerUsername = platformConfigManager.getEsServerUsername();
        String esServerPassword = platformConfigManager.getEsServerPassword();
        log.info("serverUrl={}", serverUrl);

        // es 8.9 初始化链接
        /*RestClient restClient = RestClient
                .builder(HttpHost.create(serverUrl))
                .build();*/
        //加认证
/*        RestClient restClient=RestClient
                .builder(HttpHost.create(serverUrl))
                .setDefaultHeaders(new Header[]{
                        new BasicHeader("Authorization", "ApiKey " + apiKey)
                })
                .build();*/
        CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(
                AuthScope.ANY,
                new UsernamePasswordCredentials(esServerUsername, esServerPassword));
        RestClient restClient = RestClient
                .builder(HttpHost.create(serverUrl))
                .setHttpClientConfigCallback(httpClientBuilder -> {
                    httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider);
                    return httpClientBuilder;
                }).build();

        ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
        this.esClient = new ElasticsearchClient(transport);

        log.info("init ElasticSearchClientProxy success, serverUrl:{}", serverUrl);
    }

    @Override
    public Result<List<FullTextQueryGithubRepoVO>> search(FullTextIndexNameEnum indexNameEnum, Map<String, String> searchKeyMap) throws  IndexClientSearchException{

        List<FullTextQueryGithubRepoVO>  fullTextQueryVOList = new ArrayList<>();

        MatchPhraseQuery matchPhraseQuery = new MatchPhraseQuery.Builder()
                .field(esIndexBodyNameTag).query(searchKeyMap.get(esIndexBodyNameTag)).slop(10).build();

        // 添加排序条件，按 "sort_field" 字段升序排序
        List<SortOptions> sortOptionsList = new ArrayList<>();
        SortOptions sortOptions = new SortOptions.Builder()
                .field(f -> f.field(esIndexBodyStarTag).order(SortOrder.Desc))
                .build();

        sortOptionsList.add(sortOptions);

        SearchRequest searchRequest;
        try {
            // 创建一个匹配所有文档的搜索请求
            if(indexNameEnum == FullTextIndexNameEnum.github_repo) {
                 searchRequest = new SearchRequest.Builder()
                        .index(indexNameEnum.getIndexName())
                        .query(q -> q.matchPhrase(matchPhraseQuery))
                        .sort(sortOptionsList)
                        .build();
            } else {
                 searchRequest = new SearchRequest.Builder()
                        .index(indexNameEnum.getIndexName())
                        .query(q -> q.matchPhrase(matchPhraseQuery))
                        .build();
            }


            // 执行搜索请求
            log.info("start esclient search");

            SearchResponse<FullTextQueryGithubRepoVO> searchResponse = this.esClient.search(searchRequest, FullTextQueryGithubRepoVO.class);
            //输出结果
            for(Hit hit: searchResponse.hits().hits()){
                FullTextQueryGithubRepoVO fullTextQueryVO = (FullTextQueryGithubRepoVO) hit.source();
                fullTextQueryVOList.add(fullTextQueryVO);
            }

            return Result.success(fullTextQueryVOList);
        } catch (ElasticsearchException | IOException e) {
            log.error("query es Exception:", e);
        }

        return Result.failed(TumakerErrorCodeEnum.error,"transfer searchResponse to FullTextQueryVO error");
    }

}
