import os

from dotenv import load_dotenv
from openai import OpenAI

from app.llm.prompt_templates.graph_summary import get_graph_summary_prompt

load_dotenv()


class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("OPENAI_KEY"),
            base_url=os.getenv("BASEURL"),
        )

    def ask_question(self, question: str, context: str = "", temperature: float = 0.7):
        try:
            model = os.getenv("MODEL")
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": context},
                    {"role": "user", "content": question},
                ],
                stream=False,
                temperature=temperature,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error occurred: {str(e)}"

    def summary_graph(
        self,
        graph_data: dict,
    ):
        prompt = get_graph_summary_prompt(graph_data=graph_data)
        return self.ask_question(prompt)
