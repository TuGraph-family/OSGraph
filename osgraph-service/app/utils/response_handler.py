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
from typing import Any, Dict, Optional

from flask import jsonify

class ResponseHandler:
    @staticmethod
    def success(data: Any = None, message: str = "Success") -> Dict[str, Any]:
        return {"status": 0, "data": data, "message": message, "error": None}

    @staticmethod
    def error(
        message: str,
        status_code: int = 500,
        error_details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        return {"status": 1, "data": None, "message": message, "error": error_details}

    @staticmethod
    def jsonify_response(response: Dict[str, Any], status_code: int = 200):
        return jsonify(response), status_code
