import unittest
from unittest.mock import patch, MagicMock
from app.services.graph_services.project_community import ProjectCommunityService

class TestProjectCommunityService(unittest.TestCase):

    @patch("app.services.graph_services.project_community.ElasticsearchClient")
    @patch("app.services.graph_services.project_community.GraphClient")
    def test_execute(self, MockGraphClient, MockElasticsearchClient):
        mock_es_instance = MockElasticsearchClient.return_value
        mock_es_instance.search.return_value = [
            {"id": 123, "name": "test-repo"}
        ]
        
        mock_graph_instance = MockGraphClient.return_value
        mock_graph_instance.run.return_value = [
            {"start_node": "developer1", "relationship": "contributed", "end_node": "repo1"}
        ]
        data = {
            "GitHubRepo": "test-repo",
            "company-topn": 50,
            "country-topn": 50,
            "developer-topn": 50
        }
        service = ProjectCommunityService()
        result = service.execute(data)
        mock_es_instance.search.assert_called_once_with(
            index="github_repo",
            query={"term": {"name.keyword": "test-repo"}}
        )
        
        cypher_query = (
            'CALL osgraph.get_repo_developers_profile(\'{"repo_id":123,"company_topn":50,"country_topn":50,"developer_topn":50}\') '
            'YIELD start_node, relationship, end_node return start_node, relationship, end_node'
        )
        mock_graph_instance.run.assert_called_once_with(cypher_query)
        
        self.assertEqual(result, [{"start_node": "developer1", "relationship": "contributed", "end_node": "repo1"}])

if __name__ == "__main__":
    unittest.main()
