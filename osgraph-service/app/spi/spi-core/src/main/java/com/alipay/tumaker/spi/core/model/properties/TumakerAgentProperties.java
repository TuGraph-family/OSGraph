package com.alipay.tumaker.spi.core.model.properties;
import com.alipay.tumaker.spi.core.model.constants.SpiConstants;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
/**
 * @author (yuanxiaohua2013@gmail.com)
 * @date   2024/01/22
 * @version
 */
@ConfigurationProperties(prefix = TumakerAgentProperties.TUMAKER_AGENT_PROP_PREFIX)
@Data
public class TumakerAgentProperties {
    public static final String TUMAKER_AGENT_PROP_PREFIX = SpiConstants.TUMAKER_PROP_PREFIX + ".agent";

    private String type;

    /**
     * ssh
     */
    private String user;

    private String passwd;

    private Integer sshPort = 22;
}
