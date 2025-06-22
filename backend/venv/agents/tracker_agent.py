class TrackerAgent:
    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude

    def get_location(self):
        return {
            "lat": self.latitude,
            "lng": self.longitude
        }
