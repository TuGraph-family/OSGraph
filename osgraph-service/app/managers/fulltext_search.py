# app/manager/fulltext_search.py
from typing import List, Union

from app.services.fulltext_search import FulltextSearchService


class FulltextSearchManager:
    def __init__(self) -> None:
        pass

    def search(self, data) -> Union[List, None]:
        service = FulltextSearchService()
        result = service.execute(data=data)
        if result:
            return result
        return None
