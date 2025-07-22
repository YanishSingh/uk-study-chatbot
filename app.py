from chatbot.university_search import load_university_data, search_universities
from chatbot.faq_handler import ask_gpt
from dotenv import load_dotenv
import os

load_dotenv()  # Load your .env file

def main():
    print("Welcome to the UK Study Chatbot for Nepali Students!")
    data = load_university_data()
    while True:
        print("\nType:")
        print(" 1. 'uni' to search universities")
        print(" 2. 'faq' to ask about life, laws, or jobs in the UK")
        print(" 3. 'exit' to quit")
        choice = input("Enter option: ").strip().lower()
        if choice == 'exit':
            print("Goodbye!")
            break
        elif choice == 'uni':
            gpa = input("Enter your GPA (or press Enter to skip): ").strip()
            ielts = input("Enter your IELTS score (or press Enter to skip): ").strip()
            level = input("Program level (undergraduate/postgraduate/mres, or leave blank): ").strip()
            keywords = input("Any keywords (comma separated, or leave blank): ").strip()
            kw_list = [k.strip() for k in keywords.split(',')] if keywords else None
            matches = search_universities(gpa=gpa if gpa else None, ielts=ielts if ielts else None, level=level, keywords=kw_list, data=data)
            print(f"\nFound {len(matches)} universities:")
            for uni in matches[:5]:
                print("-", uni['University'])
            if not matches:
                print("No universities found. Try different filters.")
        elif choice == 'faq':
            q = input("Ask your question about UK student life, laws, or jobs: ")
            print("Bot:", ask_gpt(q))
        else:
            print("Invalid option. Try again.")

if __name__ == "__main__":
    main()
