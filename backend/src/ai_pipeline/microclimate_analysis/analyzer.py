import pandas as pd
from sklearn.cluster import KMeans
import numpy as np

def categorize_microclimate(temp_c: float, humidity_percent: float, rainfall_mm: float) -> str:
    """
    Categorizes a microclimate into predefined types based on temperature, humidity, and rainfall.
    These categories are simplified and can be expanded or refined based on ecological models.
    """
    if temp_c > 28 and humidity_percent < 40:
        return "hot-dry-desert"
    elif temp_c > 25 and humidity_percent >= 70 and rainfall_mm > 1000:
        return "hot-humid-tropical"
    elif temp_c >= 15 and temp_c <= 25 and humidity_percent >= 60 and rainfall_mm > 700:
        return "temperate-humid"
    elif temp_c >= 10 and temp_c < 15 and rainfall_mm > 500:
        return "cool-temperate"
    elif temp_c < 10 and rainfall_mm < 300:
        return "cold-dry-arid"
    elif temp_c < 0:
        return "polar-alpine"
    else:
        return "moderate"

def identify_microclimate_zones(data: pd.DataFrame, n_clusters: int = 3):
    """
    Identifies distinct microclimate zones within a dataset using KMeans clustering.
    This is useful for segmenting larger project areas with varied conditions.

    Args:
        data (pd.DataFrame): DataFrame containing location data with at least
                             'avg_temp_c', 'avg_humidity_percent', 'total_rainfall_mm'.
                             Each row could represent a different sub-location within a project.
        n_clusters (int): The number of microclimate clusters to identify.

    Returns:
        list: A list of dictionaries, where each dictionary describes a cluster
              (e.g., average temp, humidity, rainfall, and count of locations in that cluster).
    """
    required_cols = ['avg_temp_c', 'avg_humidity_percent', 'total_rainfall_mm']
    
    if data.empty or not all(col in data.columns for col in required_cols):
        print("Warning: Input data is empty or missing required columns for microclimate zoning.")
        return []

    # Drop rows with any NaN values in the features critical for clustering
    features_data = data[required_cols].dropna()

    if features_data.empty:
        print("Warning: No valid data points after dropping NaNs for microclimate zoning.")
        return []

    # Ensure n_clusters is not greater than the number of valid data points
    n_clusters = min(n_clusters, len(features_data))
    if n_clusters < 1: # Handle case where n_clusters might become 0
        return []

    # Standardize features for better clustering performance (optional but good practice)
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features_data)

    try:
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10) # n_init for modern KMeans
        clusters = kmeans.fit_predict(scaled_features)
        
        # Add cluster labels back to the original (non-scaled, non-NaN) data
        features_data['cluster'] = clusters
        
        cluster_descriptions = []
        for i in range(n_clusters):
            cluster_subset = features_data[features_data['cluster'] == i]
            if not cluster_subset.empty:
                desc = {
                    'cluster_id': i,
                    'avg_temp_c': cluster_subset['avg_temp_c'].mean(),
                    'avg_humidity_percent': cluster_subset['avg_humidity_percent'].mean(),
                    'total_rainfall_mm': cluster_subset['total_rainfall_mm'].mean(),
                    'count': len(cluster_subset),
                    'representative_category': categorize_microclimate(
                        cluster_subset['avg_temp_c'].mean(),
                        cluster_subset['avg_humidity_percent'].mean(),
                        cluster_subset['total_rainfall_mm'].mean()
                    )
                }
                cluster_descriptions.append(desc)
        
        return cluster_descriptions
    except Exception as e:
        print(f"Error during KMeans clustering: {e}")
        return []

# Example Usage (for testing purposes)
if __name__ == '__main__':
    # Test categorize_microclimate
    print("Categorizing microclimates:")
    print(f"29C, 30% H, 100mm R: {categorize_microclimate(29, 30, 100)}") # hot-dry-desert
    print(f"26C, 80% H, 1200mm R: {categorize_microclimate(26, 80, 1200)}") # hot-humid-tropical
    print(f"18C, 65% H, 800mm R: {categorize_microclimate(18, 65, 800)}") # temperate-humid
    print(f"5C, 20% H, 150mm R: {categorize_microclimate(5, 20, 150)}")   # cold-dry-arid
    print(f"22C, 55% H, 600mm R: {categorize_microclimate(22, 55, 600)}") # moderate

    # Test identify_microclimate_zones
    print("\nIdentifying microclimate zones:")
    sample_data = pd.DataFrame({
        'location_id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'avg_temp_c': [28, 30, 15, 12, 22, 20, 29, 10, 17, 25],
        'avg_humidity_percent': [35, 30, 70, 60, 55, 75, 40, 25, 68, 50],
        'total_rainfall_mm': [50, 80, 900, 700, 600, 1100, 120, 200, 750, 550]
    })
    
    zones = identify_microclimate_zones(sample_data, n_clusters=3)
    for zone in zones:
        print(f"Cluster {zone['cluster_id']}: Temp={zone['avg_temp_c']:.1f}C, Humid={zone['avg_humidity_percent']:.1f}%, Rain={zone['total_rainfall_mm']:.1f}mm, Count={zone['count']}, Category='{zone['representative_category']}'")

    # Test with empty data
    empty_data = pd.DataFrame(columns=['avg_temp_c', 'avg_humidity_percent', 'total_rainfall_mm'])
    empty_zones = identify_microclimate_zones(empty_data)
    print(f"\nEmpty data test: {empty_zones}")

    # Test with data having NaNs
    nan_data = pd.DataFrame({
        'location_id': [1, 2, 3],
        'avg_temp_c': [25, np.nan, 15],
        'avg_humidity_percent': [50, 70, np.nan],
        'total_rainfall_mm': [600, 800, 700]
    })
    nan_zones = identify_microclimate_zones(nan_data, n_clusters=2)
    print(f"\nNaN data test: {nan_zones}")