# app/models/graph_view.py

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Literal, Optional


@dataclass
class Vertex:
    id: int | str
    name: str
    comment: Optional[str] = None
    source: Optional[str] = None
    size: Optional[int] = None

    @property
    def vertex_type(self):
        return self.__class__.__name__
    
    def to_dict(self) -> dict:
        data = asdict(self)
        data["nodeType"] = self.vertex_type
        return data


@dataclass
class Edge:
    source: str | int
    target: str | int
    id: str | int
    name: str
    name_en: str
    direction: Literal["both", "out", "in"] = "out"
    comment: Optional[int] = None
    weight: Optional[int] = None
    count: Optional[int] = None

    @property
    def edge_type(self):
        return self.__class__.__name__

    def to_dict(self) -> dict:
        data = asdict(self)
        data["edgeType"] = self.edge_type
        return data


@dataclass
class Graph:
    vertices: List[Vertex] = field(default_factory=list)
    edges: List[Edge] = field(default_factory=list)
    summary: str = ""

    def update_summary(self, summary):
        self.summary = summary

    def insert_entity(self, new_vertex: Vertex):
        for i, vertex in enumerate(self.vertices):
            if vertex.id == new_vertex.id:
                # Update existing entity
                self.vertices[i] = new_vertex
                return
        # Add new entity if not found
        self.vertices.append(new_vertex)

    def insert_relationship(self, new_edge: Edge):
        for i, edge in enumerate(self.edges):
            if (
                edge.source == new_edge.source
                and edge.target == new_edge.target
                and edge.edge_type == new_edge.edge_type
            ):
                # Update existing relationship
                self.edges[i] = new_edge
                return
        # Add new relationship if not found
        self.edges.append(new_edge)

    def filter_entities(self, **criteria):
        """Filter entities based on provided keyword arguments."""
        return [
            vertex
            for vertex in self.vertices
            if all(getattr(vertex, key) == value for key, value in criteria.items())
        ]

    def filter_relationships(self, **criteria):
        """Filter relationships based on provided keyword arguments."""
        return [
            edge
            for edge in self.edges
            if all(getattr(edge, key) == value for key, value in criteria.items())
        ]

    def to_dict(self) -> Dict[str, Any]:
        graph_dict = {
            "nodes": [v.to_dict() for v in self.vertices],
            "edges": [e.to_dict() for e in self.edges],
            "summary": self.summary,
        }
        return graph_dict


# vertex class
class User(Vertex):
    pass


class Repo(Vertex):
    pass


class Orgnization(Vertex):
    pass


class Country(Vertex):
    pass


class Company(Vertex):
    pass


class Topic(Vertex):
    pass


class Contibution(Vertex):
    pass


class PR(Contibution):
    pass


class Issue(Contibution):
    pass


class Comment(Contibution):
    pass


class CodeReview(Comment):
    pass


class Commit(Contibution):
    pass


# edge class
@dataclass
class Create(Edge):
    name: Literal["创建"] = field(default="创建", init=False)
    name_en: Literal["Create"] = field(default="Create", init=False)


@dataclass
class CreatePR(Edge):
    name: Literal["创建 PR"] = field(default="创建 PR", init=False)
    name_en: Literal["Create PR"] = field(default="Create PR", init=False)


@dataclass
class CreateIssue(Edge):
    name: Literal["创建 Issue"] = field(default="创建 Issue", init=False)
    name_en: Literal["Create Issue"] = field(default="Create Issue", init=False)


@dataclass
class CreateCommit(Edge):
    name: Literal["创建 Commit"] = field(default="创建 Commit", init=False)
    name_en: Literal["Create Commit"] = field(default="Create Commit", init=False)


@dataclass
class CreateComment(Edge):
    name: Literal["创建 Comment"] = field(default="创建 Comment", init=False)
    name_en: Literal["Create Comment"] = field(default="Create Comment", init=False)


@dataclass
class CreateCR(Edge):
    name: Literal["创建 CR"] = field(default="创建 CR", init=False)
    name_en: Literal["Create CR"] = field(default="Create CR", init=False)


@dataclass
class CodeReviewAction(Edge):
    name: Literal["CR"] = field(default="CR", init=False)
    name_en: Literal["CR"] = field(default="CR", init=False)


@dataclass
class Belong(Edge):
    name: Literal["属于"] = field(default="属于", init=False)
    name_en: Literal["Belong"] = field(default="Belong", init=False)


@dataclass
class Star(Edge):
    name: Literal["Star"] = field(default="Star", init=False)
    name_en: Literal["Star"] = field(default="Star", init=False)


@dataclass
class PullRequestAction(Edge):
    name: Literal["PR"] = field(default="PR", init=False)
    name_en: Literal["PR"] = field(default="PR", init=False)


@dataclass
class Push(Edge):
    name: Literal["推送"] = field(default="推送", init=False)
    name_en: Literal["Push"] = field(default="Push", init=False)


@dataclass
class OpenPR(Edge):
    name: Literal["推送 PR"] = field(default="推送 PR", init=False)
    name_en: Literal["Open PR"] = field(default="Open PR", init=False)



@dataclass
class CommitAction(Edge):
    name: Literal["提交"] = field(default="提交", init=False)
    name_en: Literal["Commite"] = field(default="Commite", init=False)


@dataclass
class CommentIssue(Edge):
    name: Literal["评论 Issue"] = field(default="评论 Issue", init=False)
    name_en: Literal["Comment Issue"] = field(default="Comment Issue", init=False)


@dataclass
class CommonIssue(Edge):
    name: Literal["合作 Issue"] = field(default="合作 Issue", init=False)
    name_en: Literal["Common Issue"] = field(default="Common Issue", init=False)



@dataclass
class CommonPR(Edge):
    name: Literal["合作 PR"] = field(default="合作 PR", init=False)
    name_en: Literal["Common PR"] = field(default="Common PR", init=False)

@dataclass
class CommonStar(Edge):
    name: Literal["共同关注"] = field(default="共同关注", init=False)
    name_en: Literal["Common Star"] = field(default="Common Star", init=False)


@dataclass
class CommonRepo(Edge):
    name: Literal["合作项目"] = field(default="合作项目", init=False)
    name_en: Literal["Common Repo"] = field(default="Common Repo", init=False)


@dataclass
class CommonDevelop(Edge):
    name: Literal["共建"] = field(default="共建", init=False)
    name_en: Literal["Common Develop"] = field(default="Common Develop", init=False)


@dataclass
class ContributeRepo(Edge):
    name: Literal["贡献项目"] = field(default="贡献项目", init=False)
    name_en: Literal["Contribute Repo"] = field(default="Contribute Repo", init=False)