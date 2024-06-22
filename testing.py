import smtplib
import pyotp
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

def send_otp_to(email):
    try:
        # OTP generator
        key = "Oursupersecretkeythatnooneexceptourmembersshouldknow"
        totp = pyotp.TOTP(key)  # This will generate unique code every 30 seconds

        sender = "microsoupauth1@gmail.com"  # The email that will send OTP to users
        receiver = email  # The user's email
        password = "nalkskdistadmrpc"  # Password of the OTP Sender
        subject = "One Time Password (OTP) Microsoft"
        otp_code = totp.now()
        body = f"This is your OTP: {otp_code}"

        # Email Contents
        email_msg = f"""From: Microsoup Authenticator <{sender}>
To: {receiver}
Subject: {subject}\n
{body}
"""

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        # Login OTP email
        server.login(sender, password)
        logging.info("Logged in to SMTP server.")
        
        # Send OTP to receiver
        server.sendmail(sender, receiver, email_msg)
        logging.info(f"Email has been sent to {email}")

        server.quit()
        return otp_code
    
    except smtplib.SMTPException as e:
        logging.error(f"SMTP error occurred: {e}")
        return None
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None
