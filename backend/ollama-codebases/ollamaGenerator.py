from ollama import chat
from ollama import ChatResponse
import sqlite3
import re

def save_to_database(content):
  conn = sqlite3.connect('/path/to/your/database.db')
  cursor = conn.cursor()
  cursor.execute('INSERT INTO templates (content) VALUES (?)', (content,))
  
  #TODO : generate a description for these
  
  conn.commit()
  conn.close()

def extractCodeBlocks(text):
  return re.findall(r'\[.*?\]', text)


STARTER = """
# Template Generator Specification  

## Overview  
You are a helper AI responsible for generating structured templates and layouts for presentations. Layouts are defined using a concise syntax that organizes content in **Rows** and **Columns**, supporting flexible nesting and structured arrangements.  

## Layout Rules  

1. **Row (R) and Column (C) Structure**  
   - Every layout starts with either `R` (Row) or `C` (Column).  
   - Rows and Columns can be **nested** within each other.  
   - Nesting allows for complex hierarchical layouts.  

2. **Flex Distribution**  
   - The proportions of each section are defined inside parentheses `(...)`, representing their relative space distribution.  
   - For example, `R(2,1,1)` means the first section takes **twice** the space of the second and third sections.  

3. **Content Definition**  
   - The content of each section is enclosed in square brackets `[...]`.  
   - Content types include:  
     - `h1`, `p`, `pre`, `b`, `code`, and `img`.  
   - Nested layouts can replace content to create complex structures.  

4. **Content Constraints**  
   - Layouts **cannot** be nested inside content elements (`h1`, `p`, `pre`, `b`, `code`, `img`).  
   - Content elements must be placed as direct children within a layout structure.  

---

## Examples  

### 1. Simple Row Layout  
```plaintext
R(2,2,1)[ h2, h3, pre ]
```
**Structure Breakdown:**  
- A **Row** with three sections:  
  1. **Title** (`h2`), Flex: `2`  
  2. **Subtitle** (`h3`), Flex: `2`  
  3. **Code Block** (`pre`), Flex: `1`  

---

### 2. Nested Column inside a Row  
```plaintext
R(2,1)[ h1, C(1,1)[b, code] ]
```
**Structure Breakdown:**  
- A **Row** with two sections:  
  1. **Header** (`h1`), Flex: `2`  
  2. A **Column** (Flex: `1`), containing:  
     - **Bold Text** (`b`), Flex: `1`  
     - **Inline Code** (`code`), Flex: `1`  

---

### 3. Deep Nesting Example  
```plaintext
C(1,2)[ R(2,1)[h1, h2], pre ]
```
**Structure Breakdown:**  
- A **Column** with two sections:  
  1. A **Row** (Flex: `1`), containing:  
     - **Main Title** (`h1`), Flex: `2`  
     - **Subheading** (`h2`), Flex: `1`  
  2. **Code Block** (`pre`), Flex: `2`  
"""

def get_chat_response_template(messages):
  response: ChatResponse = chat(model='granite3.1-dense:latest', messages=[
    {
      'role': 'system',
      'content': STARTER,
    },
  ] + messages)
  
  answer = response.message.content
  
  save_to_database(extractCodeBlocks(answer))
  return answer

# get_chat_response([{
#     'role': 'user',
#     'content' : 'I want a template with a title and subtitle the subtitle will be longer than the title'
# }])