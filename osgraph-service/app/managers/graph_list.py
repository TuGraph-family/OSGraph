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
