from flask import Flask, jsonify, request, session, redirect
from database import Query_pr, Query
app = Flask(__name__)

@app.route("/users", methods=['GET'])
def hello():
    # turn a data into dictionary [example]
    user_data = Query("SELECT * FROM user_test")
    us_data = []
    for us in user_data:
        us_data.append(us[0])
        
    
    users = {
        "users": us_data
    }
    
    # turn into json and send it to frontend
    return jsonify(users)

@app.route('/received',methods = ['POST'])
def received():
    # use request.json to get data from frontend
    data = request.json 
    
    # FOR USER NAME/EMAIL/BINDED ACCOUNT
    user_name = data.get('user_name') # variable name sa data.get ako magasasabi
    Query_pr("INSERT INTO user_test(userName, numberName) VALUES(%s, %s)", (user_name, 20))
    
    
    # return the username into the frontend after verification
    return jsonify({
        "message": f"I came from python, the username you sent is: {user_name}",
        "proceed": True
        }),201 # 201 for success request

if __name__ == "__main__":
    app.run(debug=True)