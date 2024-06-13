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



#UPDATE METHODS


#DELETE METHODS


#SPECIAL METHODS

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


#EXECUTE/CALL METHODS

print(email_in_db("sample1@domain.com"))
# insert_data_to_user(150003001, "Username1", "password1", "Carl", "Hipolito" ,"09123456789", "sample1@domain.com", "2003-09-14", "Philippines")
# insert_data_to_user(150003002, "Username2", "password2", "Neil", "Baltar" ,"09123456788", "sample2@domain.com", "2003-01-01", "Philippines")
# insert_data_to_user(150003003, "Username3", "password3", "Rainnand", "Montaniel" ,"09123456787", "sample3@domain.com", "2003-01-02", "Philippines")

