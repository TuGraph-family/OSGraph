from abc import ABC, abstractmethod
from typing import List, Dict, Any, Callable, Union
from dataclasses import dataclass
from app.utils.custom_exceptions import InvalidUsage
from dotenv import load_dotenv
from app.dal.graph.tugraph import GraphClient
from app.models.system_graph import GraphService
import os

load_dotenv()


@dataclass
class FilterKey:
    key: str
    type: str
    default: Union[Callable[[], Any], Any]
    required: bool = False


@dataclass
class ServiceConfig:
    name: str
    comment: str
    inputTypes: List[str]
    filterKeys: List[FilterKey]

    def register_service(self) -> None:
        graph_name = os.getenv("TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME")
        client = GraphClient(graph_name)
        properties = {
            "name": self.name,
            "comment": self.comment,
            "input_types": ",".join(self.inputTypes),
            "filter_keys": ",".join(
                [f"{key.key}:{key.default}" for key in self.filterKeys]
            ),
        }
        service = GraphService(
            name=self.name,
            comment=self.comment,
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

    def validate_params(self, data: Dict[str, Any]) -> Dict[str, Any]:
        validated_filters: Dict[str, Any] = {}
        for input_type in self.inputTypes:
            if input_type not in data:
                raise InvalidUsage(f"Missing necessary parameter: {input_type}")
            validated_filters[input_type] = data[input_type]
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
