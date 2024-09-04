package com.alipay.tumaker.common.dal.jdbc.configuration;

import com.alibaba.druid.pool.DruidDataSource;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.*;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.annotation.Resource;

@Configuration
@MapperScan(basePackages = "com.alipay.tumaker.common.dal.mysql.mapper", sqlSessionFactoryRef = "mysqlSqlSessionFactory")
public class MysqlDatasourceConfig {

    @Value("${spring.datasource.mysql-datasource.mapperLocations}")
    private String mysqlMapperLocations;

    @Bean(name = "mysqlDatasource")
    @ConfigurationProperties(prefix = "spring.datasource.mysql-datasource")
    public DruidDataSource mysqlDatasource() {
        return new DruidDataSource();
    }

    @Resource(name = "mysqlDatasource")
    @Bean(name = "mysqlTransactionManager")
    public PlatformTransactionManager dataSourceTransactionManager(DruidDataSource mysqlDatasource) {
        return new DataSourceTransactionManager(mysqlDatasource);
    }

    @Bean(name = "mysqlSqlSessionFactory")
    @Primary
    public SqlSessionFactory mysqlSqlSessionFactory(DruidDataSource mysqlDatasource) throws Exception {
        MybatisSqlSessionFactoryBean factoryBean = new MybatisSqlSessionFactoryBean();
        factoryBean.setDataSource(mysqlDatasource);
        factoryBean.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources(mysqlMapperLocations)
        );
        //向Mybatis过滤器链中添加拦截器，分页插件
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        factoryBean.setPlugins(interceptor);
        return factoryBean.getObject();
    }

}
