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
    name: str = ""
    comment: str = ""
    input_types: str = ""
    filter_keys: str = ""


class GraphService:
    label: str = "graph_service"
    primary: str = "name"
    type: str = "VERTEX"
    props: GraphServiceProps = GraphServiceProps()

    def __init__(self, name: str, comment: str, input_types: str, filter_keys: str):
        self.props = GraphServiceProps(
            name=name, comment=comment, input_types=input_types, filter_keys=filter_keys
        )

    def __repr__(self):
        return (
            f"{self.__class__.__name__}("
            f"label={self.label}, "
            f"primary={self.primary}, "
            f"props={self.props})"
        )
