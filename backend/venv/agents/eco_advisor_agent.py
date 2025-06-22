class EcoAdvisorAgent:
    def __init__(self, carbon_value):
        self.carbon = carbon_value

    def get_advice(self):
        if self.carbon < 1:
            return "You're a Eco God/Goddess 💚"
        elif self.carbon < 5:
            return "Keep walking. You're doing Great!"
        else:
            return "Ditch the car, grab a bike, and save the  Earth 🌍"
