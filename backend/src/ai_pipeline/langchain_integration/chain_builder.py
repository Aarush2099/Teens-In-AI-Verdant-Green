from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import ChatPromptTemplate
# For local LLM (e.g., Ollama, Llama.cpp)
from langchain_community.llms import Ollama 
# For OpenAI or other commercial LLMs, uncomment and configure
# from langchain_openai import ChatOpenAI 
from langchain_core.tools import tool # Standard way to create a LangChain tool
from typing import List, Dict, Any, Optional

# Import your PlantRecommender class (assuming it's relative to this file's location)
# Adjust path if your main.py import structure is different.
# If this file is only for agent building and recommender is passed in, this relative import might not be strictly needed here.
# For standalone testing of chain_builder, you might need a mock or actual instance.
from backend.src.ai_pipeline.plant_selection.recommender import PlantRecommender 


# Define a custom tool using the @tool decorator
# This tool will wrap the functionality of your PlantRecommender class
@tool
def recommend_plants_tool(
    microclimate_category: str,
    soil_type: str,
    ph_level: float,
    user_goals: Optional[List[str]] = None
) -> str:
    """
    Recommends plant species based on specific environmental conditions and user goals.
    Input should be a JSON string with 'microclimate_category', 'soil_type', 'ph_level' (float),
    and optionally 'user_goals' (list of strings).
    Example: {"microclimate_category": "temperate-humid", "soil_type": "loamy", "ph_level": 6.5, "user_goals": ["pollinator-friendly"]}
    """
    # This function needs an instance of PlantRecommender to actually work.
    # In a real application, this tool instance would likely be passed or
    # the recommender would be initialized within the FastAPI app and passed to the agent.
    # For now, let's assume `plant_recommender_instance` is available in the scope
    # where this tool is used, or initialize a new one for demonstration.

    # IMPORTANT: In a production setup, avoid initializing the recommender inside the tool
    # every time it's called. Pass it as a dependency or use a global singleton if appropriate
    # for your application's architecture (e.g., FastAPI's dependency injection).
    try:
        current_recommender = PlantRecommender() # Re-initialize for simplicity in tool definition example
        # In an actual FastAPI app, you'd pass the initialized recommender here.
        # e.g., current_recommender = tool_context.get('plant_recommender')

        # Convert user_goals to list if it's None or a single string
        goals_list = user_goals if isinstance(user_goals, list) else ([user_goals] if user_goals else [])

        recommended = asyncio.run(current_recommender.recommend_plants(
            microclimate_category=microclimate_category,
            soil_type=soil_type,
            ph_level=ph_level,
            user_goals=goals_list
        ))
        
        if recommended:
            return "Recommended plants: " + ", ".join([p.get('common_name', p.get('scientific_name', 'Unknown Plant')) for p in recommended])
        else:
            return "No plants found for the given criteria."
    except Exception as e:
        return f"Error recommending plants: {e}. Please ensure inputs are correct and backend is running."

def build_ai_agent(recommender_instance: PlantRecommender):
    """
    Builds a LangChain ReAct agent capable of interacting with a PlantRecommenderTool.

    Args:
        recommender_instance (PlantRecommender): An initialized instance of your PlantRecommender.

    Returns:
        AgentExecutor: A configured LangChain agent ready to process queries.
    """
    # Pass the actual recommender_instance to the tool's context or modify the tool definition
    # to receive it properly. For this simplified @tool, we're relying on it being accessible
    # or being passed during tool creation. A more robust way might be to define the tool class
    # and pass the recommender during its instantiation.
    
    # Let's override the `recommend_plants_tool` to use the provided instance
    # This is a bit of a hack for the @tool decorator; typically you'd define a class-based tool
    # and pass dependencies in its constructor.
    # For a simple @tool, we need to ensure it uses the provided recommender_instance.
    # A cleaner approach for production is often a Pydantic-based tool or a custom Tool class.

    # Example of a more robust way (if not using @tool directly on a function):
    # class PlantRecommenderTool(BaseTool):
    #     name = "plant_recommender"
    #     description = "Useful for recommending plants based on microclimate, soil, pH, and user goals."
    #     recommender: PlantRecommender # Inject the recommender instance

    #     def _run(self, microclimate_category: str, soil_type: str, ph_level: float, user_goals: Optional[List[str]] = None):
    #         # ... call recommender.recommend_plants ...

    #     def _arun(self, microclimate_category: str, soil_type: str, ph_level: float, user_goals: Optional[List[str]] = None):
    #         # ... call async recommender.recommend_plants ...

    # Now, let's make the `@tool` version work with the injected instance:
    # We can't directly inject into the @tool function easily with its current signature
    # without making it a method of a class. So, for the purpose of this example,
    # let's modify the `recommend_plants_tool` function to temporarily use the passed instance
    # (or you should adopt the `BaseTool` class approach above).

    # For now, let's redefine the tool using functools.partial or make the recommender a global
    # or ensure it's loaded in the tool's execution context.
    # The simplest for this example is to instantiate it inside the tool (as done above),
    # but be aware of performance implications if the tool is called frequently.

    tools = [recommend_plants_tool] # Our single tool

    # Choose your LLM. For local development, Ollama is great.
    llm = Ollama(model="llama2") # Ensure 'llama2' model is pulled via Ollama
    # llm = ChatOpenAI(model="gpt-4-turbo", temperature=0) # For OpenAI

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI assistant for carbon sequestration planning. Your primary role is to help users find suitable plants for their projects based on environmental data and their goals. You have access to a plant recommendation tool. Always explain your recommendations clearly and concisely."),
        ("human", "{input}"),
        ("ai", "{agent_scratchpad}"), # This is where the agent's thoughts and tool outputs go
    ])

    # Create the ReAct agent
    agent = create_react_agent(llm, tools, prompt)
    
    # Create the AgentExecutor to run the agent
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True, # Set to True to see the agent's thought process and tool calls
        handle_parsing_errors=True # Good for debugging agent issues
    )
    
    return agent_executor

# Example Usage (for testing purposes, run asynchronously)
async def main_test_agent():
    print("Initializing PlantRecommender...")
    recommender = PlantRecommender() # This instance will be passed to the agent builder

    print("Building AI agent...")
    agent = build_ai_agent(recommender)

    print("\n--- Agent Query 1: Plant recommendation for specific conditions ---")
    query1 = "I need plants for a hot-humid-tropical microclimate, loamy soil, and pH 6.0. I want them to be low-water."
    response1 = await agent.ainvoke({"input": query1})
    print("Agent Response 1:", response1['output'])

    print("\n--- Agent Query 2: General plant inquiry ---")
    query2 = "What are some good plants for carbon sequestration in a temperate-humid region with clay soil?"
    response2 = await agent.ainvoke({"input": query2})
    print("Agent Response 2:", response2['output'])

    print("\n--- Agent Query 3: Invalid request / No tool needed ---")
    query3 = "Tell me a joke about a tree."
    response3 = await agent.ainvoke({"input": query3})
    print("Agent Response 3:", response3['output'])


if __name__ == '__main__':
    import asyncio
    # Ensure your .env is set up and your Supabase 'plant_species' table has data
    # Ensure Ollama is running and has 'llama2' model pulled (if using Ollama)
    # e.g., from terminal: ollama run llama2
    asyncio.run(main_test_agent())