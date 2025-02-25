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
from dataclasses import asdict, field
from typing import List, Union
from app.utils.get_lang import get_language
from app.services.graph_list import GraphListService


class GraphListManager:
    def __init__(self) -> None:
        pass

    def get_graph_list(self) -> Union[List, None]:
        sort_order = [
            "project-contribution",
            "project-community",
            "project-ecosystem",
            "developer-activity",
            "os-partner",
            "os-interest"
        ]
        
        service = GraphListService()
        graph_list: List = []
        result = service.execute()
        lang = get_language()
        
        if result:
            for item in result:
                processed_item = {}
                for key, value in item["n"].items():
                    if key.endswith("_zh") or key.endswith("_en"):
                        base_key = key[:-3]
                        if lang == "en-US" and key.endswith("_en"):
                            processed_item[base_key] = value
                        elif lang == "zh-CN" and key.endswith("_zh"):
                            processed_item[base_key] = value
                    else:
                        processed_item[key] = value
                sorted_item = {
                    key: processed_item.get(key) for key in sort_order if key in processed_item
                }
                sorted_item.update({
                    key: value for key, value in processed_item.items() if key not in sort_order
                })
                
                graph_list.append(sorted_item)
            graph_list.sort(key=lambda x: sort_order.index(x["path"]) if x["path"] in sort_order else len(sort_order))
            return graph_list
        return None
