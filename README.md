# opcua-mqtt-edge

Repositório para código fonte da aplicação edge do projeto OPC-UA Monitor.

<br>

Passo a passo para criação de imagem docker no Azure Container Registry:

### Criação de um Azure Container Registry

- Crie um Azure Container Registry;
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



