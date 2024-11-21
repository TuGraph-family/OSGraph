import os
from typing import Any

from dotenv import load_dotenv

from app.dal.search.es import ElasticsearchClient
from app.utils.custom_exceptions import InvalidUsage

load_dotenv()


class FulltextSearchService:
    def execute(self, data) -> Any:
        if "index-name" not in data:
            raise InvalidUsage("Missing necessary parameter: index-name")
        index_name = data["index-name"]
        keyword = data["keyword"]
        if not keyword:
            return []
        query = {"match": {"name": keyword}}
        client = ElasticsearchClient()
        result = client.search(index=index_name, query=query, size=10)
        return result
