import os
from dataclasses import asdict, dataclass
from typing import Any, Optional

from dotenv import load_dotenv

load_dotenv()

graph_name = os.getenv("TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME")


class Vertex:
    label: str
    primary: str
    type: str = "vertex"
    _props: Optional[Any] = None

    def __init__(self, label: str, primary: str):
        self.label = label
        self.primary = primary

    @property
    def props(self) -> Any:
        return self._props

    def __repr__(self):
        return (
            f"{self.__class__.__name__}(label={self.label}, primary={self.primary}, "
            f"type={self.type}, props={self.props})"
        )


class Edge:
    label: str
    type: str = "edge"
    source: Any
    target: Any
    _props: Optional[Any] = None

    def __init__(self, label: str, source: Any, target: Any):
        self.label = label
        self.source = source
        self.target = target

    @property
    def props(self) -> Any:
        return self._props

    def __repr__(self):
        return (
            f"{self.__class__.__name__}(label={self.label}, primary={self.primary}, "
            f"type={self.type}, source={self.source}, target={self.target}, props={self.props})"
        )


@dataclass
class GitHubUserProps:
    id: Optional[int] = None
    name: Optional[str] = None
    company: Optional[str] = None
    country: Optional[str] = None


class GitHubUser(Vertex):
    def __init__(self, props: GitHubUserProps):
        if not isinstance(props, GitHubUserProps):
            raise ValueError("props must be an instance of GitHubUserProps.")
        super().__init__(label="github_user", primary="id")
        self._props = props

    def __repr__(self):
        return f"{self.__class__.__name__}(label={self.label}, primary={self.primary}, props={self._props})"


from dataclasses import dataclass
from typing import Optional


@dataclass
class IssueProps:
    id: Optional[int] = None
    state: Optional[str] = None
    created_at: Optional[int] = None
    closed_at: Optional[int] = None


class Issue(Vertex):
    def __init__(self, props: Optional[IssueProps] = None):
        if props is None:
            props = IssueProps()
        if not isinstance(props, IssueProps):
            raise ValueError("props must be an instance of IssueProps.")
        super().__init__(label="issue", primary="id")
        self._props = props


@dataclass
class PullRequestProps:
    id: Optional[int] = None
    merged: Optional[bool] = None
    created_at: Optional[int] = None
    closed_at: Optional[int] = None
    deletions: Optional[int] = None
    changed_files: Optional[int] = None
    additions: Optional[int] = None


class PullRequest(Vertex):
    def __init__(self, props: Optional[PullRequestProps] = None):
        if props is None:
            props = PullRequestProps()
        if not isinstance(props, PullRequestProps):
            raise ValueError("props must be an instance of PullRequestProps.")
        super().__init__(label="pr", primary="id")
        self._props = props


@dataclass
class LanguageProps:
    name: Optional[str] = None


class Language(Vertex):
    def __init__(self, props: Optional[LanguageProps] = None):
        if props is None:
            props = LanguageProps()
        if not isinstance(props, LanguageProps):
            raise ValueError("props must be an instance of LanguageProps.")
        super().__init__(label="language", primary="name")
        self._props = props


@dataclass
class GitHubRepoProps:
    id: Optional[int] = None
    name: Optional[str] = None
    star: Optional[int] = None
    opened_pr: Optional[int] = None
    opened_issue: Optional[int] = None
    merged_pr: Optional[int] = None
    fork: Optional[int] = None
    commits: Optional[int] = None
    comments: Optional[int] = None
    code_deletions: Optional[int] = None
    code_changed_files: Optional[int] = None
    code_additions: Optional[int] = None
    closed_issue: Optional[int] = None


class GitHubRepo(Vertex):
    def __init__(self, props: Optional[GitHubRepoProps] = None):
        if props is None:
            props = GitHubRepoProps()
        if not isinstance(props, GitHubRepoProps):
            raise ValueError("props must be an instance of GitHubRepoProps.")
        super().__init__(label="github_repo", primary="id")
        self._props = props


@dataclass
class LicenseProps:
    name: Optional[str] = None


class License(Vertex):
    def __init__(self, props: Optional[LicenseProps] = None):
        if props is None:
            props = LicenseProps()
        if not isinstance(props, LicenseProps):
            raise ValueError("props must be an instance of LicenseProps.")
        super().__init__(label="license", primary="name")
        self._props = props


@dataclass
class TopicProps:
    name: Optional[str] = None


class Topic(Vertex):
    def __init__(self, props: Optional[TopicProps] = None):
        if props is None:
            props = TopicProps()
        if not isinstance(props, TopicProps):
            raise ValueError("props must be an instance of TopicProps.")
        super().__init__(label="topic", primary="name")
        self._props = props


@dataclass
class GitHubOrganizationProps:
    id: Optional[int] = None
    name: Optional[str] = None


class GitHubOrganization(Vertex):
    def __init__(self, props: Optional[GitHubOrganizationProps] = None):
        if props is None:
            props = GitHubOrganizationProps()
        if not isinstance(props, GitHubOrganizationProps):
            raise ValueError("props must be an instance of GitHubOrganizationProps.")
        super().__init__(label="github_organization", primary="id")
        self._props = props


@dataclass
class PushProps:
    commits: Optional[int] = None
    created_at: Optional[int] = None


class Push(Edge):
    def __init__(self, source, target, props: Optional[PushProps] = None):
        if props is None:
            props = PushProps()
        if not isinstance(props, PushProps):
            raise ValueError("props must be an instance of PushProps.")
        super().__init__(label="push", source=source, target=target)
        self._props = props


@dataclass
class ForkProps:
    created_at: Optional[int] = None


class Fork(Edge):
    def __init__(self, source, target, props: Optional[ForkProps] = None):
        if props is None:
            props = ForkProps()
        if not isinstance(props, ForkProps):
            raise ValueError("props must be an instance of ForkProps.")
        super().__init__(label="fork", source=source, target=target)
        self._props = props


@dataclass
class StarProps:
    created_at: Optional[int] = None


class Star(Edge):
    def __init__(self, source, target, props: Optional[StarProps] = None):
        if props is None:
            props = StarProps()
        if not isinstance(props, StarProps):
            raise ValueError("props must be an instance of StarProps.")
        super().__init__(label="star", source=source, target=target)
        self._props = props


@dataclass
class ReviewPrProps:
    created_at: Optional[int] = None


class ReviewPr(Edge):
    def __init__(self, source, target, props: Optional[ReviewPrProps] = None):
        if props is None:
            props = ReviewPrProps()
        if not isinstance(props, ReviewPrProps):
            raise ValueError("props must be an instance of ReviewPrProps.")
        super().__init__(label="review_pr", source=source, target=target)
        self._props = props


@dataclass
class CommentPrProps:
    created_at: Optional[int] = None


class CommentPr(Edge):
    def __init__(self, source, target, props: Optional[CommentPrProps] = None):
        if props is None:
            props = CommentPrProps()
        if not isinstance(props, CommentPrProps):
            raise ValueError("props must be an instance of CommentPrProps.")
        super().__init__(label="comment_pr", source=source, target=target)
        self._props = props


@dataclass
class ClosePrProps:
    created_at: Optional[int] = None


class ClosePr(Edge):
    def __init__(self, source, target, props: Optional[ClosePrProps] = None):
        if props is None:
            props = ClosePrProps()
        if not isinstance(props, ClosePrProps):
            raise ValueError("props must be an instance of ClosePrProps.")
        super().__init__(label="close_pr", source=source, target=target)
        self._props = props


@dataclass
class OpenPrProps:
    created_at: Optional[int] = None


class OpenPr(Edge):
    def __init__(self, source, target, props: Optional[OpenPrProps] = None):
        if props is None:
            props = OpenPrProps()
        if not isinstance(props, OpenPrProps):
            raise ValueError("props must be an instance of OpenPrProps.")
        super().__init__(label="open_pr", source=source, target=target)
        self._props = props


@dataclass
class CommentIssueProps:
    created_at: Optional[int] = None


class CommentIssue(Edge):
    def __init__(self, source, target, props: Optional[CommentIssueProps] = None):
        if props is None:
            props = CommentIssueProps()
        if not isinstance(props, CommentIssueProps):
            raise ValueError("props must be an instance of CommentIssueProps.")
        super().__init__(label="comment_issue", source=source, target=target)
        self._props = props


@dataclass
class CloseIssueProps:
    created_at: Optional[int] = None


class CloseIssue(Edge):
    def __init__(self, source, target, props: Optional[CloseIssueProps] = None):
        if props is None:
            props = CloseIssueProps()
        if not isinstance(props, CloseIssueProps):
            raise ValueError("props must be an instance of CloseIssueProps.")
        super().__init__(label="close_issue", source=source, target=target)
        self._props = props


@dataclass
class OpenIssueProps:
    created_at: Optional[int] = None


class OpenIssue(Edge):
    def __init__(self, source, target, props: Optional[OpenIssueProps] = None):
        if props is None:
            props = OpenIssueProps()
        if not isinstance(props, OpenIssueProps):
            raise ValueError("props must be an instance of OpenIssueProps.")
        super().__init__(label="open_issue", source=source, target=target)
        self._props = props


@dataclass
class HasPrProps:
    created_at: Optional[int] = None


class HasPr(Edge):
    def __init__(self, source, target, props: Optional[HasPrProps] = None):
        if props is None:
            props = HasPrProps()
        if not isinstance(props, HasPrProps):
            raise ValueError("props must be an instance of HasPrProps.")
        super().__init__(label="has_pr", source=source, target=target)
        self._props = props


@dataclass
class HasIssueProps:
    created_at: Optional[int] = None


class HasIssue(Edge):
    def __init__(self, source, target, props: Optional[HasIssueProps] = None):
        if props is None:
            props = HasIssueProps()
        if not isinstance(props, HasIssueProps):
            raise ValueError("props must be an instance of HasIssueProps.")
        super().__init__(label="has_issue", source=source, target=target)
        self._props = props


class UseLang(Edge):
    def __init__(self, source, target):
        super().__init__(label="use_lang", source=source, target=target)
        self._props = None


class HasTopic(Edge):
    def __init__(self, source, target):
        super().__init__(label="has_topic", source=source, target=target)
        self._props = None


class UseLicense(Edge):
    def __init__(self, source, target):
        super().__init__(label="use_license", source=source, target=target)
        self._props = None
