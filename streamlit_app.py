import streamlit as st
from chatbot.university_search import load_university_data, search_universities
from chatbot.userprofile import load_user_profile, save_user_profile
from chatbot.faq_handler import ask_gpt
from datetime import datetime
import streamlit.components.v1 as components

st.set_page_config(page_title="UK Study Chatbot", page_icon=":mortar_board:", layout="centered")
st.markdown(
    """
    <style>
    .block-container {padding-top: 2rem;}
    #chat-scroll {height: 60vh; overflow-y: auto; padding-bottom: 1em;}
    .chat-row {display: flex; align-items: flex-end; margin-bottom: 1.2em;}
    .chat-row.user {justify-content: flex-end;}
    .chat-row.bot {justify-content: flex-start;}
    .chat-avatar {font-size: 2em; margin: 0 0.7em;}
    .chat-bubble {
        max-width: 60vw;
        padding: 0.9em 1.3em;
        border-radius: 1.5em;
        font-size: 1.1em;
        position: relative;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        word-break: break-word;
    }
    .chat-bubble.user {
        background: linear-gradient(135deg, #1a73e8 80%, #4285f4 100%);
        color: #fff;
        border-bottom-right-radius: 0.4em;
        margin-right: 0.2em;
        margin-left: 3vw;
        text-align: right;
    }
    .chat-bubble.bot {
        background: #23272f;
        color: #fff;
        border-bottom-left-radius: 0.4em;
        margin-left: 0.2em;
        margin-right: 3vw;
        text-align: left;
    }
    .timestamp {
        font-size: 0.85em;
        color: #aaa;
        margin-top: 0.3em;
        margin-left: 0.2em;
        margin-right: 0.2em;
        text-align: right;
    }
    .stTextInput>div>div>input {background: #23272f; color: #fff;}
    .stTextInput>div>div>input::placeholder {color: #aaa;}
    .stChatInputContainer {background: #181a20;}
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("UK Study Conversational Chatbot 🇬🇧")

user_id = st.text_input("Enter your email or name to personalize your experience:", key="user_id_input")

if not user_id:
    st.warning("Please enter your name or email to start chatting.")
    st.stop()

profile = load_user_profile(user_id)

# Each message: (speaker, msg, timestamp)
if "history" not in st.session_state:
    st.session_state.history = profile.get("history", [])

if "last_unis" not in st.session_state:
    st.session_state.last_unis = profile.get("last_unis", [])

data = load_university_data()

# --- MIGRATE OLD HISTORY ENTRIES TO INCLUDE TIMESTAMP ---
for i, entry in enumerate(st.session_state.history):
    if len(entry) == 2:
        speaker, msg = entry
        st.session_state.history[i] = (speaker, msg, "Earlier")

# --- Chat area with scroll-to-bottom and chat bubbles ---
chat_html = """
<div id="chat-scroll">
"""
for speaker, msg, timestamp in st.session_state.history:
    is_user = speaker == "You"
    avatar = "🧑" if is_user else "🤖"
    row_class = "user" if is_user else "bot"
    bubble_class = "user" if is_user else "bot"
    chat_html += f'''
    <div class="chat-row {row_class}">
        {('<div class="chat-avatar">{}</div>'.format(avatar)) if not is_user else ''}
        <div class="chat-bubble {bubble_class}">
            {msg}
            <div class="timestamp">{timestamp}</div>
        </div>
        {('<div class="chat-avatar">{}</div>'.format(avatar)) if is_user else ''}
    </div>
    '''
chat_html += "</div>"
# JavaScript to scroll to bottom
chat_html += """
<script>
var chatDiv = window.parent.document.querySelectorAll('section.main div[data-testid="stVerticalBlock"] div#chat-scroll')[0];
if (chatDiv) { chatDiv.scrollTop = chatDiv.scrollHeight; }
</script>
"""

components.html(chat_html, height=500, scrolling=True)

user_input = st.chat_input("Type your message and press Enter...", key="chat_input")

if user_input:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    st.session_state.history.append(("You", user_input, now))
    response = ""

    import re
    gpa = None
    ielts = None
    gpa_match = re.search(r"gpa[^\d]?(\d\.\d+)", user_input.lower())
    if gpa_match:
        gpa = gpa_match.group(1)
    ielts_match = re.search(r"ielts[^\d]?(\d(?:\.\d)?/?\d?\.\d?)", user_input.lower())
    if ielts_match:
        ielts = ielts_match.group(1)

    if "university" in user_input.lower() or gpa or ielts:
        results = search_universities(
            gpa=gpa, ielts=ielts, data=data
        )
        if results:
            st.session_state.last_unis = [uni["University"] for uni in results]
            response = (
                f"Based on your profile, you are eligible for: " +
                ", ".join(st.session_state.last_unis[:3]) +
                ".\n\nWhich one do you want to know more about?"
            )
        else:
            response = "Sorry, I couldn't find any universities matching your profile. Try different scores or criteria!"
    elif st.session_state.last_unis and any(uni.lower() in user_input.lower() for uni in st.session_state.last_unis):
        found_uni = next((uni for uni in st.session_state.last_unis if uni.lower() in user_input.lower()), None)
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
        try:
            response = ask_gpt(user_input)
        except Exception as e:
            response = f"Sorry, there was an error contacting the AI: {e}"

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    st.session_state.history.append(("Bot", response, now))
    profile["history"] = st.session_state.history
    profile["last_unis"] = st.session_state.last_unis
    save_user_profile(user_id, profile)

    st.experimental_rerun()

st.caption("Made by Yanish • Powered by Streamlit & Python")
