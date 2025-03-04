#
# Copyright 2025 AntGroup CO., Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#
# app/models/graph_view.py

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Literal, Optional


@dataclass
class Vertex:
    id: int | str
    name: str
    comment: Optional[str] = None
    source: Optional[str] = None

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
    name_zh: str
    name_en: str
    direction: Literal["both", "out", "in"] = "out"
    comment: Optional[int] = None
    count: Optional[int] = None

    @property
    def edge_type(self):
        return self.__class__.__name__

    def to_dict(self, lang: str) -> dict:
        data = asdict(self)
        if lang == "en-US":
            data["name"] = data.get("name_en")
        elif lang == "zh-CN":
            data["name"] = data.get("name_zh")
        data["edgeType"] = self.edge_type
        data.pop("name_en", None)
        data.pop("name_zh", None)
        return data


@dataclass
class Graph:
    vertices: List[Vertex] = field(default_factory=list)
    edges: List[Edge] = field(default_factory=list)
    summary: str = ""
    lang: str = ""

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
            "edges": [e.to_dict(self.lang) for e in self.edges],
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
    name_zh: Literal["创建"] = field(default="创建", init=False)
    name_en: Literal["Create"] = field(default="Create", init=False)


@dataclass
class CreatePR(Edge):
    name_zh: Literal["创建 PR"] = field(default="创建 PR", init=False)
    name_en: Literal["Created PRs"] = field(default="Created PRs", init=False)


@dataclass
class CreateIssue(Edge):
    name_zh: Literal["创建 Issue"] = field(default="创建 Issue", init=False)
    name_en: Literal["Created Issues"] = field(default="Created Issues", init=False)


@dataclass
class CreateCommit(Edge):
    name_zh: Literal["创建 Commit"] = field(default="创建 Commit", init=False)
    name_en: Literal["Create Commit"] = field(default="Create Commit", init=False)


@dataclass
class CreateComment(Edge):
    name_zh: Literal["创建 Comment"] = field(default="创建 Comment", init=False)
    name_en: Literal["Create Comment"] = field(default="Create Comment", init=False)


@dataclass
class CreateCR(Edge):
    name_zh: Literal["创建 CR"] = field(default="创建 CR", init=False)
    name_en: Literal["Create CR"] = field(default="Create CR", init=False)


@dataclass
class CodeReviewAction(Edge):
    name_zh: Literal["CR"] = field(default="CR", init=False)
    name_en: Literal["Code Reviews"] = field(default="Code Reviews", init=False)


@dataclass
class Belong(Edge):
    name_zh: Literal["属于"] = field(default="属于", init=False)
    name_en: Literal["Belongs To"] = field(default="Belongs To", init=False)


@dataclass
class Star(Edge):
    name_zh: Literal["Star"] = field(default="Star", init=False)
    name_en: Literal["Stars"] = field(default="Stars", init=False)


@dataclass
class PullRequestAction(Edge):
    name_zh: Literal["PR"] = field(default="PR", init=False)
    name_en: Literal["PRs"] = field(default="PRs", init=False)


@dataclass
class Push(Edge):
    name_zh: Literal["提交"] = field(default="提交", init=False)
    name_en: Literal["Commits"] = field(default="Commits", init=False)


@dataclass
class OpenPR(Edge):
    name_zh: Literal["创建 PR"] = field(default="创建 PR", init=False)
    name_en: Literal["Created PRs"] = field(default="Created PRs", init=False)


@dataclass
class CommitAction(Edge):
    name_zh: Literal["提交"] = field(default="提交", init=False)
    name_en: Literal["Commits"] = field(default="Commits", init=False)


@dataclass
class CommentIssue(Edge):
    name_zh: Literal["评论 Issue"] = field(default="评论 Issue", init=False)
    name_en: Literal["Issue Comments"] = field(default="Issue Comments", init=False)


@dataclass
class CommonIssue(Edge):
    name_zh: Literal["合作 Issue"] = field(default="合作 Issue", init=False)
    name_en: Literal["Collaborative Issues"] = field(
        default="Collaborative Issues", init=False
    )


@dataclass
class CommonPR(Edge):
    name_zh: Literal["合作 PR"] = field(default="合作 PR", init=False)
    name_en: Literal["Collaborative PRs"] = field(
        default="Collaborative PRs", init=False
    )


@dataclass
class CommonStar(Edge):
    name_zh: Literal["共同关注"] = field(default="共同关注", init=False)
    name_en: Literal["Co-Followed Projects"] = field(
        default="Co-Followed Projects", init=False
    )


@dataclass
class CommonRepo(Edge):
    name_zh: Literal["合作项目"] = field(default="合作项目", init=False)
    name_en: Literal["Collaborative Projects"] = field(
        default="Collaborative Projects", init=False
    )


@dataclass
class CommonDevelop(Edge):
    name_zh: Literal["共建"] = field(default="共建", init=False)
    name_en: Literal["Joint Contributions"] = field(
        default="Joint Contributions", init=False
    )


@dataclass
class ContributeRepo(Edge):
    name_zh: Literal["合作项目"] = field(default="合作项目", init=False)
    name_en: Literal["Collaborative Projects"] = field(
        default="Collaborative Projects", init=False
    )
