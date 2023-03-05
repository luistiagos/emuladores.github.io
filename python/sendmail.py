import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def makemsg():
    msg = 'Boa tarde! <br>' 
    msg += 'Tivemos um problema tecnico com um de nossos servidores, mas o problema já foi normalizado. <br>'
    msg += 'Caso tenha tido algum problema para entrar com o link pedimos que tente novamente. <br>'
    msg += 'Pedimos nossas sinceras desculpas pelo ocorrido. <br>'
    msg += 'Qualquer dúvida estamos a disposição.'
    return msg

def sendemails(ffrom, to, subject, message):
    msg = MIMEMultipart('alternative')
    msg.set_unixfrom('author')
    msg['From'] =  ffrom
    msg['To'] = to
    msg['Subject'] = subject
    msg['X-Priority'] = '2'
    msg.attach(MIMEText(message, 'html'))
    mailserver = smtplib.SMTP('smtpout.secureserver.net', 465)
    mailserver.ehlo()
    mailserver.login(ffrom, '@Lt057869')
    response = mailserver.sendmail(ffrom, to, msg.as_string())
    mailserver.quit()



