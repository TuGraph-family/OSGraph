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
# app/models/system_graph.py
from dataclasses import dataclass


@dataclass
class GraphServiceProps:
    id:str = ""
    name_zh: str = ""
    name_en: str = ""
    comment_zh: str = ""
    comment_en: str = ""
    input_types: str = ""
    filter_keys: str = ""


class GraphService:
    label: str = "graph_service"
    primary: str = "id"
    type: str = "VERTEX"
    props: GraphServiceProps = GraphServiceProps()

    def __init__(self,id:str, name_zh: str, comment_zh: str,name_en: str, comment_en: str, input_types: str, filter_keys: str):
        self.props = GraphServiceProps(
            id = id, name_zh=name_zh, comment_zh=comment_zh,name_en=name_en, comment_en=comment_en, input_types=input_types, filter_keys=filter_keys
        )

    def __repr__(self):
        return (
            f"{self.__class__.__name__}("
            f"label={self.label}, "
            f"primary={self.primary}, "
            f"props={self.props})"
        )


@dataclass
class TraceApiProps:
    id:str = ""
    timestamp: str = ""
    endpoint: str = ""
    status_code: str = ""
    response_time: str = ""
    ip_address: str = ""
    user_agent: str = ""
    query_params: str = ""


class TraceApi:
    label: str = "trace_api"
    primary: str = "id"
    type: str = "VERTEX"
    props: TraceApiProps = TraceApiProps()

    def __init__(self, id: str, timestamp: str, endpoint: str, status_code: str, response_time: str, ip_address: str, user_agent: str, query_params: str ):
        self.props = TraceApiProps(
            id = id, 
            timestamp=timestamp, 
            endpoint=endpoint,
            status_code=status_code, 
            response_time=response_time, 
            ip_address=ip_address, 
            user_agent=user_agent,
            query_params=query_params
        )

    def __repr__(self):
        return (
            f"{self.__class__.__name__}("
            f"label={self.label}, "
            f"primary={self.primary}, "
            f"props={self.props})"
        )

