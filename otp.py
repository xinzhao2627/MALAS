import smtplib
import pyotp
import threading
import time

# Send email OTP
def send_otp_to(email):
    key = "Oursupersecretkeythatnooneexceptourmembersshouldknow"
    totp = pyotp.TOTP(key, interval=30) # OTP Generator (Will generate new code every 30 seconds)
    otp_now = totp.now() #Get an otp
    #This is the timer function running on another thread (tldr: The timer runs while the program takes input of user)
    timer = threading.Thread(target=timer, daemon=True, args=(30,))
    
    sender = "microsoupauth1@gmail.com" #Email that will send OTP to users
    password = "nalkskdistadmrpc" # Password of the OTP Sender
    receiver = email # User's email
    subject = "One Time Password (OTP) Microsoft"
    body = "This is your OTP: " + otp_now

    # Email Contents
    email_msg = f"""From: Microsoup Authenticator {sender}
    
    To: {receiver}
    Subject: {subject}\n
    {body}
    """
    #Email Server
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()

    # Login OTP email
    server.login(sender, password)
    print("Logged In.")
    
    # Send OTP to receiver
    server.sendmail(sender, receiver, email_msg)
    print("Email has been sent!")
    return otp_now

def timer(set_timer):
    for x in range(0, 30):
        print(set_timer)
        set_timer = set_timer - 1
        time.sleep(1)
    
    print("OTP has expired")
#Checks otp if true or false (Including the timer)
def otp_checker(otp_input):
    check_timer = timer.is_alive()

    if (otp_input == otp_now and check_timer):
        print(True)
    else:
        print(False)


# def otp_duration():
#     for x in range(0, 31):
#         time_remaining = totp.interval - (time.time() % totp.interval)
#         print(time_remaining)
#         time.sleep(1)




# print(otp_now)
# send_otp_to("luxfenrir78@gmail.com") 
# timer.start() #Starts timer function
# input = input("Enter the otp: ")
# otp_checker(input) 
