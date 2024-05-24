package com.alipay.tumaker.bootstrap;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportResource;

/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
@SpringBootApplication
@Slf4j
@ImportResource(locations = {"classpath*:META-INF/${antgraph.spring.location}/spring/*.xml"}, reader = XmlBeanDefinitionReader.class)
@ComponentScan(basePackages = {
		"com.alipay.tumaker.common.dal.jdbc.configuration",
		"com.alipay.tumaker.common.dal.mysql.mapper",
		"com.alipay.tumaker.core.service.app",
		"com.alipay.tumaker.core.service.common",
		"com.alipay.tumaker.core.service.graphanalysis",
		"com.alipay.tumaker.biz.service",
		"com.alipay.tumaker.biz.shared",
		"com.alipay.tumaker.web.home.controller",
		"com.alipay.tumaker.web.home.controller.app",
		"com.alipay.tumaker.shared.common",
		"com.alipay.tumaker.core.service",
		"com.alipay.tumakertugraphdb.*"})
public class TumakerApplication {

	public static void main(String[] args) {
		try {

			SpringApplication.run(TumakerApplication.class, args);
			log.info("SOFABoot Application Start!!!");
		} catch (Throwable e){
			log.error("SOFABoot Application Start Fail!!! More logs can be found on 1) logs/sofa-runtime/common-error.log"
					+ " 2) logs/spring/spring.log 3) logs/mvc/common-error.log 4) logs/health-check/common-error.log", e);
			throw e;
		}
	}

}
