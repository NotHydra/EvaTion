from excel import Excel
import json

class Main():
    def main():
        wb_cases = Excel("excel/cases.xlsx")

        value = wb_cases.get_value_multiple_2d("A2", "F31")
        json_array = []

        for i in value:
            if(type(i[3]) == str):
                i[3] = eval(i[3])

            temp_json_dictionary = {
                "id": i[0],
                "crime": i[1],
                "conclusion": i[2],
                "identity" : i[3],
                "case_is_guilty" : i[4],
                "rank": i[5]
            }

            json_array.append(temp_json_dictionary)

        json_object = json.dumps(json_array, indent = 4)

        with open("json/cases.json", "w") as outfile:
            outfile.write(json_object)

if(__name__ == "__main__"):
    Main.main()
