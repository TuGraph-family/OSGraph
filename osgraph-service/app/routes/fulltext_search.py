import logging
from typing import Any, Dict

from flask import Blueprint, request

from app.managers.fulltext_search import FulltextSearchManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

fulltext_search_bp = Blueprint("fulltext_search", __name__, url_prefix="/api/graphs")
logger = logging.getLogger(__name__)


class FulltextSearchController:
    def __init__(self):
        self.manager = FulltextSearchManager()

    def search(self, data) -> Dict[str, Any]:
        try:
            result = self.manager.search(data=data)
            return ResponseHandler.success(result)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = FulltextSearchController()


@fulltext_search_bp.route("/fulltext-search", methods=["GET"])
def get_os_interest():
    data = request.args.to_dict()
    response = controller.search(data)
    return ResponseHandler.jsonify_response(response)
