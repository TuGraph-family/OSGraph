from openai import OpenAI
import os
from dotenv import load_dotenv
from app.llm.prompt_templates.graph_summary import get_graph_summary_prompt
load_dotenv()
class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENAI_KEY'),
            base_url=os.getenv('BASEURL'),
        )

    def ask_question(self, question: str, context: str = "", temperature: float = 0.7):
        try:
            model=os.getenv('MODEL')
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": context},
                    {"role": "user", "content": question}
                ],
                stream=False,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error occurred: {str(e)}"
        
    def summary_graph(self, graph_data: dict, ):
        prompt = get_graph_summary_prompt(graph_data = graph_data)
        return self.ask_question(prompt)    

# 示例用法
if __name__ == "__main__":
    api_key = "your-openai-api-key"
    client = OpenAIClient(api_key)

    question = "什么是Python的主要用途？"
    context = "请简要回答关于编程语言的问题。"
    answer = client.ask_question(question, context)
    print("回答:", answer)
