import logging
from typing import Any, Dict

from flask import Blueprint, request

from app.managers.project_ecology import ProjectEcologyManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

project_ecology_bp = Blueprint("project_ecology", __name__, url_prefix="/api/graph")
logger = logging.getLogger(__name__)


class ProjectEcologyController:
    def __init__(self):
        self.manager = ProjectEcologyManager()

    def get_ecology_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = ProjectEcologyController()


@project_ecology_bp.route("/project-ecology", methods=["GET"])
def get_project_ecology():
    data = request.args.to_dict()
    response = controller.get_ecology_graph(data)
    return ResponseHandler.jsonify_response(response)
