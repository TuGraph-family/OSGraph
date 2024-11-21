import os
from typing import Any

from dotenv import load_dotenv

from app.dal.graph.tugraph import GraphClient

load_dotenv()


class GraphListService:
    def execute(self) -> Any:
        graph_name = os.getenv("TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME")
        client = GraphClient(graph_name)
        cypher = f"""MATCH (n:graph_service) RETURN n"""
        result = client.run(cypher)
        return result
