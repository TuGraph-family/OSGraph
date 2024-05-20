package com.alipay.tumaker.web.home.controller.graphanalysis;

import com.alipay.sofa.runtime.api.annotation.SofaReference;
import com.alipay.tumaker.common.facade.model.vo.analysis.AggregatedResultVO;
import com.alipay.tumaker.common.util.Result;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.FullTextQueryGithubRepoVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.QueryTemplateVO;
import com.alipay.tumaker.core.model.tumaker.graphquerytemplate.TuMakerExecuteTemplateRequest;
import com.alipay.tumaker.core.service.graphanalysis.TuMakerTemplateManager;
import com.alipay.tumaker.core.service.querytemplate.TuMakerQueryTemplateDataManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * @author Created by XiangChen
 * @date 2024/3/12 18:16
 */
@RestController
@RequestMapping("/api/template")
@CrossOrigin(origins = "*")
public class TuMakerTemplateController {

    @SofaReference
    private TuMakerTemplateManager tuMakerTemplateManager;
    @SofaReference
    private TuMakerQueryTemplateDataManager tuMakerQueryTemplateDataManager;

    /**
     * 执行查询模版
     * @param tuMakerExecuteTemplateRequest
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/executeQueryTemplate", method = RequestMethod.POST)
    public Result<AggregatedResultVO> executeQueryTemplate(@RequestBody TuMakerExecuteTemplateRequest tuMakerExecuteTemplateRequest,
                                               HttpServletRequest request, HttpServletResponse response) {
        return tuMakerTemplateManager.executeQueryTemplate(tuMakerExecuteTemplateRequest);
    }

    /**
     * 执行分享查询模版
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/executeShareQueryTemplate/{templateId}/{params}", method = RequestMethod.GET)
    public Result<AggregatedResultVO> executeShareQueryTemplate(@PathVariable(value = "templateId") Long templateId,
                                                           @PathVariable(value = "params") String params) {
        return tuMakerTemplateManager.executeShareQueryTemplate(templateId, params);
    }

    /**
     * 获取查询模版列表
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/listQueryTemplate", method = RequestMethod.GET)
    public Result<List<QueryTemplateVO>> listQueryTemplate() {
        return tuMakerQueryTemplateDataManager.listQueryTemplate();
    }

    /**
     * 全文查询
     * keyword:关键字
     * indexName：两个值：github_user, github_repo
     */
    @ResponseBody
    @RequestMapping(value = "/executeFullTextQuery", method = RequestMethod.POST)
    public Result<List<FullTextQueryGithubRepoVO>> executeFullTextQuery(@RequestParam(value = "keyword") String keyword,
                                                                        @RequestParam(value = "indexName") String indexName,
                                                                        HttpServletRequest request, HttpServletResponse response) {

        return tuMakerTemplateManager.executeFullTextQuery(keyword, indexName);
    }
}
