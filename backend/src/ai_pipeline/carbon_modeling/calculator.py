from typing import List, Dict, Any

def calculate_carbon_sequestration_projection(
    plant_selections: List[Dict[str, Any]], years: int = 20
) -> Dict[str, Any]:
    """
    Calculates the projected carbon sequestration over a specified number of years
    based on a list of selected plants and their quantities.

    Args:
        plant_selections (List[Dict[str, Any]]): A list where each dictionary represents
            a selected plant and its quantity. Each dictionary *must* contain:
            - 'carbon_seq_rate_kg_per_year_per_plant': float (e.g., kg of CO2e sequestered per plant per year)
            - 'quantity': int (number of this specific plant species)
            Example: [{'common_name': 'Oak', 'carbon_seq_rate_kg_per_year_per_plant': 22.5, 'quantity': 10}]
        years (int): The number of years for which to project the sequestration.

    Returns:
        Dict[str, Any]: A dictionary containing:
            - 'total_carbon_kg_over_years': Total estimated carbon sequestered over the full period.
            - 'annual_cumulative_breakdown_kg': A dictionary with year as key and cumulative
                                               carbon sequestered up to that year as value.
    """
    if not isinstance(plant_selections, list):
        raise TypeError("plant_selections must be a list of dictionaries.")
    if not all(isinstance(p, dict) for p in plant_selections):
        raise ValueError("Each item in plant_selections must be a dictionary.")
    if not isinstance(years, int) or years <= 0:
        raise ValueError("years must be a positive integer.")

    annual_breakdown = {}
    total_carbon_sequestered_cumulative = 0.0

    # Calculate the annual sequestration rate for the entire selection
    total_annual_sequestration_rate = 0.0
    for plant in plant_selections:
        rate = plant.get('carbon_seq_rate_kg_per_year_per_plant')
        quantity = plant.get('quantity')

        if rate is None or quantity is None:
            print(f"Warning: Skipping plant due to missing 'carbon_seq_rate_kg_per_year_per_plant' or 'quantity': {plant}")
            continue
        if not isinstance(rate, (int, float)) or not isinstance(quantity, int) or quantity < 0:
            print(f"Warning: Skipping plant due to invalid rate or quantity type/value: {plant}")
            continue

        total_annual_sequestration_rate += (rate * quantity)

    # Project sequestration over the specified years
    for year in range(1, years + 1):
        total_carbon_sequestered_cumulative += total_annual_sequestration_rate
        annual_breakdown[year] = round(total_carbon_sequestered_cumulative, 2) # Round for readability

    return {
        "total_carbon_kg_over_years": round(total_carbon_sequestered_cumulative, 2),
        "annual_cumulative_breakdown_kg": annual_breakdown
    }

# Example Usage (for testing purposes)
if __name__ == '__main__':
    # Define a list of selected plants with their carbon sequestration rates and quantities
    example_plant_selections = [
        {"common_name": "Oak Tree", "carbon_seq_rate_kg_per_year_per_plant": 22.5, "quantity": 50},
        {"common_name": "Maple Tree", "carbon_seq_rate_kg_per_year_per_plant": 18.0, "quantity": 75},
        {"common_name": "Pine Tree", "carbon_seq_rate_kg_per_year_per_plant": 25.0, "quantity": 30},
    ]

    projection_years = 10
    print(f"Calculating carbon sequestration projection for {projection_years} years:")
    projections = calculate_carbon_sequestration_projection(example_plant_selections, projection_years)
    
    print(f"\nTotal Carbon Sequestered over {projection_years} years: {projections['total_carbon_kg_over_years']} kg CO2e")
    print("\nAnnual Cumulative Breakdown:")
    for year, cumulative_kg in projections['annual_cumulative_breakdown_kg'].items():
        print(f"Year {year}: {cumulative_kg} kg CO2e")

    # Test with no plants
    print("\nTest with no plants:")
    no_plants_projection = calculate_carbon_sequestration_projection([], 5)
    print(no_plants_projection)

    # Test with missing data for a plant
    print("\nTest with missing plant data:")
    missing_data_plants = [
        {"common_name": "Willow", "carbon_seq_rate_kg_per_year_per_plant": 15.0, "quantity": 5},
        {"common_name": "Shrub", "quantity": 10}, # Missing rate
    ]
    missing_data_projection = calculate_carbon_sequestration_projection(missing_data_plants, 5)
    print(missing_data_projection)