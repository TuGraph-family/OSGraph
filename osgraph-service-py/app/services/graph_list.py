import os
from typing import Any

from dotenv import load_dotenv

from app.dal.graph.tugraph import GraphClient
from app.utils.custom_exceptions import InvalidUsage

load_dotenv()


class GraphListService:
    def execute(self)->Any:
        TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME = os.getenv("TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME")
        TUGRAPHDB_SYSTEM_HOST = os.getenv("TUGRAPHDB_SYSTEM_HOST")
        TUGRAPHDB_SYSTEM_PORT = os.getenv("TUGRAPHDB_SYSTEM_PORT")
        TUGRAPHDB_SYSTEM_USER = os.getenv("TUGRAPHDB_SYSTEM_USER")
        TUGRAPHDB_SYSTEM_PASSWORD = os.getenv("TUGRAPHDB_SYSTEM_PASSWORD")
        if not TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME:
            raise InvalidUsage("Environment variable is missing")
        try:
            client = GraphClient(
                host=TUGRAPHDB_SYSTEM_HOST,
                port=TUGRAPHDB_SYSTEM_PORT,
                user=TUGRAPHDB_SYSTEM_USER,
                password=TUGRAPHDB_SYSTEM_PASSWORD,
                graph_name=TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME
            )
            result = client.run("MATCH (n:graph_service) RETURN n")
            return result
        except Exception as e:
            raise InvalidUsage(f"GraphClient error: {e}")

