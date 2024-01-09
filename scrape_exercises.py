import requests
import time
from bs4 import BeautifulSoup

num = 1
with open("exercises.json" , "w") as f:
    f.write('"workouts": [\n')
    while (True):
        html = requests.get(f"https://www.bodybuilding.com/exercises/finder/{num}/?exercise-type=strength&equipment=bands,barbell,kettlebells,machine,cable,dumbbell,ez-curl-bar").text
        if (html.find("No exercises were found that matched the selected options.") != -1):
            break
        soup = BeautifulSoup(html, 'html.parser')
        entries = soup.find_all("div", class_="ExResult-row flexo-container flexo-between")
        for entry in entries:
            name_muscle = entry.find("div", class_="ExResult-cell ExResult-cell--nameEtc")
            name = name_muscle.find("h3", class_="ExHeading ExResult-resultsHeading").get_text(strip=True)
            muscle = name_muscle.find("div", class_="ExResult-details ExResult-muscleTargeted").get_text(strip=True).replace("Muscle Targeted:","")
            rating = entry.find("div", class_="ExResult-cell ExResult-cell--rating").find("div",class_="ExRating-badge").get_text(strip=True)
            if rating == "n/a": continue
            f.write(f'    {{"name": "{name}", "target": "{muscle}", "rating": {rating}, "data": []}},\n')
        num += 1
    f.write("],")
