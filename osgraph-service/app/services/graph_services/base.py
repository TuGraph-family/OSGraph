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
import os
import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Union

from dotenv import load_dotenv

from app.dal.graph.tugraph import GraphClient
from app.models.system_graph import GraphService
from app.utils.custom_exceptions import InvalidUsage

load_dotenv()


@dataclass
class FilterKey:
    key: str
    type: str
    default: Union[Callable[[], Any], Any]
    required: bool = False


@dataclass
class ServiceConfig:
    name_zh: str
    comment_zh: str
    name_en: str
    comment_en: str
    inputTypes: List[str]
    filterKeys: List[FilterKey]

    def register_service(self) -> None:
        TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME = os.getenv("TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME")
        TUGRAPHDB_SYSTEM_HOST = os.getenv("TUGRAPHDB_SYSTEM_HOST")
        TUGRAPHDB_SYSTEM_PORT = os.getenv("TUGRAPHDB_SYSTEM_PORT")
        TUGRAPHDB_SYSTEM_USER = os.getenv("TUGRAPHDB_SYSTEM_USER")
        TUGRAPHDB_SYSTEM_PASSWORD = os.getenv("TUGRAPHDB_SYSTEM_PASSWORD")

        client = GraphClient(
            host=TUGRAPHDB_SYSTEM_HOST,
            port=TUGRAPHDB_SYSTEM_PORT,
            user=TUGRAPHDB_SYSTEM_USER,
            password=TUGRAPHDB_SYSTEM_PASSWORD,
            graph_name=TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME
        )

        properties = {
            "id": uuid.uuid4(),
            "name_zh": self.name_zh,
            "comment_zh": self.comment_zh,
            "name_en": self.name_en,
            "comment_en": self.comment_en,
            "input_types": ";".join(self.inputTypes),
            "filter_keys": ";".join(
                [f"key:{key.key},type:{key.type},default:{key.default},required:{key.required}" for key in self.filterKeys]
            ),
        }
        service = GraphService(
            id=properties["id"],
            name_zh=properties["name_zh"],
            comment_zh=properties["comment_zh"],
            name_en=properties["name_en"],
            comment_en=properties["comment_en"],
            input_types=properties["input_types"],
            filter_keys=properties["filter_keys"],
        )
        client.upsert_vertex(GraphService.label, service.props)


class BaseService(ABC):
    def __init__(self, config: ServiceConfig):
        self.name: str = config.name
        self.comment: str = config.comment
        self.inputTypes: List[str] = config.inputTypes
        self.filterKeys: List[FilterKey] = config.filterKeys
        
        TUGRAPHDB_HOST = os.getenv("TUGRAPHDB_HOST")
        TUGRAPHDB_PORT = os.getenv("TUGRAPHDB_PORT")
        TUGRAPHDB_USER = os.getenv("TUGRAPHDB_USER")
        TUGRAPHDB_PASSWORD = os.getenv("TUGRAPHDB_PASSWORD")
        TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME = os.getenv("TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME")
        client = GraphClient(
            host=TUGRAPHDB_HOST,
            port=TUGRAPHDB_PORT,
            user=TUGRAPHDB_USER,
            password=TUGRAPHDB_PASSWORD,
            graph_name=TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME
        )
        self.graphClient = client

    def validate_params(self, data: Dict[str, Any]) -> Dict[str, Any]:
        validated_filters: Dict[str, Any] = {}
        if 'path' not in data:
            raise InvalidUsage(f"Missing necessary parameter: path")
        validated_filters['path'] = data['path']

        if 'platform' not in data:
                raise InvalidUsage(f"Missing necessary parameter: platform")
        validated_filters['platform'] = data['platform']   
        for filter_key in self.filterKeys:
            if filter_key.key not in data:
                if filter_key.required:
                    raise InvalidUsage(f"Missing required filter key: {filter_key.key}")
                value = (
                    filter_key.default()
                    if callable(filter_key.default)
                    else filter_key.default
                )
            else:
                value = data[filter_key.key]
            if filter_key.type == "int":
                try:
                    validated_filters[filter_key.key] = int(value)
                except ValueError:
                    raise InvalidUsage(
                        f"Invalid value for {filter_key.key}: must be an integer."
                    )
            elif filter_key.type == "str":
                validated_filters[filter_key.key] = str(value)
            else:
                validated_filters[filter_key.key] = value

        return validated_filters

    @abstractmethod
    def execute(self, data: Dict[str, Any]):
        pass
