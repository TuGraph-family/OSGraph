from flask import Blueprint, request, abort
from app.managers.os_interest import OSInterestManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler
from typing import Dict, Any
import logging
from dataclasses import asdict

os_interest_bp = Blueprint('os_interest', __name__, url_prefix='/api/graph')
logger = logging.getLogger(__name__)

class OSInterestController:
    def __init__(self):
        self.manager = OSInterestManager()

    def get_interest_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        获取项目贡献的图数据
        """
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception as e:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)

controller = OSInterestController()

@os_interest_bp.route('/os-interest', methods=['GET'])
def get_os_interest():
    """
    获取项目贡献的图谱
    """
    data = request.args.to_dict()
    response = controller.get_interest_graph(data)
    return ResponseHandler.jsonify_response(response)
