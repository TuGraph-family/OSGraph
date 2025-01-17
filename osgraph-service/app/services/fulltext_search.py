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
        query = {"match_phrase": {"name": keyword}}
        client = ElasticsearchClient()
        sort_by = None
        if index_name == 'github_repo':
            sort_by = "star:desc"
        result = client.search(index=index_name, query=query, size=10, sort=sort_by)
        return result
