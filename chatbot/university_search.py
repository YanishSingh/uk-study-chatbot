import json
import re

def load_university_data(filepath="data/uk_universities_chatbot_ready.json"):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def extract_min_value(text, pattern=r'(\d+(\.\d+)?)'):
    """Extracts the first minimum numeric value found in text."""
    matches = re.findall(pattern, text)
    if matches:
        try:
            return float(matches[0][0])
        except:
            return None
    return None

def search_universities(gpa=None, ielts=None, level=None, keywords=None, data=None):
    if data is None:
        data = load_university_data()
    results = []

    gpa_val = float(gpa) if gpa else None
    ielts_val = float(ielts.split('/')[0]) if ielts and '/' in ielts else (float(ielts) if ielts else None)
    ielts_sub_val = float(ielts.split('/')[1]) if ielts and '/' in ielts else None

    for uni in data:
        uni_level_blob = (
            str(uni.get("Undergraduate", "")) + " " +
            str(uni.get("Postgraduate", "")) + " " +
            str(uni.get("Foundation_JointCAS", ""))
        ).lower()
        uni_text = uni_level_blob

        # GPA numeric filtering
        if gpa_val:
            uni_gpa = extract_min_value(uni_text, r'(\d\.\d+)')
            if uni_gpa and gpa_val < uni_gpa:
                continue

        # IELTS filtering (6/5.5 means main + subscores)
        if ielts_val:
            match = re.search(r'ielts.*?(\d\.\d)(?:[ /]*(\d\.\d))?', uni_text)
            if match:
                uni_ielts = float(match.group(1))
                uni_ielts_sub = float(match.group(2)) if match.group(2) else None
                # Student's scores must be >= requirement
                if ielts_val < uni_ielts:
                    continue
                if ielts_sub_val is not None and uni_ielts_sub and ielts_sub_val < uni_ielts_sub:
                    continue

        # Level (e.g., undergraduate, postgraduate, mres)
        if level and level.lower() not in uni_level_blob:
            continue

        # Keyword search
        if keywords:
            found = False
            for kw in keywords:
                if kw.lower() in uni_text:
                    found = True
                    break
            if not found:
                continue

        results.append(uni)
    return results

# For quick testing
if __name__ == "__main__":
    data = load_university_data()
    res = search_universities(gpa="3.65", ielts="6/5.5", level="undergraduate", data=data)
    print(f"Found {len(res)} universities")
    for u in res[:2]:
        print(u["University"])
