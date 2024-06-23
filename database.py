import mysql.connector

#def connectSQL():
cnx = mysql.connector.connect(
    host="localhost",
    user = "root",
    password = "",
    database = "microsoft_database"
)

#CREATE METHODS

def insert_data_to_user(user_id, username, user_password, f_name, l_name, user_contact_num, user_email, user_birthdate, user_country):
    cursor = cnx.cursor()
    query = "INSERT INTO user(user_id, username, user_password, f_name, l_name, user_contact_num, user_email, user_birthdate, user_country) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    data = (user_id, username, user_password, f_name, l_name, user_contact_num, user_email, user_birthdate, user_country)
    cursor.execute(query, data)
    cnx.commit()
    cursor.close()

def select_users():
    cursor = cnx.cursor()
    query = "SELECT * FROM user_test"
    cursor.execute(query)
    rows = cursor.fetchall()
    cnx.commit()
    cursor.close()
    return rows

#READ METHODS

def email_in_db(email):
    cur = cnx.cursor()

    query = "SELECT user_email FROM user WHERE user_email LIKE '" + email + "'"
    cur.execute(query)
    rows = cur.fetchall()

    cnx.commit()
    cur.close()

    if len(rows) > 0:
        #email is in db
        return True
    else:
        #email is not in db
        return False
    
# with paramaters
def Query_pr(query, parameters=()):
    cur = cnx.cursor()
    cur.execute(query, parameters)
    rows = cur.fetchall()
    cnx.commit()
    cur.close()
    return rows

# query without needing parameters
def Query(query):
    cur = cnx.cursor()
    cur.execute(query)
    rows = cur.fetchall()
    cnx.commit()
    cur.close()
    return rows

def get_color(user):
    data = Query("SELECT `color`, `alias` FROM `ccd` WHERE `user_email` LIKE '" + user + "'")

    colors = {}

    for i in range(len(data)):
        colors[data[i][1]] = {"hex": data[i][0]}

    return colors

def add_transaction(t_email, t_elapse, t_stat, t_type):
    Query_pr("INSERT INTO `transaction`(`user_email`, `elapse_time`, `transac_status`, `transac_type`) VALUES ( %s, %s, %s, %s)", (t_email, t_elapse, t_stat, t_type))

def change_password(user, new_password):
    Query_pr("UPDATE `user` SET `user_password`= %s WHERE `user_email` LIKE %s", (new_password, user))
