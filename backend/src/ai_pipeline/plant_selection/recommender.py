from supabase import Client, create_client
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")

class PlantRecommender:
    def __init__(self):
        # Create a Supabase client with the service role key for backend operations
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    async def get_all_plant_species(self) -> List[Dict[str, Any]]:
        """
        Fetches all plant species from the 'plant_species' table in Supabase.
        """
        try:
            response = await self.supabase.table('plant_species').select('*').execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching all plant species: {e}")
            return []

    async def recommend_plants(
        self,
        microclimate_category: str,
        soil_type: str,
        ph_level: float,
        user_goals: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Recommends plant species based on microclimate, soil type, pH level, and user-defined goals.
        """
        try:
            query = self.supabase.table('plant_species').select('*')

            # Filter by microclimate_category
            query = query.contains('ideal_microclimate_tags', [microclimate_category])

            # Filter by soil type
            query = query.eq('ideal_soil_type', soil_type)
            
            # Filter by pH level
            if ph_level is not None:
                query = query.lte('ph_level_min', ph_level).gte('ph_level_max', ph_level)

            # Filter by user goals
            if user_goals:
                for goal in user_goals:
                    query = query.ilike('biodiversity_benefit', f'%{goal}%')

            response = await query.execute()
            if response.data:
                return sorted(
                    response.data,
                    key=lambda x: x.get('carbon_seq_rate_kg_per_year_per_plant', 0),
                    reverse=True
                )
            return []
        except Exception as e:
            print(f"Error recommending plants: {e}")
            return []


async def main_test_recommender():
    recommender = PlantRecommender()

    print("Fetching all plant species:")
    all_plants = await recommender.get_all_plant_species()
    print(f"Found {len(all_plants)} plants.")

    print("\nRecommending plants for temperate-humid, loamy soil, pH 6.5, pollinator-friendly:")
    recommended = await recommender.recommend_plants(
        microclimate_category="temperate-humid",
        soil_type="loamy",
        ph_level=6.5,
        user_goals=["pollinator-friendly"]
    )
    if recommended:
        for plant in recommended:
            print(
                f"- {plant.get('common_name')} ({plant.get('scientific_name')}), "
                f"Carbon Rate: {plant.get('carbon_seq_rate_kg_per_year_per_plant')} kg/year"
            )
    else:
        print("No plants recommended for these criteria.")

    print("\nRecommending plants for hot-dry-desert, sandy soil, pH 7.0:")
    recommended_dry = await recommender.recommend_plants(
        microclimate_category="hot-dry-desert",
        soil_type="sandy",
        ph_level=7.0
    )
    if recommended_dry:
        for plant in recommended_dry:
            print(f"- {plant.get('common_name')} ({plant.get('scientific_name')})")
    else:
        print("No plants recommended for these criteria.")


if __name__ == '__main__':
    import asyncio
    asyncio.run(main_test_recommender())