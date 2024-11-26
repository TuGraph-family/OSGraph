import os
import json
import logging
import requests
from flask import Blueprint, send_file, request, jsonify
import subprocess
from io import BytesIO



render_graph_bp = Blueprint("render_graph", __name__, url_prefix="/api/graph")
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
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    node_script = os.path.join(parent_dir, "script", "g6_render.js")
    env = os.environ.copy()
    if not os.path.exists(node_script):
        raise FileNotFoundError(f"Node.js script not found at {node_script}")
    
    process = subprocess.Popen(
        ["node", node_script],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env
    )

    output, error = process.communicate(input=json.dumps(data).encode('utf-8'))
    if process.returncode != 0:
        return None, error.decode('utf-8')

    return BytesIO(output), None


@render_graph_bp.route("/render", methods=["GET"])
def render_graph():
    service = request.args.get('service')
    if not service:
        return jsonify({'error': 'Missing service parameter'}), 400

    query_params = request.args.to_dict()
    query_params.pop('service', None)
    base_url = f"http://localhost:8000/api/graph/{service}"
    query_string = "&".join([f"{key}={value}" for key, value in query_params.items()])
    target_url = f"{base_url}?{query_string}"

    graph_data = get_graph_data(target_url=target_url)

    output, error = render_graph_with_node(graph_data)
    if error:
        return jsonify({'error': 'Failed to render graph', 'details': error}), 500

    return send_file(output, mimetype="image/png")
    

