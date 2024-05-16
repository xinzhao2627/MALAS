import mysql.connector

cnx = mysql.connector.connect(
    host="localhost",
    user = "root",
    password = "",
    database = "microsoft_database"
)

cursor = cnx.cursor()

#CREATE METHODS

def insert_data_to_user(user_id, username, user_password, f_name, l_name, user_contact_num, user_email, user_birthdate, user_country):
    query = "INSERT INTO user(user_id, username, user_password, f_name, l_name, user_contact_num, user_email, user_birthdate, user_country) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    data = (user_id, username, user_password, f_name, l_name, user_contact_num, user_email, user_birthdate, user_country)
    cursor.execute(query, data)
    cnx.commit()
    cursor.close()
    cnx.close()



#READ METHODS


#UPDATE METHODS


#DELETE METHODS


#EXECUTE/CALL METHODS

insert_data_to_user(150003002, "Shii", "password1234", "Carl", "Hipolito" ,"09123456789", "sample@domain.com", "2003-09-14", "Philippines")