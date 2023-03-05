import sendmail
import time

#emails = ['luistiago.andrighetto@gmail.com','jose.c.barbosa11@hotmail.com','johnny-nho@hotmail.com','ucayque@gmail.com',
#          'naldotttt@gmail.com','lolsaquarema@gmail.com','airtonoribka03@gmail.com',
#          'cesarjro50@gmail.com','s.matheusaires@gmail.com','s.matheusaires@gmail.com',
#          'williammmabarbosa@hotmail.com']

emails = ['luistiago.andrighetto@gmail.com']
failures = []


def makemsg():
    msg = 'Boa tarde! <br>' 
    msg += 'Tivemos um problema tecnico com um de nossos servidores, mas o problema já foi normalizado. <br>'
    msg += 'Caso tenha tido algum problema para entrar com o link pedimos que tente novamente. <br>'
    msg += 'Pedimos nossas sinceras desculpas pelo ocorrido. <br>'
    msg += 'Qualquer dúvida estamos a disposição.'
    return msg

for email in emails:
    print(email.strip())
    try:
        sendmail.sendemails('contato@digitalstoregames.com', email.strip(), 'Problema técnico', makemsg())
    except Exception as e:
        failures.append(email.strip() + ' ' + str(e))
    time.sleep(5)
    
    print(failures)