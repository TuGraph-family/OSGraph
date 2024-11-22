import os
import json
import uuid
import logging
import time
import requests
from io import BytesIO
from flask import Blueprint, send_file, after_this_request, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import tempfile

render_graph_bp = Blueprint("render_graph", __name__, url_prefix="/api/graph")
logger = logging.getLogger(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RENDER_DIR = os.path.join(BASE_DIR, "../render")

os.makedirs(RENDER_DIR, exist_ok=True)

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

def generate_html_content(processed_data):
    nodes_json = json.dumps(processed_data["nodes"])
    edges_json = json.dumps(processed_data["edges"])

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>G6 Graph Example</title>
        <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.2.3/build/g6.js"></script>
        <style>
            html, body {{
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }}
            #container {{
                width: 100%;
                height: 100%;
            }}
        </style>
    </head>
    <body>
        <div id="container"></div>
        <script>
            const graph = new G6.Graph({{
                container: 'container',
                width: window.innerWidth,
                height: window.innerHeight,
                layout: {{
                    type: 'force',
                    animate: false,
                    onLayoutEnd: () => {{
                        window.layoutCompleted = true;
                    }}
                }},
                modes: {{
                    default: ['drag-node', 'zoom-canvas', 'drag-canvas'],
                }},
                defaultNode: {{
                    size: 50,
                    style: {{
                        fill: '#40a9ff',
                        stroke: '#096dd9',
                    }},
                }},
                defaultEdge: {{
                    style: {{
                        stroke: '#a3b1bf',
                    }},
                }},
            }});

            const data = {{
                nodes: {nodes_json},
                edges: {edges_json},
            }};
            graph.on('afterlayout', () => {{
                console.log('Layout completed');
                window.layoutCompleted = true;
            }});
            graph.data(data);
            graph.render();

            window.onresize = () => {{
                graph.changeSize(window.innerWidth, window.innerHeight);
            }};
            
        </script>
    </body>
    </html>
    """
    return html_content


@render_graph_bp.route("/render", methods=["GET"])
def render_graph():
    service = request.args.get('service')
    if not service:
        return jsonify({'error': 'Missing service parameter'}), 400

    query_params = request.args.to_dict()
    query_params.pop('service', None)  # 移除 `service` 参数

    base_url = f"http://localhost:8000/api/graph/{service}"
    query_string = "&".join([f"{key}={value}" for key, value in query_params.items()])
    target_url = f"{base_url}?{query_string}"
    data = get_graph_data(target_url=target_url)
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    service = Service("/Users/lipengfei/chromedriver-mac-x64/chromedriver")
    driver = webdriver.Chrome(service=service, options=options)

    html_content = generate_html_content(data)
    with tempfile.TemporaryDirectory(dir=RENDER_DIR) as temp_dir:
        unique_id = uuid.uuid4().hex
        html_file = os.path.join(temp_dir, f"graph_{unique_id}.html")
        with open(html_file, "w") as f:
            f.write(html_content)
        driver.get(f"file://{os.path.abspath(html_file)}")
        while True:
            layout_completed = driver.execute_script("return window.layoutCompleted || false;")
            if layout_completed:
                break
            time.sleep(0.1)
        screenshot = BytesIO()
        screenshot.write(driver.get_screenshot_as_png())
        screenshot.seek(0)
        driver.quit()
        if os.path.exists(html_file):
            os.remove(html_file)

        return send_file(screenshot, mimetype="image/png")
    

