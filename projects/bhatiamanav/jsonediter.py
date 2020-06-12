#https://stackoverflow.com/questions/13949637/how-to-update-json-file-with-python
import json

def onestaredit(): 
	with open("onestar.json", "r") as jsonFile:
	    data = json.load(jsonFile)

	jsonFile.close()

	for i in data:
		if i["city"] == "San Francisco":
			i["group"] = 1
		if i["city"] == "Los Angeles":
			i["group"] = 2
		if i["city"] == "New York":
			i["group"] = 3
		i["star"] = 1

	with open("onestar.json", "w+") as jsonFile:
		json.dump(data, jsonFile)


def twostaredit(): 
	with open("twostar.json", "r") as jsonFile:
	    data = json.load(jsonFile)

	jsonFile.close()

	for i in data:
		if i["city"] == "San Francisco":
			i["group"] = 1
		if i["city"] == "Los Angeles":
			i["group"] = 2
		if i["city"] == "New York":
			i["group"] = 3
		i["star"] = 2

	with open("twostar.json", "w+") as jsonFile:
		json.dump(data, jsonFile)


def threestaredit(): 
	with open("threestar.json", "r") as jsonFile:
	    data = json.load(jsonFile)

	jsonFile.close()

	for i in data:
		if i["city"] == "San Francisco":
			i["group"] = 1
		if i["city"] == "Los Angeles":
			i["group"] = 2
		if i["city"] == "New York":
			i["group"] = 3
		i["star"] = 3

	with open("threestar.json", "w+") as jsonFile:
		json.dump(data, jsonFile)

def createLinks(): 
	with open("restaurant.json", "r") as jsonFile:
	    data = json.load(jsonFile)

	jsonFile.close()

	sf = {}
	la = {}
	ny = {}
	for i in data["nodes"]:
		print(i["zipCode"])

		if i["city"] == "San Francisco":
			if i["zipCode"] in sf:
				newLink = {"source": sf.get(i["zipCode"]), "target": i["name"]}
				data["links"].append(newLink)
				sf[i["zipCode"]] = i["name"]
			else:
				sf[i["zipCode"]] = i["name"]
		if i["city"] == "Los Angeles":
			if i["zipCode"] in la:
				newLink = {"source": la.get(i["zipCode"]), "target": i["name"]}
				data["links"].append(newLink)
				la[i["zipCode"]] = i["name"]
			else:
				la[i["zipCode"]] = i["name"]
		if i["city"] == "New York":
			if i["zipCode"] in ny:
				newLink = {"source": ny.get(i["zipCode"]), "target": i["name"]}
				data["links"].append(newLink)
				ny[i["zipCode"]] = i["name"]
			else:
				ny[i["zipCode"]] = i["name"]

	with open("restaurant.json", "w+") as jsonFile:
		json.dump(data, jsonFile)

#onestaredit()
#twostaredit()
#threestaredit()
#createLinks()
