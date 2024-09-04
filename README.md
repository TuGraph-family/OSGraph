# OSGraph

![](docs/img/osgraph-cn.jpg)

> 🌐️ 中文 | [English](README-en.md)

**OSGraph (Open Source Graph)** 是一个开源图谱关系洞察工具，基于GitHub开源数据全域图谱，实现开发者行为、项目社区生态的分析洞察。可以为开发者、项目Owner、开源布道师、社区运营等提供简洁直观的开源数据视图，帮助你和你的项目制作专属的开源名片、寻求契合的开发伙伴、挖掘深度的社区价值。




## 产品地址

**[https://osgraph.com](https://osgraph.com)**


## 快速开始

本地启动测试请参考：[OSGraph部署文档](docs/zh-CN/DeveloperManual.md)


## 功能介绍

当前产品默认提供了6张开源数据图谱供大家体验，包含项目类图谱3个（贡献、生态、社区）、开发类3个（活动、伙伴、兴趣）。



### 项目贡献图谱

**发现项目核心贡献**：根据项目开发者研发活动信息（Issue、PR、Commit、CR等），找到项目核心贡献者。

**Q**：我想看看给Apache Spark项目写代码的都有谁？

**A**：选择“项目贡献图谱” - 搜索spark - 选择apache/spark。可以看到HyukjinKwon、dongjoon-hyun等核心贡献者，另外还一不小心捉到两个“显眼包”，AmplabJenkins、SparkQA这两个只参与CodeReview的机器人账号。

![](docs/img/spark-contrib.png)



### 项目生态图谱

**洞察项目生态伙伴**：提取项目间的开发活动、组织等关联信息，构建项目核心生态关系。

**Q**：最近很火的开源大模型Llama3周边生态大致是什么样的？

**A**：选择“项目生态图谱” - 搜索llama3 - 选择meta-llama3/llama3。可以看到pytorch、tensorflow、transformers等知名AI项目，当然还有上科技头条的llama.cpp。比较惊喜的发现是ray竟然和llama3有不少公共开发者，可以深度挖掘一下。

![](docs/img/llama3-eco.png)



### 项目社区图谱

**分析项目社区分布**：根据项目的开发活动、开发者组织等信息，提取项目核心开发者社区分布。

**Q**：大数据引擎Flink发展这么多年后的社区现状如何？

**A**：选择“项目社区图谱” - 搜索flink - 选择apache/flink。可以看到项目关注者主要来自中、美、德三国，而Alibaba组织是代码贡献的中坚力量。

![](docs/img/flink-comm.png)



### 开发活动图谱

**展示个人开源贡献**：根据开发者研发活动信息（Issue、PR、Commit、CR等），找到参与的核心项目。

**Q**：大神Linus Torvalds最近在参与哪些开源项目？

**A**：选择“开发活动图谱” - 搜索torvalds。果然linux项目是torvalds的主要工作，不过llvm、mody、libgit2也有所参与，同时也看到他在subsurface这种“潜水日志管理工具”上的大量贡献，果然大佬的爱好都很广泛。

![](docs/img/torvalds-act.png)



### 开源伙伴图谱

**寻找个人开源伙伴**：找到开发者在开源社区中，与之协作紧密的其他开发者。

**Q**：我想知道在开源社区有没有和我志同道合的人？

**A**：选择“开发伙伴图谱” - 搜索我的ID。让我震惊的是有那么多陌生人和我关注了同一批项目，这不得找机会认识一下，说不定就能找到新朋友了。而和我合作PR的人基本上都是我认识的朋友和同事，继续探索一下朋友们的开源伙伴，开源社区的“六度人脉”不就来了么。

![](docs/img/fanzhidongyzby-part.png)



### 开源兴趣图谱

**挖掘个人开源兴趣**：根据参与的项目主题、标签等信息，分析开发者技术领域与兴趣。

**Q**：GitHub上最活跃的开发者对什么技术感兴趣？

**A**：选择“开源兴趣图谱” - 搜索sindresorhus（[GitHub用户榜](https://gitstar-ranking.com) No.1）。整体来看sindresorhus对node、npm、js很感兴趣，另外他发起的awesome项目足足30W星，令人咋舌！当前的开源兴趣数据主要来自项目有限的标签信息，后续借助AI技术可能会有更好的展现。

![](docs/img/sindresorhus-intr.png)



## 未来规划

未来将会有更多有趣的图谱和功能加入到OSGraph：

* 简单灵活的API设计，让图谱无限扩展。
* 自由高效的画布交互，无限探索数据价值。
* 图谱URL支持嵌入Markdown，制作我的开源名片。
* 基于AI技术的项目主题标签分析。
* 多人多项目联合分析，图谱洞察一键可达。
* 更丰富的数据展示与多维分析。
* **更多功能，与你携手共建……**



欢迎大家提交Issue积极讨论，提供产品建议、反馈体验问题。



##  参与贡献

您可以直接提交GitHub Issue/PR对OSGraph反馈建议与功能改进，也可以通过下面的联系方式加入TuGraph社区群与我们直接沟通交流。


## 联系我们

![](docs/img/contacts-cn.png)



## 致谢

感谢 [X-Lab](https://github.com/X-lab2017?language=shell)、[AntV](https://antv.antgroup.com/)、[TuGraph](https://www.tugraph.tech/) 组织对本项目的大力支持！

