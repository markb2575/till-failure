import requests
import time
from bs4 import BeautifulSoup

# url = "https://fitnessprogramer.com/exercises/page/"
num = 1
with open("exercises.json" , "w") as f:
    f.write('    "workouts": [')
    while (True):
        html = requests.get(f"https://fitnessprogramer.com/exercises/page/{num}").text
        if (html.find("No Results Found") != -1):
            break
        soup = BeautifulSoup(html, 'html.parser')
        entries = soup.find_all("article", class_="entry")
        for entry in entries:
            try:
                main_info = entry.find("div", class_="main_info")

                # Extracting exercise name
                exercise_name = main_info.find("h2", class_="title").get_text(strip=True)

                # Extracting equipment_required
                equipment_label = main_info.find("div", class_="exercise_meta equipment").find("label").get_text(strip=True)
                equipment_value = main_info.find("div", class_="exercise_meta equipment").get_text(strip=True, separator=' ')
                equipment_required = "true"
                if (equipment_value.find("NO EQUIPMENT") != -1): equipment_required = "false"

                # Extracting primary muscles
                muscles_value = main_info.find("div", class_="exercise_meta primary_muscles")
                if (muscles_value == None): continue
                muscles_value = muscles_value.get_text(strip=True, separator=' ').replace("Calisthenic","").replace("Neck","").replace("Erector Spinae","").replace("Full Body","").replace("Abs / Core","Abs").replace("Back / Wing","Back").replace("Primary Muscles: ", '"').replace(", ",'", "') + '"'
                muscles_value = muscles_value.replace(', ""',"").replace('"",',"").replace('""',"")
                if (muscles_value == "" or muscles_value.find("Cardio") != -1 or muscles_value.find("Yoga") != -1): continue
                print(f'{{"name": "{exercise_name}", "targets": [{muscles_value}], "equipment_required": {equipment_required}, "data": []}}, {num}')
                f.write(f'{{"name": "{exercise_name}", "targets": [{muscles_value}], "equipment_required": {equipment_required}, "data": []}},\n')
            except:
                continue
        num += 1
    f.write("    ],")
    # time.sleep(2)
        
# html = requests.get(f"https://fitnessprogramer.com/exercises/page/{num}").text
# muscles = {}
# soup = BeautifulSoup(html, 'html.parser')
# entries = soup.find_all("article", class_="entry")

# for entry in entries:
    # main_info = entry.find("div", class_="main_info")

    # # Extracting exercise name
    # exercise_name = main_info.find("h2", class_="title").get_text(strip=True)

    # # Extracting equipment_required
    # equipment_label = main_info.find("div", class_="exercise_meta equipment").find("label").get_text(strip=True)
    # equipment_value = main_info.find("div", class_="exercise_meta equipment").get_text(strip=True, separator=' ')
    # equipment_required = "true"
    # if (equipment_value.find("NO EQUIPMENT") != -1): equipment_required = "false"

    # # Extracting primary muscles
    # muscles_value = main_info.find("div", class_="exercise_meta primary_muscles").get_text(strip=True, separator=' ').replace("Cardio","").replace("Erector Spinae","").replace("Full Body","").replace("Abs / Core","Abs").replace("Back / Wing","Back").replace("Primary Muscles: ", '"').replace(", ",'", "') + '"'
    # muscles_value = muscles_value.replace(', ""',"").replace('"",',"").replace('""',"")
    # if (muscles_value == ""): continue

    # print(f'{{"name": "{exercise_name}", "targets": [{muscles_value}], "equipment_required": {equipment_required}, "data": []}},')
