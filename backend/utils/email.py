import os
import resend

FROM_ADDRESS = "Local Artist Database <onboarding@resend.dev>"

def send_verification_email(to_email: str, first_name: str, verify_url: str):
    resend.api_key = os.getenv("RESEND_API_KEY", "")

    resend.Emails.send({
        "from": FROM_ADDRESS,
        "to": [to_email],
        "subject": "Please confirm your email",
        "html": f"""
            <p>Hello, {first_name}!</p>
            <p>Please confirm your email by clicking the link below:</p>
            <p><a href="{verify_url}">Confirm Email</a></p>
        """,
    })
