def get_graph_summary_prompt(graph_data: dict) -> str:
    """
    构建用于知识图谱分析的提示词。

    :param graph_data: 图数据，格式为包含 'vertices' 和 'edges' 的字典。
    :return: 构造好的提示词。
    """
    template = (
        "你是一个图数据分析专家，请根据这张知识图谱进行总结：\n\n"
        "知识图数据如下：\n'{graph}'\n\n"
        "请你分析以下内容：\n"
        "1. 图的整体结构是什么？\n"
        "2. 图中最重要的节点是什么？为什么？\n"
        "3. 图中是否有明显的社区或分组？如果有，简要描述。\n"
        "4. 总结图的主要特征和潜在意义。"
    )
    graph_string = f"vertices: {graph_data.get('vertices', [])}, edges: {graph_data.get('edges', [])}"
    return template.replace("{graph}", graph_string)