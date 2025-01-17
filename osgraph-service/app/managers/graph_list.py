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
# app/manager/graph_list.py
from typing import List, Union

from app.services.graph_list import GraphListService


class GraphListManager:
    def __init__(self) -> None:
        pass

    def get_graph_list(self) -> Union[List, None]:
        service = GraphListService()
        graph_list: List = []
        result = service.execute()
        if result:
            for item in result:
                graph_list.append(item["n"])
            return graph_list
        return None
