package com.alipay.tumaker.core.service.app;

import com.alipay.tumaker.common.dal.mysql.model.PersonLDO;
import com.alipay.tumaker.core.model.PersonLPageDto;

/**
 * @author 勇竹 (wenlonghu.hwl)
 * @version 0.0.2
 * @date 2024/02/05
 */
public interface ApplicationTestManager {

    public PersonLPageDto getPersonLPage(int index, int pageSize);

    public void savePersonLTwo(PersonLDO personLDO1, PersonLDO personLDO2);
}
