from flask import Flask, jsonify, request, session, redirect
from database import Query_pr, Query, email_in_db
import otp

app = Flask(__name__)


def dne(type):return {"message": f"{type} does not exist.", "proceed": False}
def inv(type):return {"message": f"Invalid {type}.", "proceed": False}
def err(type, e):return {"message": f"Error in {type}, cannot proceed", "proceed": False, "error": e}
def aexer(type): return {"message": f"The {type} already exist"}

def proc(type): return {"message": f"{type} Accepted","proceed": True}

@app.route("/lgpv", methods=['POST'])
def veripass():
    t = "user" ; s = "Password"
    
    try:    
        data = request.json
        ps = data.get("password")
        u = data.get("user_name")
        
        
        ups = Query_pr("SELECT password FROM %s WHERE user_password = %s and user_email = %s", (t, ps, u))
        
        # turn into json and send it to frontend
        return jsonify(dne(s)), 400 if not ups else jsonify(inv(s)), 400 if ups[0][0] != ps else jsonify(proc(s)), 200
    except Exception as e:
        return jsonify(err(s, e))


@app.route('/received',methods = ['POST'])
def received():
    t = "user" ; s = "Email"
    try:
        data = request.json  # get data from client
        user_email = data.get('user_name') # get the variable name from data
        
        
        if not user_email: return  jsonify(inv(s)),400
        rows = Query(f"SELECT user_email from {t} WHERE user_email = '{user_email}'")
        if not rows: return jsonify(dne(s)),400
        
        
        #TODO Query_pr("INSERT INTO %s(userName, numberName) VALUES(%s, %s)", (t, user_email, 20))
        
        # return the username into the frontend after verification
        return jsonify(proc(s)),200
    except Exception as e:
        return jsonify(err/(s, e)), 400
    
@app.route('/lsotp', methods = ['POST'])    
def lsotp():
    t = "user" ; s = "sendOTP" ; l = 5
    try:
        data = request.json 
        u = data.get("user_name")
        # if not u: return jsonify(inv(s)), 400
        # rows = Query_pr("SELECT name from %s WHERE name = %s", (t, u))
        # if not rows: return jsonify(dne(s)), 400
        
        
        
        code = otp.send_otp_to("xinzhao2627@gmail.com")
        
        
        
        return jsonify({"message":f"code sent to {u}", "proceed":True, "code":code}),200
    except Exception as e:
        return jsonify(err(s, e)),400

@app.route('/retrieveccd', methods = ['POST'])    
def lvccd():
    t = "user" ; s = "verifyOTP" ; l = 5
    try:
        # get the ccd
        # query pr
        
        
        return jsonify({"message":f"code sent to ", "proceed":True, "code":code}),200
    except Exception as e:
        return jsonify(err(s, e)),400

############ REGIUSTER #########

@app.route('/regVerifyEmail', methods = ['POST'])
def regVerifyEmail():
    t = "user" ; s = "register email"
    
    # use request.json to get data from frontend
    data = request.json 
    u = data.get('f_email')
    
    # dict content
    # emdb = Query_pr("SELECT name FROM %s WHERE name = %s", (t, u))
    
    
    # if emdb: return jsonify(aexer(s)),400
    
    # TODO send otp
    code = otp.send_otp_to("xinzhao2627@gmail.com")
    print('THIS IS THE CODE: ', code)
    return jsonify({"message":f"code sent to {u}", "proceed":True, "code":code}),200

@app.route('/regFinalize', methods = ['POST'])
def regFinalize():
    t = "ccd" ; s = "reg ccd"
    try:
        data = request.json
        ucol = data.get('colors')
        
        #TODO  add ccd
        for col in ucol:
            Query_pr("INSERT INTO %s(color) VALUES(%s)", (t, col))
        
        return jsonify(proc(s)),200 
    except Exception as e:
        return jsonify(err(s, e)),400
    
# UPLOAD TRANSACTION
@app.route('/uploadTransaction', methods = ['POST'])
def uploadTransaction(): 
    t = "transaction" ; s = "transaction upload"
    
    try:
        data = request.json
        t_email = data.get('user_name')
        t_stat = data.get('transac_status')
        t_elapsed = data.get('elapsedTime')
        
        # TODO upload to transaction
        
        
        
        print(t_email, ' ', t_elapsed, ' ', t_stat)
        
        return jsonify(proc(s)), 200
    except Exception as e:
        return jsonify(err(s, e)), 400
    

if __name__ == "__main__":
    app.run(debug=True)