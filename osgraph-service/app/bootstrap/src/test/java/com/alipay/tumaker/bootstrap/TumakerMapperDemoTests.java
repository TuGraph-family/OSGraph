package com.alipay.tumaker.bootstrap;

import com.alipay.sofa.runtime.api.annotation.SofaReference;
import com.alipay.tumaker.common.dal.mysql.mapper.PersonLMapper;
import com.alipay.tumaker.common.dal.mysql.model.PersonLDO;
import com.alipay.tumaker.core.service.app.ApplicationTestManager;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.ChainWrappers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class TumakerMapperDemoTests {

	@Test
	void contextLoads() {
	}

	@Autowired
	private PersonLMapper personLMapper;
	@SofaReference
	private ApplicationTestManager applicationTestManager;

	@Test
	public void mapperDemo(){
		// 数据插入
		PersonLDO insertPersonLDO1 = new PersonLDO();
		insertPersonLDO1.setName("张三");
		insertPersonLDO1.setRole(Byte.valueOf("1"));
		PersonLDO insertPersonLDO2 = new PersonLDO();
		insertPersonLDO2.setName("张三");
		insertPersonLDO2.setRole(Byte.valueOf("1"));
		applicationTestManager.savePersonLTwo(insertPersonLDO1, insertPersonLDO2);
		System.out.println(insertPersonLDO1.getId());
		System.out.println(insertPersonLDO2.getId());

		// 数据查询1
		//QueryWrapper<PersonLDO> personLDOQueryWrapper = new QueryWrapper<>(PersonLDO.class);
		QueryWrapper<PersonLDO> personLDOQueryWrapper = Wrappers.query(PersonLDO.class);
		personLDOQueryWrapper.eq("id", insertPersonLDO1.getId());
		PersonLDO personLDO1 = personLMapper.selectOne(personLDOQueryWrapper);
		System.out.println("personLDO1:" + personLDO1);

		// 数据查询2
		//LambdaQueryWrapper<PersonLDO> personLDOLambdaQueryWrapper = new LambdaQueryWrapper<>(PersonLDO.class);
		LambdaQueryWrapper<PersonLDO> personLDOLambdaQueryWrapper = Wrappers.lambdaQuery(PersonLDO.class);
		personLDOLambdaQueryWrapper.eq(PersonLDO::getId, insertPersonLDO2.getId());
		PersonLDO personLDO2 = personLMapper.selectOne(personLDOLambdaQueryWrapper);
		System.out.println("personLDO2:" + personLDO2);

		// 数据查询3
		//LambdaQueryChainWrapper<PersonLDO> personLDOLambdaQueryChainWrapper1 = new LambdaQueryChainWrapper<>(PersonLDO.class);
		//LambdaQueryChainWrapper<PersonLDO> personLDOLambdaQueryChainWrapper = ChainWrappers.lambdaQueryChain(personLMapper);
		LambdaQueryChainWrapper<PersonLDO> personLDOLambdaQueryChainWrapper = ChainWrappers.lambdaQueryChain(PersonLDO.class);
		personLDOLambdaQueryChainWrapper.eq(PersonLDO::getId, insertPersonLDO2.getId());
		PersonLDO personLDO3 = personLDOLambdaQueryChainWrapper.one();
		System.out.println("personLDO3:" + personLDO3);

		// 数据查询4 分页查询
		//new Page<>(第几页, 一页取多少条数据)
		LambdaQueryWrapper<PersonLDO> personLDOLambdaQueryWrapper4 = Wrappers.lambdaQuery(PersonLDO.class);
		personLDOLambdaQueryWrapper4.eq(PersonLDO::getId, insertPersonLDO1.getId());
		personLDOLambdaQueryWrapper4.or().eq(PersonLDO::getId, insertPersonLDO2.getId());
		Page<PersonLDO> personLDOPage4 = personLMapper.selectPage(new Page<>(1, 20), personLDOLambdaQueryWrapper4);
		List<PersonLDO> records4 = personLDOPage4.getRecords();
		System.out.println("personLDO4:" + personLDOPage4.getTotal());

		// 数据查询5 分页查询
		//new Page<>(第几页, 一页取多少条数据)
		LambdaQueryChainWrapper<PersonLDO> personLDOLambdaQueryChainWrapper5 = ChainWrappers.lambdaQueryChain(PersonLDO.class);
		Page<PersonLDO> personLDO5 = personLDOLambdaQueryChainWrapper5.page(new Page<>(1, 20));
		List<PersonLDO> records5 = personLDO5.getRecords();
		System.out.println("personLDO5:" + personLDO5.getTotal());

		// 数据更新1
		PersonLDO updatePersonLDO1 = new PersonLDO();
		updatePersonLDO1.setId(insertPersonLDO1.getId());
		UpdateWrapper<PersonLDO> update = Wrappers.update(updatePersonLDO1);
		update.set("name", "张三2");
		personLMapper.update(update);

		// 数据更新2
		UpdateWrapper<PersonLDO> update2 = Wrappers.update();
		update2.eq("id", insertPersonLDO1.getId());
		PersonLDO updatePersonLDO2 = new PersonLDO();
		updatePersonLDO2.setName("张三3");
		personLMapper.update(updatePersonLDO2, update2);

		// 数据更新3
		LambdaUpdateWrapper<PersonLDO> personLDOLambdaUpdateWrapper3 = Wrappers.lambdaUpdate(PersonLDO.class);
		personLDOLambdaUpdateWrapper3.setEntity(updatePersonLDO1);
		personLDOLambdaUpdateWrapper3.set(PersonLDO::getName, "张三4");
		personLMapper.update(personLDOLambdaUpdateWrapper3);

		// 数据更新3
		LambdaUpdateWrapper<PersonLDO> personLDOLambdaUpdateWrapper4 = Wrappers.lambdaUpdate(PersonLDO.class);
		personLDOLambdaUpdateWrapper4.eq(PersonLDO::getId, insertPersonLDO2.getId());
		personLDOLambdaUpdateWrapper4.set(PersonLDO::getName, "张三4");
		personLMapper.update(personLDOLambdaUpdateWrapper4);

		// 数据删除 1
		PersonLDO deletePersonLDO = new PersonLDO();
		deletePersonLDO.setId(insertPersonLDO1.getId());
		personLMapper.deleteById(deletePersonLDO);

		// 数据删除 2
		LambdaQueryWrapper<PersonLDO> personLDOLambdaQueryWrapper1 = Wrappers.lambdaQuery(PersonLDO.class);
		personLDOLambdaQueryWrapper1.eq(PersonLDO::getId, insertPersonLDO2.getId());
		personLMapper.delete(personLDOLambdaQueryWrapper1);
	}

}
