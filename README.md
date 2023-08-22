# opcua-mqtt-edge

Repositório para código fonte da aplicação edge do projeto OPC-UA Monitor.

<br>

Passo a passo para criação de imagem docker no Azure Container Registry:

### Criação de um Azure Container Registry

- Crie um Azure Container Registry com o nome "opcedge";
- Acesse o ACR criado, clique em "Access Key", e habilite o Admin User"
- Copie os seguintes dados em um bloco de notas:

  - Login server;
  - Username;
  - password;
 
### Criação da imagem docker local da aplicação edge 

- Abra um terminal na máquina de desenvolvimento, com o docker previamente instalado, e clone o repositório do edge:

```
git clone https://github.com/RicardoGMiguel/opcua-mqtt-edge.git
```

###

- Instale as dependências

```
cd opcua-mqtt-edge
```
```
yarn
```

###

- Crie a imagem docker localmente

```
docker build -t opcuamonitor/opcuaedge .
```

### Envio da imagem docker para o Azure Container Registry

- Faça o login do ACR, substituindo o username, o password e o server previamente salvos no bloco de notas.

```
docker login -u <ACR username> -p <ACR password> <ACR login server>
```

### 

- Crie uma tag para a imagem docker

```
docker tag opcuamonitor/opcuaedge opcedge.azurecr.io/samples/opcuaedge
```

###

- Envie a imagem docker para o ACR

```
docker push opcedge.azurecr.io/samples/opcuaedge
```

### Download da imagem docker e criação de container em um edge device Ubuntu 20.04

Acesse a máquina Ubuntu via ssh com o user e o IP_MAQUINA

```
ssh user@IP_MAQUINA
```

<sub>Obs.: Para saber o IP_MAQUINA, use o comando "ip a"</sub>

###

- Instale o docker

```
curl -fsSL https://get.docker.com -o get-docker.sh
```
```
sudo sh get-docker.sh
```
```
rm get-docker.sh
```

###

- Prepare máquina para executar comandos docker como usuário normal

```
sudo usermod -a -G docker $USER
```
```
exit
```

###

- Entre novamente na máquina

```
ssh user@IP_MAQUINA
```

###

- Faça o login do ACR, substituindo o username, o password e o server previamente salvos no bloco de notas.

```
docker login -u <ACR username> -p <ACR password> <ACR login server>
```

### 

- Faça o download da imagem docker que está no ACR

```
docker pull opcedge.azurecr.io/samples/opcuaedge
```

### 

- O código do edge device se comunica com o o servidor OPC-UA e com o broker MQTT hospedado na nuvem, e as informações de acesso são informadas na criação do container por meio das seguintes variáveis de ambiente:
  - APP_WEB_API -> Url do broker MQTT;
  - OPCUA_SERVER_HOSTNAME -> Domínio do servidor OPC-UA;
  - OPCUA_SERVER_PORT -> Porta do servidor OPC-UA;
  - OPCUA_SERVER_RESOURCE_PATH -> Caminho do servidro OPC-UA.
    
- Crie o container do edge device editando as variáveis de ambiente
  ```
  docker run --name opcuaEdge -d -e APP_WEB_API=mqtt://<DOMINIO_BACKEND>:1883 -e OPCUA_SERVER_HOSTNAME=<DOMINIO_LOCAL> -e OPCUA_SERVER_PORT=3003 -e OPCUA_SERVER_RESOURCE_PATH=/UA/MyServer opcedge.azurecr.io/samples/opcuaedge
  ```

### Alguns comandos docker

- Para listar as imagens docker

```
docker image list
```

###

- Para listar os containers docker

```
docker container list
```

###

- Para interromper o container docker

```
docker container stop <NOME_DO_CONTAINER>
```

###

- Para iniciar o container docker

```
docker container start <NOME_DO_CONTAINER>
```

