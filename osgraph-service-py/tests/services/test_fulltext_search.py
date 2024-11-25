import pytest
from unittest.mock import patch, MagicMock
from app.services.fulltext_search import FulltextSearchService
from app.utils.custom_exceptions import InvalidUsage

def test_execute_missing_index_name():
    service = FulltextSearchService()
    data = {"keyword": "tugraph"}
    with pytest.raises(InvalidUsage, match="Missing necessary parameter: index-name"):
        service.execute(data)


def test_execute_empty_keyword():
    service = FulltextSearchService()
    data = {"index-name": "test-index", "keyword": ""}
    with pytest.raises(InvalidUsage, match="Missing or invalid parameter: keyword"):
        service.execute(data)



def test_execute_calls_elasticsearch_correctly():
    with patch("app.services.fulltext_search.ElasticsearchClient") as MockElasticsearchClient:
        mock_client_instance = MockElasticsearchClient.return_value
        mock_client_instance.search.return_value =[{'id': 528766495, 'name': 'TuGraph-family/tugraph-db', 'star': 1026}]

        service = FulltextSearchService()
        data = {"index-name": "github_repo", "keyword": "tugraph"}
        result = service.execute(data)

        expected_query = {"match": {"name": "tugraph"}}
        mock_client_instance.search.assert_called_once_with(
            index="github_repo", query=expected_query, size=10
        )

        assert result == [{'id': 528766495, 'name': 'TuGraph-family/tugraph-db', 'star': 1026}]


def test_execute_returns_empty_result():
    with patch("app.services.fulltext_search.ElasticsearchClient") as MockElasticsearchClient:
        mock_client_instance = MockElasticsearchClient.return_value
        mock_client_instance.search.return_value = [] 

        service = FulltextSearchService()
        data = {"index-name": "test-index", "keyword": "test"}
        result = service.execute(data)
        assert result == []
