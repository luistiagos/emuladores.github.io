#http://digitalstoregames.pythonanywhere.com/notification3?productId=310000&email=samersonsayad@gmail.com&fone=(19) 98602-2187

import requests

# URL da API onde você deseja fazer a solicitação POST manualdeliver
url = 'http://digitalstoregames.pythonanywhere.com/manualdeliver?productId=310000&email=efmj1997@gmail.com&fone=(27) 99879-5925'

# Dados que você deseja enviar no corpo da solicitação POST (por exemplo, informações do usuário)
dados_do_usuario = {
}

# Fazendo a solicitação POST
try:
    resposta = requests.post(url, json=dados_do_usuario)

    # Verificando se a solicitação foi bem-sucedida (código de status HTTP 200)
    if resposta.status_code == 200:
        print(resposta.json())
    else:
        print(f"Erro ao criar o usuário. Código de status HTTP: {resposta.status_code}")
        print(resposta.text)  # Exibir detalhes do erro, se houver
except Exception as e:
    print(f"Ocorreu um erro durante a solicitação POST: {str(e)}")
