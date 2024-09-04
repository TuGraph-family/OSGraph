package com.alipay.tumaker.dalgen.mybatisplus;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.builder.ConfigBuilder;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 勇竹 (wenlonghu.hwl)
 * @version 0.0.2
 * @date 2024/02/05
 */
public class TumakerFreemarkerTemplateEngine extends FreemarkerTemplateEngine {
    /**
     * 渲染对象 MAP 信息
     *
     * @param config    配置信息
     * @param tableInfo 表信息对象
     * @return ignore
     */
    @NotNull
    public Map<String, Object> getObjectMap(@NotNull ConfigBuilder config, @NotNull TableInfo tableInfo) {
        StrategyConfig strategyConfig = config.getStrategyConfig();
        Map<String, Object> controllerData = strategyConfig.controller().renderData(tableInfo);
        Map<String, Object> objectMap = new HashMap<>(controllerData);
        Map<String, Object> mapperData = strategyConfig.mapper().renderData(tableInfo);
        objectMap.putAll(mapperData);
        Map<String, Object> serviceData = strategyConfig.service().renderData(tableInfo);
        objectMap.putAll(serviceData);
        Map<String, Object> entityData = strategyConfig.entity().renderData(tableInfo);
        objectMap.putAll(entityData);
        objectMap.put("config", config);
        HashMap<String, String> packageInfo = new HashMap<>(config.getPackageConfig().getPackageInfo());
        packageInfo.put("Entity", config.getPackageConfig().getModuleName());
        packageInfo.put("Mapper", config.getPackageConfig().getMapper());
        objectMap.put("package", packageInfo);
        GlobalConfig globalConfig = config.getGlobalConfig();
        objectMap.put("author", globalConfig.getAuthor());
        objectMap.put("kotlin", globalConfig.isKotlin());
        objectMap.put("swagger", globalConfig.isSwagger());
        objectMap.put("springdoc", globalConfig.isSpringdoc());
        objectMap.put("date", globalConfig.getCommentDate());
        // 启用 schema 处理逻辑
        String schemaName = "";
        if (strategyConfig.isEnableSchema()) {
            // 存在 schemaName 设置拼接 . 组合表名
            schemaName = config.getDataSourceConfig().getSchemaName();
            if (StringUtils.isNotBlank(schemaName)) {
                schemaName += ".";
                tableInfo.setConvert(true);
            }
        }
        objectMap.put("schemaName", schemaName);
        objectMap.put("table", tableInfo);
        objectMap.put("entity", tableInfo.getEntityName()+"DO");
        return objectMap;
    }



    /**
     * 输出实体文件
     *
     * @param tableInfo 表信息
     * @param objectMap 渲染数据
     * @since 3.5.0
     */
    protected void outputEntity(@NotNull TableInfo tableInfo, @NotNull Map<String, Object> objectMap) {
        String entityName = tableInfo.getEntityName()+"DO";
        String entityPath = getConfigBuilder().getGlobalConfig().getOutputDir();
        if(entityPath.endsWith(File.separator)){
            entityPath = entityPath + getConfigBuilder().getPackageConfig().getModuleName().replace(".", File.separator);
        }else{
            entityPath = entityPath + File.separator + getConfigBuilder().getPackageConfig().getModuleName().replace(".", File.separator);
        }
        if (StringUtils.isNotBlank(entityName) && StringUtils.isNotBlank(entityPath)) {
            String finalEntityPath = entityPath;
            getTemplateFilePath(template -> template.getEntity(getConfigBuilder().getGlobalConfig().isKotlin())).ifPresent((entity) -> {
                String entityFile = String.format((finalEntityPath + File.separator + "%s" + suffixJavaOrKt()), entityName);
                outputFile(getOutputFile(entityFile, OutputFile.entity), objectMap, entity, getConfigBuilder().getStrategyConfig().entity().isFileOverride());
            });
        }
    }

    /**
     * 输出Mapper文件(含xml和Abstract.xml)
     *
     * @param tableInfo 表信息
     * @param objectMap 渲染数据
     * @since 3.5.0
     */
    protected void outputMapper(@NotNull TableInfo tableInfo, @NotNull Map<String, Object> objectMap) {
        // MpMapper.java
        String entityName = tableInfo.getEntityName()+"DO";
        String mapperPath = getConfigBuilder().getGlobalConfig().getOutputDir();
        if(mapperPath.endsWith(File.separator)){
            mapperPath = mapperPath + getConfigBuilder().getPackageConfig().getMapper().replace(".", File.separator);
        }else{
            mapperPath = mapperPath + File.separator + getConfigBuilder().getPackageConfig().getMapper().replace(".", File.separator);
        }
        if (StringUtils.isNotBlank(tableInfo.getMapperName()) && StringUtils.isNotBlank(mapperPath)) {
            String finalMapperPath = mapperPath;
            getTemplateFilePath(TemplateConfig::getMapper).ifPresent(mapper -> {
                String mapperFile = String.format((finalMapperPath + File.separator + tableInfo.getMapperName() + suffixJavaOrKt()), entityName);
                outputFile(getOutputFile(mapperFile, OutputFile.mapper), objectMap, mapper, false);
            });
        }

        // MpMapperAbstract.xml
        String xmlPath = getPathInfo(OutputFile.xml);
        objectMap.put("baseResultMap",true);
        objectMap.put("baseColumnList",true);
        if (StringUtils.isNotBlank(tableInfo.getXmlName()) && StringUtils.isNotBlank(xmlPath)) {
            getTemplateFilePath(TemplateConfig::getXml).ifPresent(xml -> {
                String xmlFile = String.format((xmlPath + File.separator + tableInfo.getXmlName() +"Abstract" + ConstVal.XML_SUFFIX), entityName);
                outputFile(getOutputFile(xmlFile, OutputFile.xml), objectMap, xml, true);
            });
        }

        // MpMapper.xml
        objectMap.put("baseResultMap",false);
        objectMap.put("baseColumnList",false);
        if (StringUtils.isNotBlank(tableInfo.getXmlName()) && StringUtils.isNotBlank(xmlPath)) {
            getTemplateFilePath(TemplateConfig::getXml).ifPresent(xml -> {
                String xmlFile = String.format((xmlPath + File.separator + tableInfo.getXmlName() + ConstVal.XML_SUFFIX), entityName);
                outputFile(getOutputFile(xmlFile, OutputFile.xml), objectMap, xml, false);
            });
        }
    }

    protected void outputService(@NotNull TableInfo tableInfo, @NotNull Map<String, Object> objectMap) {
        // 屏蔽service
    }

    protected void outputController(@NotNull TableInfo tableInfo, @NotNull Map<String, Object> objectMap) {
        // 屏蔽controller
    }

    public void open() {
        // 屏蔽生成代码后代码目录
    }
}
