import logging
from typing import Any, Dict

from flask import Blueprint, request

from app.managers.os_partner import OSPartnerManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

os_partner_bp = Blueprint("os_partner", __name__, url_prefix="/api/graphs")
logger = logging.getLogger(__name__)


class OSPartnerController:
    def __init__(self):
        self.manager = OSPartnerManager()

    def get_partner_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = OSPartnerController()


@os_partner_bp.route("/os-partner/<platform>", methods=["GET"])
def get_os_partner(platform):
    data = request.args.to_dict()
    response = controller.get_partner_graph(data, platform)
    return ResponseHandler.jsonify_response(response)
