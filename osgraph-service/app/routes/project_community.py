import logging
from typing import Any, Dict

from flask import Blueprint, request

from app.managers.project_community import ProjectCommunityManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

project_community_bp = Blueprint("project_community", __name__, url_prefix="/api/graphs")
logger = logging.getLogger(__name__)


class ProjectCommunityController:
    def __init__(self):
        self.manager = ProjectCommunityManager()

    def get_community_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = ProjectCommunityController()


@project_community_bp.route("/project-community/<platform>/<path:remaining_path>", methods=["GET"])
def get_project_community(platform, remaining_path):
    data = request.args.to_dict()
    data["platform"]=platform
    data["path"]=remaining_path
    response = controller.get_community_graph(data)
    return ResponseHandler.jsonify_response(response)
