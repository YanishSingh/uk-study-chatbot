import openai
import os

def ask_gpt(question, api_key=None):
    if api_key is None:
        api_key = os.getenv("OPENAI_API_KEY")
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": (
                "You are an expert advisor for Nepali students planning to study in the UK. "
                "Answer clearly, mentioning UK laws, visa rules, job options, and what living in the UK is like for students."
            )},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content.strip()

# For quick testing:
if __name__ == "__main__":
    print(ask_gpt("What are the working hour rules for international students in the UK?"))
