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
    type: str = 'VERTEX'
    props: GraphServiceProps = None
    def __init__(self, name: str, comment: str, input_types: str, filter_keys: str):
        self.props = GraphServiceProps(
            name=name,
            comment=comment,
            input_types=input_types,
            filter_keys=filter_keys
        )
    
    def __repr__(self):
        return (f"GitHubUser(label={self.label}, pk={self.primary}, type={self.type}, props={self.props})")