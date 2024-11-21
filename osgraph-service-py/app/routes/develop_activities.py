from flask import Blueprint, request, abort
from app.managers.develop_activities import DevelopActivitiesManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler
from typing import Dict, Any
import logging
from dataclasses import asdict

develop_activities_bp = Blueprint('project_activities', __name__, url_prefix='/api/graph')
logger = logging.getLogger(__name__)

class DevelopActivitiesController:
    def __init__(self):
        self.manager = DevelopActivitiesManager()

    def get_activities_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception as e:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)

controller = DevelopActivitiesController()

@develop_activities_bp.route('/develop-activities', methods=['GET'])
def get_project_activities():
    data = request.args.to_dict()
    response = controller.get_activities_graph(data)
    return ResponseHandler.jsonify_response(response)
