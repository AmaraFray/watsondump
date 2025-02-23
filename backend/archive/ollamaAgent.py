## bee ai was just not working, so I had to use the old ollama agent to generate the ppt

import asyncio
import traceback

from pydantic import ValidationError

from beeai_framework.agents.bee.agent import BeeAgentExecutionConfig
from beeai_framework.backend.chat import ChatModel
from beeai_framework.backend.message import UserMessage
from beeai_framework.memory import UnconstrainedMemory
from beeai_framework.tools.search.duckduckgo import DuckDuckGoSearchTool
from beeai_framework.workflows.agent import AgentFactoryInput, AgentWorkflow
from beeai_framework.workflows.workflow import WorkflowError
from photoapi import insert_images

STARTER = """
<|start_of_role|>system<|end_of_role|>
You are Genesis, an AI that generates a markdown-formatted presentation for conversion into a PPT. Follow these rules:

1. Each slide must start with a markdown header (e.g., `# Title`).  
2. Separate slides with three dashes `---`.  
3. Do not use more than 10-15 words per slide.
4. If an image is relevant, add `{image: keyword}` where "keyword" describes the image topic.  
5. End with `# End`.  
<|end_of_text|>
"""

async def run_ppt_generator(topic: str) -> str:
    """Executes the agentic Markdown-to-PPT workflow and returns the markdown file path."""
    llm = ChatModel.from_name("ollama:granite3.1-dense:latest")
    
    try:
        workflow = AgentWorkflow(name="Markdown-PPT Generator")
        
        # Step 1: Initial Markdown Generation
        workflow.add_agent(
            agent=AgentFactoryInput(
                name="Genesis",
                instructions=STARTER,
                llm=llm,
                execution=BeeAgentExecutionConfig(max_iterations=3),
            )
        )

        # Step 2: Enhance Markdown Formatting
        workflow.add_agent(
            agent=AgentFactoryInput(
                name="Enhancer",
                instructions="Refine the markdown slides for clarity, conciseness, and coherence. Ensure text is well-structured.",
                llm=llm,
            )
        )

        # Step 3: Insert Image Placeholders
        workflow.add_agent(
            agent=AgentFactoryInput(
                name="Image Inserter",
                instructions="Analyze slide content and insert `{image: keyword}` placeholders where relevant.",
                tools=[DuckDuckGoSearchTool()],  # Optional: Used to identify image-related keywords
                llm=llm,
            )
        )

        # Step 4: Final Formatting Check
        workflow.add_agent(
            agent=AgentFactoryInput(
                name="Finalizer",
                instructions="Ensure the final markdown follows the structure correctly with proper slide separation and formatting.",
                llm=llm,
            )
        )

        memory = UnconstrainedMemory()
        await memory.add(UserMessage(content=f"Generate a presentation on: {topic}"))

        response = await workflow.run(messages=memory.messages)
        
        markdown_presentation = response.state.final_answer
        markdown_presentation = insert_images(markdown_presentation)  # Auto-insert images

        # Save the Markdown content to a file
        file_path = f"{topic.replace(' ', '_')}.md"
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(markdown_presentation)

        return file_path
    
    except (WorkflowError, ValidationError):
        traceback.print_exc()
        return "An error occurred while generating the presentation."


def generate_presentation(topic: str) -> str:
    """Runs the Markdown-to-PPT generation synchronously and returns the file path."""
    return asyncio.run(run_ppt_generator(topic))
