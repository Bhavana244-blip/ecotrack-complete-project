from fastapi import FastAPI
from models import Location
from agents.tracker_agent import TrackerAgent
from agents.carbon_calc_agent import CarbonCalcAgent
from agents.eco_advisor_agent import EcoAdvisorAgent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/track-location")
def track_user_location(loc: Location):
    tracker = TrackerAgent(loc.latitude, loc.longitude)
    location_data = tracker.get_location()

    calc_agent = CarbonCalcAgent(location_data)
    carbon = calc_agent.calculate_footprint()

    # Convert carbon footprint to pollution level (scale 0-100)
    pollution_level = min(int(carbon * 20), 100)  # tweak multiplier as needed

    advisor = EcoAdvisorAgent(carbon)
    advice = advisor.get_advice()

    return {
        "location": location_data,
        "carbon_footprint": carbon,
        "pollution_level": pollution_level,
        "advice": advice
    }


@app.get("/")
def root():
    return {"message": "EcoTrack backend is online💚"}
