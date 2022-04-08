import openpyxl
import json

class Excel():
    def __init__(self, path: str):
        self.path = path
        self.workbook = openpyxl.load_workbook(self.path)


    def check_range(range: any):
        if (type(range) not in (str, list)):
            raise TypeError("Range must be a type of string or list")

        elif (type(range) == str):
            if (range.isalpha() or range.isnumeric()):
                raise TypeError("Range string must be a combination of character and number")

        elif (type(range) == list):
            if (len(range) == 2):
                for i in range:
                    if type(i) not in (str, int):
                        raise TypeError("Range list can only have a type of string and integer for its values")

            else:
                raise TypeError("Range list can only have 2 values")
                

    def convert_range(range: any):
        Excel.check_range(range)

        if (type(range) == str):
            column = Excel.check_and_convert_string_value(''.join(x for x in range if not x.isdigit()))
            row = int(''.join(x for x in range if x.isdigit()))

        elif (type(range) == list):
            if (type(range[0]) == str):
                column = Excel.check_and_convert_string_value(range[0])
            
            elif (type(range[0]) == int):
                column = range[0]

            if (type(range[1]) == str):
                row = Excel.check_and_convert_string_value(range[1])
            
            elif (type(range[1]) == int):
                row = range[1]

        return column, row


    def check_and_convert_string_value(value: any):
        if(type(value) == str):
            value = [ord(x) - 96 for x in value.lower()]

            new_value = 0
            for i in range(len(value)):
                new_value += value[i] * 26**(len(value) - (i + 1))

        return new_value

    
    def attributes_string(list_of_attributes: any):
        attributes_string = ""
        for i, attribute in enumerate(list_of_attributes):
            if(i == 0):
                attributes_string += attribute
            
            else:
                attributes_string += f", {attribute}"

        return attributes_string


    def get_value_multiple_2d(self, start_range: any, end_range: any):
        start_column, start_row = Excel.convert_range(start_range)
        end_column, end_row = Excel.convert_range(end_range)

        value_array = []
        for row in range(start_row, end_row + 1):
            temp_value_array = []
            for column in range(start_column, end_column + 1):
                temp_value = self.workbook.active.cell(row = row, column = column).value
                temp_value_array.append(temp_value)
            
            value_array.append(temp_value_array)

        return value_array


class Main():
    def main():
        Main.cases()
        Main.upgrades()
        

    def cases():
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

    
    def upgrades():
        wb_cases = Excel("excel/upgrades.xlsx")

        json_array = []
        upgrades_cell_range = [
            ["D7", "I10"],
            ["K7", "P11"],
            # ["R7", "W8"],
            ["Y7", "AD8"]
        ]

        for i in upgrades_cell_range:
            json_array.append(Main.get_upgrades_value(wb_cases.get_value_multiple_2d(i[0], i[1])))


        json_object = json.dumps(json_array, indent = 4)

        with open("json/upgrades.json", "w") as outfile:
            outfile.write(json_object)


    def get_upgrades_value(value):
        json_array = []

        for i in value:
            temp_json_dictionary = {
                "id": i[0],
                "icon": i[1],
                "name": i[2],
                "type" : i[3],
                "amount" : i[4],
                "cost": i[5]
            }

            json_array.append(temp_json_dictionary)

        
        return json_array


if(__name__ == "__main__"):
    Main.main()
