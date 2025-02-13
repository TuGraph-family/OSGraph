#
# Copyright 2025 AntGroup CO., Ltd.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#
import os
import json
import logging
import requests
from flask import Blueprint, send_file, request, jsonify
import subprocess
from io import BytesIO
from app.utils.get_lang import get_language
from dotenv import load_dotenv

load_dotenv()

render_graph_bp = Blueprint("render_graph", __name__, url_prefix="/png/graphs")
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

    return graph_data

def process_graph_data(graph_data):
    vertices = graph_data.get("vertices", [])
    edges = graph_data.get("edges", [])
    nodes = []
    for vertex in vertices:
        node_id = f"{vertex['id']}"
        nodes.append({
            "id": node_id,
            "nodeType":vertex["type"],
            "label": vertex["name"] if vertex["name"] else f"Unnamed {vertex['id']}",
            "properties":{
                "name": vertex["name"] if vertex["name"] else f"Unnamed {vertex['id']}"
            }
        })

    converted_edges = []
    for edge in edges:
        converted_edges.append({
            "source": f'{edge["sid"]}',
            "target": f'{edge["tid"]}',
            "id":f'{edge["sid"]}_{edge["tid"]}_{edge["type"]}',
            "properties":{
                "count":edge.get('count',None)
            }
        })

    result = {
        "nodes": nodes,
        "edges": converted_edges
    }
    return result

def render_graph_with_node(data):
    lang = get_language()
    oneclip_url = os.getenv("ONECLIP_URL")
    if oneclip_url is None:
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
    else:
        context = {"width": 1000, "height": 600, "devicePixelRatio": 1}
        params = {
            # "assetId": asset_id,
            "lang":lang,
            "config": {
                "data":data
            },
            "output": "json",
            "context": context,
        }
        url = oneclip_url
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(params),
        )

        # Check the response
        if response.status_code != 200:
            logger.error(f"API request failed with status {response.status_code}")
            return None, f"Error: {res.status_code}" 
        else:
            res = requests.get(json.loads(response.text)['resultObj'])
            return BytesIO(res.content), None      


@render_graph_bp.route("/<graph>/<platform>/<path:remaining_path>", methods=["GET"])

def render_graph(graph, platform, remaining_path):
    if not graph:
        return jsonify({'error': 'Missing graph parameter'}), 400
    if not platform:
        return jsonify({'error': 'Missing platform parameter'}), 400
    if not remaining_path:
        return jsonify({'error': 'Missing path parameter'}), 400
    
    query_params = request.args.to_dict()
    query_params.pop('service', None)
    port = os.getenv('FLASK_PORT')
    base_url = f"http://localhost:{port}/api/graphs/{graph}/{platform}/{remaining_path}"
    query_string = "&".join([f"{key}={value}" for key, value in query_params.items()])
    target_url = f"{base_url}?{query_string}"


    graph_data = get_graph_data(target_url=target_url)

    output, error = render_graph_with_node(graph_data)
    if error:
        return jsonify({'error': 'Failed to render graph', 'details': error}), 500

    return send_file(output, mimetype="image/png")
 
    

