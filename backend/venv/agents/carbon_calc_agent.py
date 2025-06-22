class CarbonCalcAgent:
    def __init__(self, location):
        self.location = location

    def calculate_footprint(self):
        # Dummy value for now
        distance_km = 5  # pretend fixed travel
        co2_per_km = 0.21  # kg/km (for car)
        return round(distance_km * co2_per_km, 2)
