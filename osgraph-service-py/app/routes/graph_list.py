from flask import Blueprint
from app.managers.graph_list import GraphListManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler
from typing import Dict, Any
import logging
from dataclasses import asdict

graph_list_bp = Blueprint("graph_list", __name__, url_prefix="/api/graph")
logger = logging.getLogger(__name__)


class OSInterestController:
    def __init__(self):
        self.manager = GraphListManager()

    def get_graph_list(self) -> Dict[str, Any]:
        try:
            result = self.manager.get_graph_list()
            return ResponseHandler.success(result)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception as e:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = OSInterestController()


@graph_list_bp.route("/list", methods=["GET"])
def get_os_interest():
    response = controller.get_graph_list()
    return ResponseHandler.jsonify_response(response)
