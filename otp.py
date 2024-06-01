import smtplib
import pyotp
import time



#OTP generator
key = "Oursupersecretkeythatnooneexceptourmembersshouldknow"
totp = pyotp.TOTP(key) # This will generate unique code every 30 seconds

sender = "microsoupauth1@gmail.com" # The email that will send OTP to users
receiver = "xinzhao2627@gmail.com" # The user's email
password = "nalkskdistadmrpc" # Password of the OTP Sender
subject = "One Time Password (OTP) Microsoft"
body = "This is your OTP: " + totp.now()

# Email Contents
email_msg = f"""From: Microsoup Authenticator {sender}
To: {receiver}
Subject: {subject}\n
{body}
"""

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()

# Login OTP email
server.login(sender, password)
print("Logged In.")
# Send OTP to receiver
server.sendmail(sender, receiver, email_msg)
print("Email has been sent!")

input = input("Enter the otp: ")
print(totp.verify(input)) # True