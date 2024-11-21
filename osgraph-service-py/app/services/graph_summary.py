from typing import Any
from app.llm.openai_client import OpenAIClient


class GraphSummaryService:
    def execute(self, data: dict) -> Any:
        llm = OpenAIClient()
        result = llm.summary_graph(graph_data=data)
        return result
