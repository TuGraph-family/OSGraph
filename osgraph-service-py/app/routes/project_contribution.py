from flask import Blueprint, request, abort
from app.managers.project_contribution import ProjectContributionManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler
from typing import Dict, Any
import logging
from dataclasses import asdict

project_contribution_bp = Blueprint(
    "project_contribution", __name__, url_prefix="/api/graph"
)
logger = logging.getLogger(__name__)


class ProjectContributionController:
    def __init__(self):
        self.manager = ProjectContributionManager()

    def get_contribution_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception as e:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = ProjectContributionController()


@project_contribution_bp.route("/project-contribution", methods=["GET"])
def get_project_contribution():
    data = request.args.to_dict()
    response = controller.get_contribution_graph(data)
    return ResponseHandler.jsonify_response(response)
