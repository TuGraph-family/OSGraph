# app/manager/os_partner.py
from app.models.graph_view import (
    Graph,
    User,
    CommonIssue,
    CommonPR,
    CommonStar,
    CommonRepo,
)
from typing import Dict, Any
from app.services.graph_services.os_partner import OSPartnerService
import json
import os


class OSPartnerManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data: Dict[str, Any]) -> Dict | None:
        service = OSPartnerService()
        graph = Graph()
        result = service.execute(data=data)
        if result:
            if result:
                for data in result:
                    start_node = json.loads(data["start_node"])
                    relationship = json.loads(data["relationship"])
                    end_node = json.loads(data["end_node"])
                    if start_node["type"] == "github_user":
                        src_user = User(
                            id=start_node["id"], name=start_node["properties"]["name"]
                        )
                        graph.insert_entity(src_user)

                    if end_node["type"] == "github_user":
                        tar_user = User(
                            id=end_node["id"], name=end_node["properties"]["name"]
                        )
                        graph.insert_entity(tar_user)

                    if end_node["type"] == "common_issue":
                        common_issue = CommonIssue(
                            sid=relationship["src"],
                            tid=relationship["dst"],
                            id=relationship["id"],
                            count=relationship["properties"]["count"],
                        )
                        graph.insert_entity(common_issue)

                    if relationship["type"] == "common_pr":
                        common_pr = CommonPR(
                            sid=relationship["src"],
                            tid=relationship["dst"],
                            id=relationship["id"],
                            count=relationship["properties"]["count"],
                        )
                        graph.insert_relationship(common_pr)

                    if relationship["type"] == "common_star":
                        common_star = CommonStar(
                            sid=relationship["src"],
                            tid=relationship["dst"],
                            id=relationship["id"],
                            count=relationship["properties"]["count"],
                        )
                        graph.insert_relationship(common_star)

                    if relationship["type"] == "common_repo":
                        common_repo = CommonRepo(
                            sid=relationship["src"],
                            tid=relationship["dst"],
                            id=relationship["id"],
                            count=relationship["properties"]["count"],
                        )
                        graph.insert_relationship(common_repo)

                if os.getenv("SUMMARY_GRAPH") == "on":
                    from app.services.graph_summary import GraphSummaryService

                    summary_service = GraphSummaryService()
                    summary = summary_service.execute(data=graph.to_dict())
                    if summary:
                        graph.update_summary(summary=summary)
                return graph.to_dict()
