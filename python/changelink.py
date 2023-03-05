import pandas as pd
import sendmail
import time

#def makemsg(produto):
#    msg = 'Bom dia! <br>' 
#    msg += 'Caso esteja com problema de acesso ao conteúdo. <br>'
#    msg += 'Acesse por este link:'
#    msg += '<a href="https://drive.google.com/drive/u/8/folders/1CFmdNjgdbhHsPfpSoQH3MR3y-59-AATK">https://drive.google.com/drive/u/8/folders/1CFmdNjgdbhHsPfpSoQH3MR3y-59-AATK</a>'
#    msg += '<p> Você está recebendo esta mensagem porque comprou o produto: <strong>' + produto + '</strong></p>'
#    return msg

def makemsg():
    msg = 'Boa tarde! <br>' 
    msg += 'Tivemos um problema tecnico com um de nossos servidores, mas o problema já foi normalizado. <br>'
    msg += 'Caso tenha tido algum problema para entrar com o link pedimos que tente novamente. <br>'
    msg += 'Pedimos nossas sinceras desculpas pelo ocorrido. <br>'
    msg += 'Qualquer dúvida estamos a disposição.'
    return msg


failures = []
produto = 'Sistema Multijogos com 10920 Jogos Arcade (Fliperama)'
df = pd.read_csv('./python/sales_kiwify.csv', sep=',')  
df = df[df['Product'] == produto]
df = df[df['Status'] == 'paid']
df = df['Customer Email']
for email in df.values:
    print(email.strip())
    try:
        sendmail.sendemails('contato@digitalstoregames.com', email.strip(), produto, makemsg(produto))
    except:
        failures.append(email.strip())
    time.sleep(5)



print('ok')
print(failures)