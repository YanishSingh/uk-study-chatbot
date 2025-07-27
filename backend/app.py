from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot.university_search import search_universities, load_university_data
from chatbot.faq_handler import ask_gpt

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

data = load_university_data()

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    gpa = request.json.get('gpa')
    ielts = request.json.get('ielts')
    last_unis = request.json.get('last_unis', [])

    # Your logic (simplified)
    import re
    gpa_match = re.search(r"gpa[^\d]?(\d\.\d+)", user_message.lower())
    if gpa_match:
        gpa = gpa_match.group(1)
    ielts_match = re.search(r"ielts[^\d]?(\d(?:\.\d)?/?\d?\.\d?)", user_message.lower())
    if ielts_match:
        ielts = ielts_match.group(1)

    if "university" in user_message.lower() or gpa or ielts:
        results = search_universities(gpa=gpa, ielts=ielts, data=data)
        if results:
            last_unis = [uni["University"] for uni in results]
            response = (
                f"Based on your profile, you are eligible for: " +
                ", ".join(last_unis[:3]) +
                ".\n\nWhich one do you want to know more about?"
            )
        else:
            response = "Sorry, I couldn't find any universities matching your profile. Try different scores or criteria!"
    elif last_unis and any(uni.lower() in user_message.lower() for uni in last_unis):
        found_uni = next((uni for uni in last_unis if uni.lower() in user_message.lower()), None)
        if found_uni:
            uni_obj = next((u for u in data if u["University"] == found_uni), None)
            if uni_obj:
                response = (
                    f"**{found_uni}**\n\n"
                    f"**Selling Points:** {uni_obj.get('SellingPoints', 'N/A')}\n"
                    f"**UG Requirements:** {uni_obj.get('Undergraduate', 'N/A')}\n"
                    f"**PG Requirements:** {uni_obj.get('Postgraduate', 'N/A')}\n"
                    f"**Reference:** {uni_obj.get('ReferenceLinks', 'N/A')}"
                )
            else:
                response = f"Sorry, I couldn't find more details for {found_uni}."
        else:
            response = ask_gpt(user_message)
    else:
        response = ask_gpt(user_message)

    return jsonify({"response": response, "last_unis": last_unis})

if __name__ == '__main__':
    app.run(debug=True)