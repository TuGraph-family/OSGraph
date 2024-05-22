package com.alipay.tumaker.spi.agent.ssh;

import com.alipay.tumaker.spi.agent.agent.core.AgentService;
import com.alipay.tumaker.spi.agent.agent.core.model.SingHostSyncResponse;
import com.alipay.tumaker.spi.core.model.properties.TumakerAgentProperties;
import com.alipay.tumaker.spi.core.model.vo.SpiResult;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
public class SshAgentServiceImpl implements AgentService {
    private static final String JSCH_CHANNEL_EXEC_TYPE = "exec";

    private static final String COMMAND_PREFIX = "cmd://";

    private Map<String, SpiResult<SingHostSyncResponse>> taskResult = new ConcurrentHashMap<>();

    private TumakerAgentProperties tumakerAgentProperties;

    private static final ThreadPoolExecutor  threadPool = new ThreadPoolExecutor(50, 100,
            20, TimeUnit.SECONDS, new LinkedBlockingDeque<>(100));


    public SshAgentServiceImpl(TumakerAgentProperties tumakerAgentProperties) {
        this.tumakerAgentProperties = tumakerAgentProperties;
        threadPool.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

    }
}
