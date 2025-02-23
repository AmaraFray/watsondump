from sentence_transformers import SentenceTransformer, util
import requests
import re
from pinecone import Pinecone

access_key = "XXXXXXXXXXXXX"
pexels_api = "LfBCuoXYfrJWwYubz2Pqhj7PZiz8Esv6gahbgkkk6d6kUHVqYj2XgGZ1"

pineconeUrl = "XXXXXXXX.pinecone.io"

def insert_images(markdown_text):
    def replace_with_image(match):
        keyword = match.group(1)
        try :
            return f"![]({pexels(keyword)})"
        except: 
            print("MISS")
            return ""
    
    return re.sub(r"{image: (.*?)}", replace_with_image, markdown_text)

def unsplash(q):
    url = f"https://api.unsplash.com/search/photos/?query={q}&client_id={access_key}"
    response = requests.get(url)
       
def pexels(q):
    q = q.strip().replace(" ", "+")
    url = f"https://api.pexels.com/v1/search?query={q}&per_page=1"
    headers = {
        "Authorization": pexels_api
    }
    response = requests.get(url, headers=headers)
    return response.json()['photos'][0]['src']['landscape']

def queryPinecone(q):
    model_path = "ibm-granite/granite-embedding-125m-english"
    pc = Pinecone(api_key="XXXXXXXXXX")
    model = SentenceTransformer(model_path)
    queryEmbeddings = model.encode(q)
    
    index = pc.Index("your-index-name")

    response = index.query(
        vector=queryEmbeddings.tolist(),
        top_k=10,
        namespace="ns1"
    )
    
    return response['data'][0]['url']
    
    