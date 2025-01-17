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

from app.managers.developer_activity import DevelopActivitiesManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

developer_activities_bp = Blueprint(
    "project_activities", __name__, url_prefix="/api/graphs"
)
logger = logging.getLogger(__name__)


class DeveloperActivitiesController:
    def __init__(self):
        self.manager = DevelopActivitiesManager()

    def get_activity_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)


controller = DeveloperActivitiesController()


@developer_activities_bp.route("/developer-activity/<platform>/<path:remaining_path>", methods=["GET"])
def get_developer_activity(platform, remaining_path):
    data = request.args.to_dict()
    data["platform"]=platform
    data["path"]=remaining_path
    response = controller.get_activity_graph(data)
    return ResponseHandler.jsonify_response(response)
