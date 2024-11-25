import os
import json
import logging
import requests
from flask import Blueprint, send_file, request, jsonify
import subprocess
from io import BytesIO


render_graph2_bp = Blueprint("render_graph2", __name__, url_prefix="/api/graph")
logger = logging.getLogger(__name__)

def get_graph_data(target_url:str)->dict:
    try:
        response = requests.get(target_url)
        response.raise_for_status()
        target_data = response.json()
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to fetch data', 'details': str(e)}), 500
    if "data" in target_data:
        graph_data = target_data["data"]
    else:
        return {'error': 'No data found in response'}, 400

    processed_data = process_graph_data(graph_data)

    return processed_data

def process_graph_data(graph_data):
    vertices = graph_data.get("vertices", [])
    edges = graph_data.get("edges", [])
    id_map = {}
    nodes = []
    for vertex in vertices:
        node_id = f"node{vertex['id']}"
        id_map[vertex['id']] = node_id
        nodes.append({
            "id": node_id,
            "label": vertex["name"] if vertex["name"] else f"Unnamed {vertex['id']}"
        })

    converted_edges = []
    for edge in edges:
        converted_edges.append({
            "source": id_map.get(edge["sid"], f"node{edge['sid']}"),
            "target": id_map.get(edge["tid"], f"node{edge['tid']}")
        })

    result = {
        "nodes": nodes,
        "edges": converted_edges
    }
    return result

def render_graph_with_node(data):
    # 调用 Node.js 脚本并通过管道传递数据
    node_script = "g6_render.js"  # Node.js 脚本路径
    process = subprocess.Popen(
        ["node", node_script],
        stdin=subprocess.PIPE,  # 启用标准输入管道
        stdout=subprocess.PIPE, # 启用标准输出管道
        stderr=subprocess.PIPE  # 启用标准错误管道
    )

    # 传递数据到 Node.js 的标准输入，并获取标准输出
    output, error = process.communicate(input=json.dumps(data).encode('utf-8'))
    if process.returncode != 0:
        return None, error.decode('utf-8')

    return BytesIO(output), None


@render_graph2_bp.route("/render2", methods=["GET"])
def render_graph():
    service = request.args.get('service')
    if not service:
        return jsonify({'error': 'Missing service parameter'}), 400

    # 构建目标 URL 和请求参数
    query_params = request.args.to_dict()
    query_params.pop('service', None)
    base_url = f"http://localhost:8000/api/graph/{service}"
    query_string = "&".join([f"{key}={value}" for key, value in query_params.items()])
    target_url = f"{base_url}?{query_string}"

    # 获取图数据
    graph_data = get_graph_data(target_url=target_url)

    # 调用 Node.js 脚本进行渲染
    output, error = render_graph_with_node(graph_data)
    if error:
        return jsonify({'error': 'Failed to render graph', 'details': error}), 500

    # 返回图像数据
    return send_file(output, mimetype="image/png")
    

