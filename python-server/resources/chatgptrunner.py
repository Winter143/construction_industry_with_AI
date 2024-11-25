import google.generativeai as genai
import os
import json

class ChatgptRunner:
    def __init__(self, pname):
        self.project_name = pname.upper()
        
    def processGemini(self):
        os.environ["API_KEY"] = 'AIzaSyABZX8cvpBPUcAwL6rS_frB6E0afbmhrtA'
        genai.configure(api_key=os.environ["API_KEY"])

        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        if "REHABILITATION" in self.project_name:
            self.project_name = self.project_name.replace("REHABILITATION", "CONSTRUCTION")
        query = "Provide the activities required for the " + self.project_name + ", comma separated."
        response = model.generate_content(query)
        split_text = response.text.split(",")
        new_list = []
        for split in split_text:
            clean_text = split.replace("\n", "").strip().upper()
            if " AND " in clean_text:
                new_text = clean_text.replace("AND", "&")
            else:
                new_text = clean_text
            if "AND" in new_text:
                new_text = new_text.replace("AND", "").strip()
            new_list.append(new_text)
        
        new_list.append("OTHERS")    
        print(self.project_name)
        print(new_list)
        return new_list
