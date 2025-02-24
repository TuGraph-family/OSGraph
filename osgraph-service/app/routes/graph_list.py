#
# Copyright 2025 AntGroup CO., Ltd.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#
import logging
from typing import Any, Dict

from flask import Blueprint, request

from app.managers.graph_list import GraphListManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

graph_list_bp = Blueprint("graph_list", __name__, url_prefix="/api/graphs")
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
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = OSInterestController()


@graph_list_bp.route("/list", methods=["GET"])
def get_os_interest():
    response = controller.get_graph_list()
    return ResponseHandler.jsonify_response(response)
