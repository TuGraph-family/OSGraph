# app/dal/graph/tugraph.py
import os
from neo4j import GraphDatabase
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
from flask import current_app
from dataclasses import dataclass, asdict, is_dataclass
from app.models.default_graph import Edge, Vertex
import json

load_dotenv()


@dataclass
class LabelProps:
    name: str
    type: str
    optional: bool
    index: Optional[bool] = None


@dataclass
class GraphLabel:
    label: str
    primary: str
    type: str
    properties: Optional[List[LabelProps]] = None

    def to_dict(self) -> Dict[str, Any]:
        # 遍历属性列表，找到与 primary 匹配的属性并设置 optional 和 index
        if self.properties:
            for prop in self.properties:
                if prop.name == self.primary:
                    prop.optional = False
                    prop.index = True
                else:
                    prop.optional = True
                    prop.index = False
                prop.type = prop.type.upper()
        return {
            "label": self.label,
            "primary": self.primary,
            "type": self.type,
            "properties": (
                [prop.__dict__ for prop in self.properties] if self.properties else []
            ),
        }


class GraphClient:
    def __init__(self, graph_name):
        TUGRAPHDB_HOST = os.getenv("TUGRAPHDB_HOST")
        TUGRAPHDB_PORT = os.getenv("TUGRAPHDB_PORT")
        TUGRAPHDB_USER = os.getenv("TUGRAPHDB_USER")
        TUGRAPHDB_PASSWORD = os.getenv("TUGRAPHDB_PASSWORD")
        self.driver = GraphDatabase.driver(
            f"bolt://{TUGRAPHDB_HOST}:{TUGRAPHDB_PORT}",
            auth=(TUGRAPHDB_USER, TUGRAPHDB_PASSWORD),
        )
        self.graph_name = graph_name

    def close(self):
        if self.driver:
            self.driver.close()
            current_app.logger.info("TuGraph connection closed.")

    # 创建 Label
    def create_label(self, label: GraphLabel):
        try:
            with self.driver.session(database=self.graph_name) as session:
                label_json = json.dumps(label.to_dict())
                query = f"""CALL db.createVertexLabelByJson('{label_json}')"""
                session.run(query)
                current_app.logger.info(f"Label '{label}' created.")
        except Exception as e:
            current_app.logger.info(f"Label '{label}' may already exist. {str(e)}")

    def get_label(self, label_type: str, label_name: str) -> Dict[str, any]:
        try:
            with self.driver.session(database=self.graph_name) as session:
                if label_type == "vertex":
                    query = f"""CALL db.getVertexSchema('{label_name}')"""
                else:
                    query = f"""CALL db.getEdgeSchema('{label_name}')"""
                result = session.run(query).data()
                return json.dumps(result)
        except Exception as e:
            current_app.logger.info(
                f"Faild to get {label_type} {label_name} . Errormessage: {str(e)}"
            )

    # 创建节点
    def create_vertex(self, label: str, properties: Dict[str, any]):
        try:
            properties_str = self._convert_dict_to_str(properties)
            query = f"""
            CREATE (n:{label} {properties_str}) RETURN n
            """
            with self.driver.session(database=self.graph_name) as session:
                result = session.run(query)
                current_app.logger.info(
                    f"Vertex '{ json.dumps(properties)}' created success."
                )
                return result.data()
        except Exception as e:
            current_app.logger.info(
                f"Vertex '{ json.dumps(properties)}' created faild. Error message : {str(e)}"
            )

    # 创建边
    def create_relationship(
        self,
        src_label: str = "",
        src_filter: Optional[Dict[str, Any]] = None,
        dst_label: str = "",
        dst_filter: Optional[Dict[str, Any]] = None,
        relationship_type: str = "",
        properties: Optional[Dict[str, Any]] = None,
    ) -> None:
        try:
            query = f"""
            MATCH (n:{src_label})
            MATCH (m:{dst_label})
            """
            conditions = []
            if src_filter:
                for key, value in src_filter.items():
                    if isinstance(value, str):
                        conditions.append(f"n.{key} = '{value}'")
                    else:
                        conditions.append(f"n.{key} = {value}")
            if dst_filter:
                for key, value in dst_filter.items():
                    if isinstance(value, str):
                        conditions.append(f"m.{key} = '{value}'")
                    else:
                        conditions.append(f"m.{key} = {value}")
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            properties_str = self._convert_dict_to_str(properties)
            query += f"""
            CREATE (n)-[r:{relationship_type} {properties_str}]->(m)
            RETURN r
            """
            with self.driver.session(database=self.graph_name) as session:
                result = session.run(query)
                current_app.logger.info(
                    f"Relationship '{json.dumps(properties)}' created."
                )
                return result.data()
        except Exception as e:
            current_app.logger.error(
                f"Relationship '{json.dumps(properties)}' creation failed. Error message: {str(e)}"
            )
            return None

    def delete_relationship(
        self,
        src_label: str = "",
        src_filter: Optional[Dict[str, Any]] = None,
        dst_label: str = "",
        dst_filter: Optional[Dict[str, Any]] = None,
        relationship_type: str = "",
        relationship_filter: Optional[Dict[str, Any]] = None,
    ) -> None:
        query = f"MATCH (n:{src_label})-[r:{relationship_type}]-(m:{dst_label})"
        conditions = []
        if src_filter:
            for key, value in src_filter.items():
                if isinstance(value, str):
                    conditions.append(f'n.{key} = "{value}"')
                else:
                    conditions.append(f"n.{key} = {value}")
        if dst_filter:
            for key, value in dst_filter.items():
                if isinstance(value, str):
                    conditions.append(f'm.{key} = "{value}"')
                else:
                    conditions.append(f"m.{key} = {value}")
        if relationship_filter:
            for key, value in relationship_filter.items():
                if isinstance(value, str):
                    conditions.append(f'r.{key} = "{value}"')
                else:
                    conditions.append(f"r.{key} = {value}")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        query += " DELETE r"
        print(f"Generated Cypher Query: {query}")
        try:
            with self.driver.session(database=self.graph_name) as session:
                session.run(query)
                print("Relationship deleted successfully.")
        except Exception as e:
            print(f"Failed to delete relationship: {e}")

    def upsert_vertex(self, label, properties):
        try:
            with self.driver.session(database=self.graph_name) as session:
                query = (
                    "CALL db.upsertVertex("
                    f'"{label}", '
                    f"[{self._convert_dict_to_str(properties)}])"
                )
                result = session.run(query).data()
                return result
        except Exception as e:
            print(f"Failed to update_node: {e}")

    def get_vertex(self, vertex_instance: Vertex, limit: Optional[int] = None):
        if not isinstance(vertex_instance, Vertex):
            raise ValueError("Input must be an instance of a Vertex-derived class.")
        label = vertex_instance.label
        filters = vertex_instance.props  # Access props
        query = f"MATCH (n:{label})"
        if filters:
            conditions = [
                (
                    f"n.{key} = '{value}'"
                    if isinstance(value, str)
                    else f"n.{key} = {value}"
                )
                for key, value in asdict(filters).items()
                if value is not None
            ]
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
        query += " RETURN n"
        if limit is not None:
            query += f" LIMIT {limit}"
        try:
            with self.driver.session(database=self.graph_name) as session:
                result = session.run(query)
                return result.data()
        except Exception as e:
            print(f"Error fetching vertex: {e}")
            return None

    def get_edge(
        self, edge_instance: Edge, deep: int = 3, limit: int = 50
    ) -> Optional[list]:
        if not isinstance(edge_instance, Edge):
            raise ValueError("Input must be an instance of an Edge-derived class.")

        # Extract edge label and properties
        label = edge_instance.label
        source = edge_instance.source
        target = edge_instance.target
        props = edge_instance._props

        # Build the MATCH pattern
        query = f"MATCH p=(n:{source.label})-[r:{label}*1..{deep}]-(m:{target.label})"

        # Add WHERE conditions for properties of n, r, and m
        conditions = []

        # Add source (n) filters
        if hasattr(source, "props") and source.props:
            conditions += [
                (
                    f"n.{key} = '{value}'"
                    if isinstance(value, str)
                    else f"n.{key} = {value}"
                )
                for key, value in asdict(source.props).items()
                if value is not None
            ]

        # Add relationship (r) filters
        if props:
            conditions += [
                (
                    f"r.{key} = '{value}'"
                    if isinstance(value, str)
                    else f"r.{key} = {value}"
                )
                for key, value in asdict(props).items()
                if value is not None
            ]

        # Add target (m) filters
        if hasattr(target, "props") and target.props:
            conditions += [
                (
                    f"m.{key} = '{value}'"
                    if isinstance(value, str)
                    else f"m.{key} = {value}"
                )
                for key, value in asdict(target.props).items()
                if value is not None
            ]

        # Append WHERE clause if conditions exist
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        # Add RETURN and LIMIT clauses
        query += f" RETURN p LIMIT {limit}"

        try:
            with self.driver.session(database=self.graph_name) as session:
                result = session.run(query)
                return self._parse_edge_result(result)
        except Exception as e:
            print(f"Error fetching edge: {e}")
            return None

    def get_graph(self) -> Optional[dict]:
        with self.driver.session(database="default") as session:
            graph_list = session.run("CALL dbms.graph.listGraphs()").data()
            result = next(
                (
                    graph
                    for graph in graph_list
                    if graph.get("graph_name") == self.graph_name
                ),
                None,
            )
            return result

    def create_graph(self):
        """Create a new graph in the database if it doesn't already exist."""
        try:
            with self.driver.session(database="default") as session:
                session.run(
                    f"CALL dbms.graph.createGraph('{self.graph_name}', '', 2048)"
                )
        except Exception as e:
            raise Exception(
                f"Failed to create graph '{self.graph_name}': {str(e)}"
            ) from e

    def run(self, cypher: str) -> Any:
        try:
            with self.driver.session(database=self.graph_name) as session:
                result = session.run(cypher)
                return result.data()
        except Exception as e:
            raise Exception(f"Error : {e}")

    def _convert_dict_to_str(self, properties: Any) -> str:
        if not properties:
            return ""

        # 如果是 dataclass，则将其转换为字典
        if is_dataclass(properties):
            properties = asdict(properties)

        def convert_value(value: Any) -> str:
            if isinstance(value, str):
                return f'"{value}"'
            elif isinstance(value, (int, float, bool)):
                return str(value).lower() if isinstance(value, bool) else str(value)
            elif isinstance(value, list):
                return "[" + ", ".join(convert_value(item) for item in value) + "]"
            elif isinstance(value, dict):
                return (
                    "{"
                    + ", ".join(f"{k}: {convert_value(v)}" for k, v in value.items())
                    + "}"
                )
            elif callable(value):
                return convert_value(value())
            else:
                return f'"{str(value)}"'

        properties_str = (
            "{"
            + ", ".join(f"{k}: {convert_value(v)}" for k, v in properties.items())
            + "}"
        )
        return properties_str

    def _parse_edge_result(self, query_result: list) -> list:
        parsed_results = []
        for record in query_result:
            path = record.get("p")  # Extract the Path object from the result

            if path:
                # Extract nodes (start and end nodes are the first and last in the list)
                nodes = path.nodes
                start_node = {
                    "element_id": nodes[0].element_id,
                    "type": list(nodes[0].labels),
                    "properties": nodes[0]._properties,
                }
                end_node = {
                    "element_id": nodes[-1].element_id,
                    "type": list(nodes[-1].labels),
                    "properties": nodes[-1]._properties,
                }

                # Extract relationships along the path
                relationships = []
                for relationship in path.relationships:
                    relationships.append(
                        {
                            "type": relationship.type,
                            "element_id": relationship.element_id,
                            "properties": relationship._properties,
                        }
                    )

                parsed_results.append(
                    {
                        "start": start_node,
                        "relationships": relationships,
                        "end": end_node,
                    }
                )

        return parsed_results
