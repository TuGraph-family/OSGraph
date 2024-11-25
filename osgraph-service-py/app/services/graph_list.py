import os
from typing import Any

from dotenv import load_dotenv

from app.dal.graph.tugraph import GraphClient
from app.utils.custom_exceptions import InvalidUsage

load_dotenv()


class GraphListService:
    def execute(self)->Any:
        graph_name = os.getenv("TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME")
        if not graph_name:
            raise InvalidUsage("Environment variable is missing")
        try:
            client = GraphClient(graph_name=graph_name)
            result = client.run("MATCH (n:graph_service) RETURN n")
            return result
        except Exception as e:
            raise InvalidUsage(f"GraphClient error: {e}")

