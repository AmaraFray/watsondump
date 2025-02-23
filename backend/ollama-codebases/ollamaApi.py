from ollama import chat
from ollama import ChatResponse
from photoapi import insert_images

STARTER = """
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

def get_chat_response(messages):
  response: ChatResponse = chat(model='granite3.1-dense:latest', messages=[
    {
      'role': 'system',
      'content': STARTER,
    },
  ] + messages)
  
  answer = response.message.content
  answer = insert_images(answer)
  
  return answer