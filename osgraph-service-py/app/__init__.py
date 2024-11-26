# app/__init__.py
import importlib
import os
from typing import Type, Union

from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory

from app.dal.graph.tugraph import GraphClient, GraphLabel, LabelProps
from app.models.system_graph import GraphService
from app.services import register_all_services

from .utils.custom_exceptions import InvalidUsage
from .utils.logger import setup_logger

load_dotenv()


def create_app(
    config_class: Union[str, Type[object]] = "config.ProductionConfig"
) -> Flask:
    static_folder_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../static")
    app = Flask(__name__,static_folder=static_folder_path)
    @app.route('/')
    def serve_index():
        return send_from_directory(app.static_folder, 'index.html')
    @app.route('/<path:filename>')
    def serve_static(filename):
        try:
            return send_from_directory(app.static_folder, filename)
        except:
            return send_from_directory(app.static_folder, 'index.html')
    
    app.config.from_object(config_class)
    setup_logger(app)
    register_blueprints(app)
    with app.app_context():
        initialize_system_graph(app)
        register_all_services()
    register_error_handlers(app)
    return app


def register_blueprints(app: Flask, blueprint_folder: str = "routes") -> None:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    blueprints_path = os.path.join(current_dir, blueprint_folder)
    for filename in os.listdir(blueprints_path):
        if filename.endswith(".py") and filename != "__init__.py":
            module_name = filename[:-3]
            module_path = f"app.{blueprint_folder}.{module_name}"
            module = importlib.import_module(module_path)
            for attr_name in dir(module):
                if attr_name.endswith("_bp"):
                    blueprint = getattr(module, attr_name)
                    if hasattr(blueprint, "name") and hasattr(blueprint, "url_prefix"):
                        app.register_blueprint(blueprint)


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        app.logger.error(f"InvalidUsage: {error.message}")
        return response

    @app.errorhandler(404)
    def not_found(error):
        app.logger.warning("404 Not Found")
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error("Internal Server Error")
        return jsonify({"message": "Internal server error"}), 500


def initialize_system_graph(app: Flask):
    """
    初始化 system_graph 和 graph_service 的基础库表。
    """
    graph_name = os.getenv("TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME")
    client = GraphClient(graph_name)

    try:
        system_graph = client.get_graph()
        if system_graph:
            app.logger.info("system_graph 图已存在")
        else:
            client.create_graph()
            app.logger.info("system_graph 图已创建")
        graph_service = client.get_label("vertex", "graph_service")
        if graph_service:
            app.logger.info("graph_service Label 已存在")
        else:
            label = GraphLabel(
                label=GraphService.label,
                primary=GraphService.primary,
                type=GraphService.type,
                properties=[
                    LabelProps(name=key, type="string", optional=True)
                    for key in (
                        GraphService.props.keys()
                        if isinstance(GraphService.props, dict)
                        else dir(GraphService.props)
                    )
                    if not key.startswith("_")
                ],
            )
            client.create_label(label)
            app.logger.info("graph_service Label 已创建")
    except Exception as e:
        app.logger.error(f"初始化 system_graph 失败: {str(e)}")
    finally:
        client.close()
