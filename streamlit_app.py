import streamlit as st
from chatbot.university_search import load_university_data, search_universities

# --- Load university data once
data = load_university_data()

st.set_page_config(page_title="UK Study Chatbot", page_icon=":mortar_board:")
st.title("UK Study Conversational Chatbot 🇬🇧")

if "history" not in st.session_state:
    st.session_state.history = []

if "last_unis" not in st.session_state:
    st.session_state.last_unis = []

user_input = st.chat_input("Ask me anything about UK study, universities, requirements, or life in the UK!")

if user_input:
    st.session_state.history.append(("You", user_input))
    response = ""

    # Very basic intent detection
    if any(word in user_input.lower() for word in ["gpa", "ielts"]):
        # Extract GPA/IELTS (simple pattern, can be improved)
        import re
        gpa = None
        ielts = None
        gpa_match = re.search(r"gpa[^\d]?(\d\.\d+)", user_input.lower())
        if gpa_match:
            gpa = gpa_match.group(1)
        ielts_match = re.search(r"ielts[^\d]?(\d(?:\.\d)?/?\d?\.\d?)", user_input.lower())
        if ielts_match:
            ielts = ielts_match.group(1)
        results = search_universities(
            gpa=gpa, ielts=ielts, data=data
        )
        if results:
            st.session_state.last_unis = [uni["University"] for uni in results]
            response = (
                f"Based on your profile, you are eligible for: " +
                ", ".join(st.session_state.last_unis[:3]) +
                ". Which one do you want to know more about?"
            )
        else:
            response = "Sorry, I couldn't find any universities matching your profile. Try different scores!"
    else:
        # Check if the question is about a university in last response
        found_uni = None
        for uni_name in st.session_state.last_unis:
            if uni_name.lower() in user_input.lower():
                found_uni = uni_name
                break
        if found_uni:
            # Give details about that university
            uni_obj = next((u for u in data if u["University"] == found_uni), None)
            if uni_obj:
                response = (
                    f"Here is more about {found_uni}:\n"
                    f"**Selling Points:** {uni_obj['SellingPoints']}\n"
                    f"**UG Requirements:** {uni_obj['Undergraduate']}\n"
                    f"**PG Requirements:** {uni_obj['Postgraduate']}\n"
                    f"**Reference:** {uni_obj['ReferenceLinks']}"
                )
            else:
                response = f"Sorry, I couldn't find more details for {found_uni}."
        else:
            response = "Ask me about universities, requirements, or student life in the UK!"

    st.session_state.history.append(("Bot", response))

# --- Display chat history
for speaker, msg in st.session_state.history:
    st.chat_message("user" if speaker == "You" else "assistant").write(msg)

st.caption("Made by Yanish • Powered by Streamlit & Python")
