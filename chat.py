import google.generativeai as genai
import os
import json

os.environ["API_KEY"] = 'AIzaSyABZX8cvpBPUcAwL6rS_frB6E0afbmhrtA'
genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash-latest')
response = model.generate_content("Provide the activities of a construction of gymnasium. store it in a python list named as items and the first element as empty.")
clean_text = response.text.replace("items =", "").replace("[", "").replace("]", "").replace("python", "").replace("\n", "").replace("`", "").replace("  ", "").replace("\\", "").strip()
split_text = clean_text.split(",")
new_list = []
for split in split_text:
    clean_splits = split.replace('"', "").strip()
    new_list.append(clean_splits)
print(new_list)