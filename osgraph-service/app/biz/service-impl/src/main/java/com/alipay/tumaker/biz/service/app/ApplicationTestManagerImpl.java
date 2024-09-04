package com.alipay.tumaker.biz.service.app;

import com.alipay.sofa.runtime.api.annotation.SofaService;
import com.alipay.tumaker.common.dal.mysql.mapper.PersonLMapper;
import com.alipay.tumaker.common.dal.mysql.model.PersonLDO;
import com.alipay.tumaker.core.model.PersonLPageDto;
import com.alipay.tumaker.core.service.app.ApplicationTestManager;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * @author 勇竹 (wenlonghu.hwl)
 * @version 0.0.2
 * @date 2024/02/05
 */
@SofaService
@Service
public class ApplicationTestManagerImpl implements ApplicationTestManager{

    @Autowired
    private PersonLMapper personLMapper;

    @Override
    public PersonLPageDto getPersonLPage(int index, int pageSize) {
        QueryWrapper<PersonLDO> personLWrapper = new QueryWrapper<>(new PersonLDO());
        personLWrapper.orderByAsc("id");
        //new Page<>(第几页, 一页取多少条数据)
        Page<PersonLDO> personLDOPage = personLMapper.selectPage(new Page<>(index, pageSize), personLWrapper);
        long total = personLDOPage.getTotal();
        PersonLPageDto personLPageDto = new PersonLPageDto();
        personLPageDto.setTotalSize(total);
        personLPageDto.setIndex(index);
        personLPageDto.setPageSize(pageSize);
        personLPageDto.setData(personLDOPage.getRecords());
        return personLPageDto;
    }

    @Transactional("mysqlTransactionManager")
    @Override
    public void savePersonLTwo(PersonLDO personLDO1, PersonLDO personLDO2) {
        personLMapper.insert(personLDO1);
        personLMapper.insert(personLDO2);
    }
}
