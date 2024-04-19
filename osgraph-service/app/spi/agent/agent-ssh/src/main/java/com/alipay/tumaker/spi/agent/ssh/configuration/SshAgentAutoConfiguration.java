package com.alipay.tumaker.spi.agent.ssh.configuration;

import com.alipay.tumaker.spi.agent.ssh.SshAgentServiceImpl;
import com.alipay.tumaker.spi.core.model.properties.TumakerAgentProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(TumakerAgentProperties.class)
@ConditionalOnClass(TumakerAgentProperties.class)
@ConditionalOnProperty(name = "tumaker.agent.type", havingValue = "ssh")
public class SshAgentAutoConfiguration {
    private TumakerAgentProperties tumakerAgentProperties;

    public SshAgentAutoConfiguration(TumakerAgentProperties tumakerAgentProperties){
        this.tumakerAgentProperties = tumakerAgentProperties;
    }

    @Bean
    @ConditionalOnMissingBean
    public SshAgentServiceImpl agentService(){
        return new SshAgentServiceImpl(tumakerAgentProperties);
    }
}
