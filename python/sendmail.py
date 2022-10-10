import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def sendemails(ffrom, to, subject, message):
    msg = MIMEMultipart('alternative')
    msg.set_unixfrom('author')
    msg['From'] =  ffrom
    msg['To'] = to
    msg['Subject'] = subject
    msg['X-Priority'] = '2'
    msg.attach(MIMEText(message, 'html'))
    mailserver = smtplib.SMTP_SSL('smtpout.secureserver.net', 465)
    mailserver.ehlo()
    mailserver.login(ffrom, '@Lt057869')
    response = mailserver.sendmail(ffrom, to, msg.as_string())
    mailserver.quit()



