from flask import Flask, jsonify, request, session, redirect
from database import Query_pr, Query, email_in_db
from otp import executeOTP

app = Flask(__name__)


def dne(type):return {"message": f"{type} does not exist.", "proceed": False}
def inv(type):return {"message": f"Invalid {type}.", "proceed": False}
def err(type, e):return {"message": f"Error in {type}, cannot proceed", "proceed": False, "error": e}

def proc(type): return {"message": f"{type} Accepted","proceed": True}

@app.route("/lgpv", methods=['POST'])
def veripass():
    t = "user" ; s = "Password"
    
    try:    
        data = request.json
        ps = data.get("password")
        u = data.get("user_name")
        
        
        ups = Query_pr("SELECT password FROM %s WHERE password = %s and user_name = %s", (t, ps, u))
        
        # turn into json and send it to frontend
        return jsonify(dne(s)), 400 if not ups else jsonify(inv(s)), 400 if ups[0][0] != ps else jsonify(proc(s)), 200
    except Exception as e:
        return jsonify(err(s, e))


@app.route('/received',methods = ['POST'])
def received():
    t = "user_test" ; s = "Email"
    try:
        data = request.json  # get data from client
        user_name = data.get('user_name') # get the variable name from data
        
        
        if not user_name: return  jsonify(inv(s)),400
        rows = Query_pr("SELECT name from user WHERE name = %s", (user_name))
        if not rows: return jsonify(dne(s)),
        
        
        Query_pr("INSERT INTO %s(userName, numberName) VALUES(%s, %s)", (t, user_name, 20))
        
        # return the username into the frontend after verification
        return jsonify(proc(s)),201
    except Exception as e:
        return jsonify(err(s,e)), 400
    
@app.route('/lsotp', methods = ['POST'])    
def lsotp():
    t = "user_test" ; s = "sendOTP"
    try:
        data = request.json 
        u = data.get("user_name")
        k = data.get("rkey")
        
        if not u or not k: return jsonify(inv(s)), 400
        rows = Query_pr("SELECT name from %s WHERE name = %s", (t, u))
        if not rows: return jsonify(dne(s)), 400
        
        code = executeOTP(k)
        
    except Exception as e:
        return jsonify(err(s)),400



    
        
    
@app.route('/regVerifyEmail', methods = ['POST'])
def regVerifyEmail():
    # use request.json to get data from frontend
    data = request.json 
    target_email = data.get('user_name')
    
    # dict content
    email_in_DB = email_in_db(target_email)
    message = ''
    proceed = False
    stat = 400
    passCode = None
    
    # TODO: check FIRST if target_email is in the database, target email must be new in order to proceed
    # email_in_DB = check if email is in the database
    #### --- ####
    
    if (email_in_DB):
        message = 'The email already exist'
        proceed = False
        stat = 400
    else:
        message = ''
        proceed = True
        stat = 200
        # passCode = deliverOTP(target_email)
    
    return jsonify({
        "message": message,
        "proceed": proceed,
        "passCode": passCode
    }), stat

if __name__ == "__main__":
    app.run(debug=True)