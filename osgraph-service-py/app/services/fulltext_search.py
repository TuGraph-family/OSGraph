from typing import Any

from dotenv import load_dotenv

from app.dal.search.es import ElasticsearchClient
from app.utils.custom_exceptions import InvalidUsage

load_dotenv()


class FulltextSearchService:
    def execute(self, data) -> Any:
        if "indexName" not in data:
            raise InvalidUsage("Missing necessary parameter: indexName")
        if "keyword" not in data or not data["keyword"]:
            raise InvalidUsage("Missing or invalid parameter: keyword")
        index_name = data["indexName"]
        keyword = data["keyword"]
        if not keyword:
            return []
        query = {"match": {"name": keyword}}
        client = ElasticsearchClient()
        sort_by = None
        if index_name == 'github_repo':
            sort_by = "star:desc"
        result = client.search(index=index_name, query=query, size=10, sort=sort_by)
        return result
