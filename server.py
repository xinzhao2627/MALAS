from flask import Flask, jsonify, request, session, redirect
app = Flask(__name__)

@app.route("/users", methods=['GET'])
def hello():
    # turn a data into dictionary [example]
    users = {
        "users": ["Baltar - Pythonxxxxx", "Hipolito Carl", "Montaniel"]
    }
    
    # turn into json and send it to frontend
    return jsonify(users)

@app.route('/received',methods = ['POST'])
def received():
    # use request.json to get data from frontend
    data = request.json 
    
    # FOR USER NAME/EMAIL/BINDED ACCOUNT
    user_name = data.get('user_name')
    
    # FOR PASSWORD
    # password = data.get('password')
    
    
    # TODO verify the user name

    # TODO verify the password
    
    
    # return the username into the frontend after verification
    return jsonify({
        "message": f"I came from python, the username you sent is: {user_name}",
        "proceed": True
        }),201 # 201 for success request

if __name__ == "__main__":
    app.run(debug=True)