package com.alipay.tumaker.web.home.handler.filter;

import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * @author Created by yuanxiaohua2013@gmail.com
 * @date 2024/3/26
 */
public class CrosFilter extends OncePerRequestFilter {
    private List<String> crosUrilist = Lists.newArrayList("/api/login","/api/logout");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean isNeedCros = crosUrilist.contains(request.getRequestURI());
        if ("OPTIONS".equals(request.getMethod())) {
            setCrosHeader(response, request);
            return;
        }
        if (isNeedCros) {
            setCrosHeader(response, request);
        }
        filterChain.doFilter(request, response);
    }

    private void setCrosHeader(HttpServletResponse response, HttpServletRequest request) {
        String origin = request.getHeader("origin");
        if (!StringUtils.isEmpty(origin) && origin.endsWith("/")) {
            origin = origin.substring(0, origin.length() - 1);
        }
        response.setHeader("Access-Control-Allow-Origin", StringUtils.isEmpty(origin) ? "*" : origin);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,HEAD,DELETE,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type,X-PINGOTHER,X-Requested-With,Origin,Accept,Authorization,Access-Control-Request-Method,Access-Control-Request-Headers");
        response.setHeader("Access-Control-Expose-Headers", "Content-Type");
    }
}
