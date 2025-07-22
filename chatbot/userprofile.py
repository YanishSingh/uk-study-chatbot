import os
import json

DATA_DIR = "data/user_profiles"

def get_user_path(user_id):
    safe_user_id = user_id.lower().replace("@", "_at_").replace(".", "_dot_").replace(" ", "_")
    return os.path.join(DATA_DIR, f"{safe_user_id}.json")

def load_user_profile(user_id):
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    path = get_user_path(user_id)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    # New user, create a blank profile
    return {
        "user_id": user_id,
        "history": [],
        "preferences": {},
        "feedback": []
    }

def save_user_profile(user_id, profile):
    path = get_user_path(user_id)
    with open(path, "w") as f:
        json.dump(profile, f, indent=2)

# Example usage
if __name__ == "__main__":
    user_id = "test@example.com"
    profile = load_user_profile(user_id)
    print("Loaded profile:", profile)
    profile["preferences"]["gpa"] = 3.5
    save_user_profile(user_id, profile)
    print("Profile saved.")
