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


#READ METHODS


#UPDATE METHODS


#DELETE METHODS


#EXECUTE/CALL METHODS

insert_data_to_user(150003001, "Username1", "password1", "Carl", "Hipolito" ,"09123456789", "sample1@domain.com", "2003-09-14", "Philippines")
insert_data_to_user(150003002, "Username2", "password2", "Neil", "Baltar" ,"09123456788", "sample2@domain.com", "2003-01-01", "Philippines")
insert_data_to_user(150003003, "Username3", "password3", "Rainnand", "Montaniel" ,"09123456787", "sample3@domain.com", "2003-01-02", "Philippines")
