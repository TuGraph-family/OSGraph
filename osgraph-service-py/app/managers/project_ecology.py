# app/manager/project_ecology.py
from app.models.graph_view import Graph, User, Repo, Orgnization, Belong, CommonDevelop
from typing import Dict, Any
from app.services.graph_services.project_ecology import ProjectEcologyService
import json
import os


class ProjectEcologyManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data:Dict[str, Any]) -> Dict | None:
        service = ProjectEcologyService()
        graph = Graph()
        result = service.execute(data=data)
        if result:
            for data in result:
                start_node = json.loads(data['start_node'])
                relationship = json.loads(data['relationship'])
                end_node = json.loads(data['end_node'])
                if start_node["type"] == 'github_repo':
                    user = Repo(id=start_node["id"],name=start_node["properties"]["name"])
                    graph.insert_entity(user)
                if start_node["type"] == 'github_organization':
                    organization = Orgnization(id=start_node["id"],name=start_node["properties"]["name"])
                    graph.insert_entity(organization)
                if end_node["type"] == 'github_repo':
                    user = Repo(id=end_node["id"],name=end_node["properties"]["name"])
                    graph.insert_entity(user)
                if end_node["type"] == 'github_organization':
                    organization = Orgnization(id=end_node["id"],name=end_node["properties"]["name"])
                    graph.insert_entity(organization)

                if relationship["type"] == "belong_to":
                    belong_to = Belong(sid=relationship["src"],tid=relationship["dst"],id=relationship["id"])
                    graph.insert_relationship(belong_to)

                if relationship["type"] == "common_developer":
                    common_developer = CommonDevelop(sid=relationship["src"],tid=relationship["dst"],id=relationship["id"], count=relationship["properties"]["count"])
                    graph.insert_relationship(common_developer)
            if os.getenv('SUMMARY_GRAPH') == 'on':
                from app.services.graph_summary import GraphSummaryService
                summary_service = GraphSummaryService()
                summary = summary_service.execute(data = graph.to_dict())
                if summary:
                    graph.update_summary(summary=summary)
            return graph.to_dict()