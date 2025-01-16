package com.alipay.tumaker.dalgen.mybatisplus;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.po.TableField;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.type.TypeRegistry;
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

/**
 * @author 勇竹 (wenlonghu.hwl)
 * @version 0.0.2
 * @date 2024/02/05
 */
public class MybatisPlusGeneratorRunner {

    public static void main(String[] args) throws Exception {
        HashMap hashMap = new Yaml().loadAs(new FileInputStream(System.getProperty("user.dir") + "/dalgen/mybatis-plus-gen/src/main/resources/delgen.yml"), HashMap.class);
        String url = hashMap.get("url").toString().trim();
        String username = hashMap.get("username").toString().trim();
        String password = hashMap.get("password").toString().trim();
        List<String> tableList = (ArrayList<String>)hashMap.get("tableList");

        FastAutoGenerator fastAutoGenerator = FastAutoGenerator.create(url, username, password)
                .globalConfig(builder -> {
                    builder.author("dalgen-mybatisplus"); // Set author
                    builder.outputDir(System.getProperty("user.dir") + "/app/common/dal/dal-core/src/main/java/"); // Specify output directory
                })
                .dataSourceConfig(builder -> builder.typeConvertHandler((globalConfig, typeRegistry, metaInfo) -> {
                    return getColumnType(typeRegistry, metaInfo);
                }))
                .packageConfig(builder -> {
                    builder.moduleName("com.alipay.tumaker.common.dal.mysql.model");
                    builder.mapper("com.alipay.tumaker.common.dal.mysql.mapper");
                    builder.pathInfo(Collections.singletonMap(OutputFile.xml,
                            System.getProperty("user.dir") + "/app/common/dal/dal-core/src/main/resources/mybatis/com/alipay/tumaker/common/dal/mysql/mapper")); // Set mapperXml generation path
                })
                .strategyConfig(builder -> {
                    builder.entityBuilder().enableFileOverride().idType(IdType.NONE);
                    tableList.forEach(builder::addInclude);
                })
                .templateEngine(new TumakerFreemarkerTemplateEngine());
        fastAutoGenerator.execute();
    }

    private static IColumnType getColumnType(TypeRegistry typeRegistry, TableField.MetaInfo metaInfo){
        int typeCode = metaInfo.getJdbcType().TYPE_CODE;
        if (typeCode == Types.DATE) {
            return DbColumnType.DATE;
        }
        if (typeCode == Types.TIMESTAMP) {
            return DbColumnType.DATE;
        }
        if (typeCode == Types.DECIMAL) {
            return DbColumnType.LONG;
        }
        if (typeCode == Types.BIT) {
            return DbColumnType.INTEGER;
        }
        if (typeCode == Types.SMALLINT) {
            return DbColumnType.INTEGER;
        }
        return typeRegistry.getColumnType(metaInfo);
    }
}
