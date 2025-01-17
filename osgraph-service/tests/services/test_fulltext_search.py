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
import pytest
from unittest.mock import patch
from app.services.fulltext_search import FulltextSearchService
from app.utils.custom_exceptions import InvalidUsage


def test_execute_missing_index_name():
    service = FulltextSearchService()
    data = {"keyword": "test"}
    with pytest.raises(InvalidUsage, match="Missing necessary parameter: index-name"):
        service.execute(data)


def test_execute_missing_keyword():
    service = FulltextSearchService()
    data = {"index-name": "test-index"}
    with pytest.raises(InvalidUsage, match="Missing or invalid parameter: keyword"):
        service.execute(data)


def test_execute_empty_keyword():
    service = FulltextSearchService()
    data = {"index-name": "test-index", "keyword": ""}
    with pytest.raises(InvalidUsage, match="Missing or invalid parameter: keyword"):
        service.execute(data)


def test_execute_keyword_none():
    service = FulltextSearchService()
    data = {"index-name": "test-index", "keyword": None}
    with pytest.raises(InvalidUsage, match="Missing or invalid parameter: keyword"):
        service.execute(data)


def test_execute_returns_expected_data():
    with patch("app.services.fulltext_search.ElasticsearchClient") as MockElasticsearchClient:
        mock_client_instance = MockElasticsearchClient.return_value
        mock_client_instance.search.return_value = [
            {'id': 528766495, 'name': 'TuGraph-family/tugraph-db', 'star': 1026}
        ]

        service = FulltextSearchService()
        data = {"index-name": "test-index", "keyword": "tugraph"}
        result = service.execute(data)

        assert result == [
            {'id': 528766495, 'name': 'TuGraph-family/tugraph-db', 'star': 1026}
        ]


def test_execute_returns_empty_result():
    with patch("app.services.fulltext_search.ElasticsearchClient") as MockElasticsearchClient:
        mock_client_instance = MockElasticsearchClient.return_value
        mock_client_instance.search.return_value = []

        service = FulltextSearchService()
        data = {"index-name": "test-index", "keyword": "test"}
        result = service.execute(data)

        assert result == []


def test_execute_elasticsearch_timeout():
    with patch("app.services.fulltext_search.ElasticsearchClient") as MockElasticsearchClient:
        mock_client_instance = MockElasticsearchClient.return_value
        mock_client_instance.search.side_effect = TimeoutError("Elasticsearch timeout")

        service = FulltextSearchService()
        data = {"index-name": "test-index", "keyword": "test"}
        with pytest.raises(TimeoutError, match="Elasticsearch timeout"):
            service.execute(data)


def test_execute_elasticsearch_unknown_error():
    with patch("app.services.fulltext_search.ElasticsearchClient") as MockElasticsearchClient:
        mock_client_instance = MockElasticsearchClient.return_value
        mock_client_instance.search.side_effect = Exception("Unknown error")

        service = FulltextSearchService()
        data = {"index-name": "test-index", "keyword": "test"}
        with pytest.raises(Exception, match="Unknown error"):
            service.execute(data)
