# app/models/system_graph.py
from dataclasses import dataclass
from typing import Optional


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
    props: Optional[GraphServiceProps] = None

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
