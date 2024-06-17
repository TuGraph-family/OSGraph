package com.alipay.tumaker.web.home.controller.app;

import com.alipay.sofa.runtime.api.annotation.SofaReference;
import com.alipay.tumaker.core.model.PersonLPageDto;
import com.alipay.tumaker.core.service.app.ApplicationTestManager;
import org.springframework.web.bind.annotation.*;

/**
 * @author 勇竹 (wenlonghu.hwl)
 * @version 0.0.2
 * @date 2024/02/05
 */
@RestController
public class ApplicationController {

    @SofaReference
    private ApplicationTestManager applicationTestManager;


    @PostMapping("/testGetData")
    @ResponseBody
    public PersonLPageDto testGetData(@RequestParam("index") int index,@RequestParam("pageSize") int pageSize){
        return applicationTestManager.getPersonLPage(index, pageSize);
    }
}
