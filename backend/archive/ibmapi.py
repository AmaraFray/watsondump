# Depreceating this was tragic, it took me way too long to create a new assistant-ui hook for this to work just so the API can give up on me a couple hours before deploy

import os
import requests

from photoapi import insert_images

IBM_API_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
IBM_PROJECT_ID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

IBM_URL_TOKEN = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
IBM_URL_CHAT = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

def IBM_token():
    # Define the headers
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    # Define the data payload
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": IBM_API_KEY
    }

    # Make the POST request
    response = requests.post(IBM_URL_TOKEN, headers=headers, data=data)
    return response.json().get("access_token", "")


def IBM_chat(messages):
    token = IBM_token()
    
    input_text = """
<|start_of_role|>system<|end_of_role|>
You are Genesis. Given a topic, generate a markdown-formatted presentation meant for conversion into a PPT. Follow these strict rules:  

1. Each slide must start with a markdown header (e.g., `# Title`). Do **not** include slide numbers.  
2. Separate every slide with three dashes `---` to mark the end.  
3. Keep text concise and less than 10-15 words per slide.  
4. If an image is relevant, try to use more images, include `{image: keyword}` where "keyword" is a common word that describes the image topic. 
5. End the presentation with a markdown header `# End`.  

**Example Output:**  

# Business Casual  

---

- Professional attire  
- No jeans or t-shirts  
- Dress pants/skirts, blouses/shirts  

---  

# Business Formal  
- Suits and ties  
- Dress shoes  
- No casual wear  

{image: Business Formal}  

---  

# Casual Friday  
- Relaxed dress code  
- No jeans or shorts  
- Polo shirts, khakis, dress sandals  

{image: Business Casual}  

---  

# Dress Code Exceptions  
- Client meetings  
- Job interviews  
- Company events  

{image: Casual Friday}  

---  

# End  

<|end_of_text|>
"""

    for message in messages:
        role = message['role']
        content = message['content']
        input_text += f"<|start_of_role|>{role}<|end_of_role|>{content}<|end_of_text|>"
    body = {
	"input": input_text,
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 900,
            "min_new_tokens": 0,
            "repetition_penalty": 1
        },
        "model_id": "ibm/granite-13b-instruct-v2",
        "project_id": "3e82e8e4-f213-4e0e-9589-97afb9c7c6ad"
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }    
    
    
    response = requests.post(
        IBM_URL_CHAT,
        headers=headers,
        json=body
    )
    

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    response = response.json()
    
    answer = response["results"][0]["generated_text"]
    answer = sanitiseSoloImages(answer)
    answer = insert_images(answer)
    return answer
    
def sanitiseSoloImages(markdown):
    return markdown
    slides = markdown.split("---")
    newSlides = []
    for i, slide in enumerate(slides):
        if "{image:" in slide and (i == 0 or slides[i-1].strip() == ""):
            continue
        if "{image:" in slide:
            newSlides[-1] += "\n" + slide.strip()
        else:
            newSlides.append(slide.strip())
    return "\n---\n".join(newSlides)