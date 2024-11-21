from typing import Any
from app.dal.search.es import ElasticsearchClient
from app.utils.custom_exceptions import InvalidUsage
import os 
from dotenv import load_dotenv
load_dotenv()

class FulltextSearchService:
    def execute(self, data) -> Any:
        if "index-name" not in data:
            raise InvalidUsage("Missing necessary parameter: index-name")
        index_name = data["index-name"]
        keyword = data["keyword"]
        if not keyword:
            return []
        query = {
            "match": {
                "name": keyword
            }
        }
        client = ElasticsearchClient()
        result = client.search(index = index_name, query = query, size=10)
        return result
