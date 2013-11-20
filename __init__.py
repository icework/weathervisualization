__author__ = 'kai'
import json
from flask import Flask, render_template
from flaskext.mysql import MySQL
app = Flask(__name__)
mysql = MySQL()
mysql.init_app(app)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '881220wk'
app.config['MYSQL_DATABASE_DB'] = 'WeatherData'
app.config['DEBUG'] = True


@app.route("/test")
def hello():
    cursor = mysql.get_db().cursor()
    cursor.execute('SELECT Tmax FROM weather where WBAN = "3013"')
    rows = cursor.fetchall()
    return json.dumps(rows)

@app.route("/")
def mainPage():
    return render_template('weather.html')

@app.route("/citylist")
def cityList():
    cursor = mysql.get_db().cursor()
    cursor.execute('SELECT cityName FROM cityMap')
    rows = cursor.fetchall()
    result = []
    for city in rows:
        result.append(city[0])
    return json.dumps(result)

def checkRational(number):
    try:
        float(number)
        return True
    except ValueError:
        return False


def getTmpFor(cityname):
    cursor = mysql.get_db().cursor()
    sql = 'SELECT wban FROM cityMap WHERE cityName="' + cityname + '"'
    cursor.execute(sql)
    rows = cursor.fetchall()
    wban = str(rows[0][0])
    sql = 'SELECT weatherDate, Tavg FROM weather WHERE WBAN="' + wban + '"'
    cursor.execute(sql)
    rows = getDataFromDB(cityname, 'Tavg')
    lineObject = {}
    lineObject['key'] = cityname
    lineData = []
    formerTavg = 0
    count = 0
    for i in rows:
        day = {'x': count}
        tavg = formerTavg
        if i[1].isdigit():
            tavg = int(i[1])
        day['y'] = tavg
        lineData.append(day)
        count += 1
        formerTavg = tavg
    lineObject['values'] = lineData
    return lineObject



def getTmp(cityList):
    result = []
    for cityName in cityList:
        lineObject = getTmpFor(cityName)
        result.append(lineObject)
    return result

def getDataFromDB(cityName, columnName):
    cursor = mysql.get_db().cursor()
    sql = 'select weatherDate, '+columnName+ ' from newCityList, weather where newCityList.WBAN = weather.WBAN and cityName = "' + cityName + '"'
    cursor.execute(sql)
    return cursor.fetchall()


def getPrecipFor(cityname):
    rows = getDataFromDB(cityname, 'precip')
    precipDayCountList = [0] * 12
    for i in rows:
        month = int(i[0][4:6])
        if checkRational(i[1]) and i[1] != '0':
            precipDayCountList[month - 1] += 1;
    cityObject = {}
    cityObject["key"] = cityname
    barList = []
    for i in range(1, 13):
        monthObject = {}
        monthObject['x'] = i
        monthObject['y'] = precipDayCountList[i - 1]
        barList.append(monthObject)
    cityObject['values'] = barList
    return cityObject


def getPrecip(cityList):
    result = []
    for cityName in cityList:
        cityObject = getPrecipFor(cityName)
        result.append(cityObject)
    return result

@app.route("/weatherdata/<cityname>")
def getData(cityname):
    cityNameList = cityname.split("PLUS")
    result = []
    result.append(getTmp(cityNameList))
    result.append(getPrecip(cityNameList))
    return json.dumps(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
