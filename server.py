from flask import Flask, jsonify, request, session, redirect
from database import *

import threading
app = Flask(__name__)


def dne(type):return {"message": f"{type} does not exist.", "proceed": False}
def inv(type):return {"message": f"Invalid {type}.", "proceed": False}
def err(type, e):return {"message": f"Error in {type}, cannot proceed", "proceed": False, "error": e}
def aexer(type): return {"message": f"The {type} already exist"}

def proc(type): return {"message": f"{type} Accepted","proceed": True}

@app.route("/lgpv", methods=['POST'])
def veripass():
    t = "user"
    s = "Password"
    
    try:    
        data = request.json
        ps = data.get("password")
        u = data.get("user_name")
        
        if not ps or not u:
            return jsonify(dne(s)), 400
        
        query = f"SELECT user_password FROM {t} WHERE user_email = %s AND user_password = %s"
        rows = Query_pr(query, (u, ps))
        
        if not rows:
            return jsonify(dne(s)), 400
        elif rows[0][0] != ps:
            return jsonify(inv(s)), 400
        else:
            return jsonify(proc(s)), 200
    
    except Exception as e:
        return jsonify(err(s, e)), 400


@app.route('/received',methods = ['POST'])
def received():
    
    # t is the table name
    t = "user" ; s = "Email"
    try:
        data = request.json  # get data from client
        user_email = data.get('user_name') # get the variable name from data
        
        
        if not user_email: return  jsonify(inv(s)),400
        
        # CONVERT TODO: this, return 1 row and 1 column that contains the email of user {u}
        query = f"SELECT user_email from {t} WHERE user_email = %s"
        rows = Query_pr(query, (user_email, ))
        
        # if there is no user with that name return Does Not Exist
        if not rows: return jsonify(dne(s)),400
        

        
        # return the username into the frontend after verification
        return jsonify(proc(s)),200
    except Exception as e:
        return jsonify(err(s, e)), 400
    
@app.route('/lsotp', methods = ['POST'])    
def lsotp():
    from testing import send_otp_to
    t = "user" ; s = "sendOTP" ; l = 5
    try:
        data = request.json 
        user_email = data.get("user_name")
        
        if not user_email: return  jsonify(inv(s)),400
        
        # CONVERT TODO: this, return 1 row and 1 column that contains the email of user {u}
        query = f"SELECT user_email from {t} WHERE user_email = %s"
        rows = Query_pr(query, (user_email, ))
        
        # if there is no user with that name return Does Not Exist
        if not rows: return jsonify(dne(s)),400
        
        
        
        code = send_otp_to(user_email)
        
        return jsonify({"message":f"code sent to {user_email}", "proceed":True, "code":code}),200
    except Exception as e:
        return jsonify(err(s, e)),400

@app.route('/retrieveccd', methods = ['POST'])    
def lvccd():
    t = "ccd" ; s = "verifyOTP" ; l = 5
    try:
        data = request.json
        u = data.get('user_name')
        # (DONE) CONVERT TODO: make a query function that returns a dictionary, 
        # containing the 5 colors of user {u}
        # return: {
            # 'alias1': {'hex': '#FFFFFF'},
            # 'alias2': {'hex': '#EEEEEE'},
            # 'bulbasaur': {'hex': '#EEEEEE'},
            # 'charmander': {'hex': '#EEEEEE'},
            # 'cherry': {'hex': '#E4E4E4'}
            # }
        # return it in colorData

        colorData = get_color(u)
        
        return jsonify({"message":"proceed to ccd", "proceed":True, "colorData":colorData}),200
    except Exception as e:
        return jsonify(err(s, e)),400

############ REGIUSTER #########

@app.route('/regVerifyEmail', methods=['POST'])
def regVerifyEmail():
    from testing import send_otp_to
    t = "user"
    s = "register email"
    try:
        data = request.json
        u = data.get('f_email')
        
        # TODO verify if {u} is on the database
        if not u: return jsonify(inv(s)), 400
        query = f"SELECT user_email FROM {t} WHERE user_email = %s"
        rows = Query_pr(query, (u,))
        if rows: return jsonify(inv(s)), 400
        
        code = send_otp_to(u)
        # code = '1'
        return jsonify({"message": f"Code sent to {u}", "proceed": True, "code": code}), 200
    except Exception as e:
        return jsonify(err(s, e)), 400
    
    
@app.route('/regFinalize', methods=['POST'])
def regFinalize():
    t = "ccd"
    s = "reg ccd"
    try:
        data = request.json
        color_data = data.get('colorData')
        u = data.get('f_email')
        ps = data.get('f_ps')
        if not color_data or not u or not ps:
            return jsonify(inv("colorData")), 400
        # return: {
        # 'alias1': {'hex': '#FFFFFF'},
        # 'alias2': {'hex': '#EEEEEE'},
        # 'bulbasaur': {'hex': '#EEEEEE'},
        # 'charmander': {'hex': '#EEEEEE'},
        # 'cherry': {'hex': '#E4E4E4'}
        # }
        for key, value in color_data.items():
            hex_value = value.get('hex')
            if hex_value:
                query1 = f"INSERT INTO {t}(user_email, color, alias) VALUES(%s, %s, %s)"
                Query_pr(query1, (u, hex_value, key))
        query2 = f"INSERT INTO user(user_email, user_password) VALUES(%s, %s)"
        Query_pr(query2, (u, ps))
        return jsonify(proc(s)), 200 
    except Exception as e:
        return jsonify(err(s, e)), 400

    
# UPLOAD TRANSACTION
@app.route('/uploadTransaction', methods = ['POST'])
def uploadTransaction(): 
    t = "transaction" ; s = "transaction upload"
    
    try:
        data = request.json
        
        t_email = data.get('user_name')
        t_stat = data.get('stat')
        t_elapsed = data.get('elapsedTime')
        t_type = data.get('transac_type')
        
        # (DONE) CONVERT TODO: upload to transaction: the 4 columns above are the parameters 

        add_transaction(t_email, t_elapsed, t_stat, t_type)
        
        print(t_email, ' ', t_elapsed, ' ', t_stat, ' ', t_type)
        
        return jsonify(proc(s)), 200
    except Exception as e:
        return jsonify(err(s, e)), 400

##### RESETPASSWORD #####
@app.route('/resetAccEmail', methods = ['POST'])    
def resetAccEmail():
    from testing import send_otp_to
    t = "user" ; s = "sendOTP"
    try:
        data = request.json 
        u = data.get("user_name")
        if not u: return jsonify(inv(s)), 400
        query = f"SELECT user_email FROM {t} WHERE user_email = %s"
        rows = Query_pr(query, (u,))
        if not rows: return jsonify(dne(s)), 400
        
        code = send_otp_to(u)
        
        return jsonify({"message":f"code sent to {u}", "proceed":True, "code":code}),200
    except Exception as e:
        return jsonify(err(s, e)),400

@app.route('/resetNewPass', methods = ['POST'])    
def resetNewPass():
    t = "user" ; s = "reset password"
    try:
        data = request.json 
        u = data.get("user_name") #P.S. must return user_email
        ps = data.get("password")
        
        
        if not u: return jsonify(inv(s)), 400
        query = f"SELECT user_email FROM {t} WHERE user_email = %s"
        rows = Query_pr(query, (u,))
        if not rows: return jsonify(dne(s)), 400
        
        change_password(u, ps)
        
        return jsonify(proc(s)),200
    except Exception as e:
        return jsonify(err(s, e)),400

if __name__ == "__main__":
    app.run(debug=True)