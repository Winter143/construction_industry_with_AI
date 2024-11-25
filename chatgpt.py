import google.generativeai as genai
import os

os.environ["API_KEY"] = 'AIzaSyABZX8cvpBPUcAwL6rS_frB6E0afbmhrtA'
genai.configure(api_key=os.environ["API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash-latest')
response = model.generate_content("Provide the activities of a construction project and the manpower and equipment needed")
print(response.text)
