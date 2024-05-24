CREATE TABLE `tumaker_query_template` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `template` text DEFAULT NULL COMMENT '查询模版',
  `template_parameter` text DEFAULT NULL COMMENT '查询模版',
  `template_name` varchar(256) DEFAULT NULL COMMENT '模版名称',
  `template_type` varchar(256) DEFAULT NULL COMMENT '模版类型',
  `template_desc` varchar(256) DEFAULT NULL COMMENT '模版说明',
  `language_type` varchar(256) DEFAULT NULL COMMENT '语言类型',
  `template_query_type` varchar(256) DEFAULT NULL COMMENT '查询类型-语句模版/函数模版',
  `query_source` varchar(256) DEFAULT NULL COMMENT '查询数据源',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='查询模版表'
;