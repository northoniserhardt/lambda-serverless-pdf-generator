# Lambda Pdf Generator

Este projeto foi desenvolvido a fim de otimizar a funcionalidade de geração de PDFs.

Para que a conversão de HTML para PDF possa funcionar é são utilizados os pacotes:

- chrome-aws-lambda
> Pacote com o binário do chromium, com ele é possível usar o chrome headless para a renderização do html na AWS.
- puppeteer-core
> Pacote responsável por ler o HTML renderizado e criar o PDF a partir do mesmo, o puppeteer-core não faz o download do chrome, que no nosso caso não precisamos.
- aws-sdk
> Pacote de SDK da AWS usado no projeto para acesso ao S3.

## Instalação

Após baixar o projeto você precisará rodas os seguintes comandos para instalar as dependências:

- `npm install`
> Este comando instalará todas as dependências do projeto.

## Configuração do serverless
O projeto conta com o framework Serverless, ele automatiza a criação e deploy da stack da aplicação na AWS.  
A stack para deploy da aplicação já está configurada, mas ainda é necessário instalar o framework com o seguinte comando:

- `npm install -g serverless`
> Este comando instalará o serverless, necessário para a criação e deploy da stack.
# Deploy

Agora que temos a aplicação e o Serverless instalados, precisamos informar para o serverless credenciais accessKeyId e secretAccessKey da AWS para conceder a ele a permissão para criar a stack.
- `serverless config credentials --provider aws --key 'key_aqui' --secret 'secret_key_aqui'`
> Este comando salvará em ~/.aws/credentials nossas credenciais para serem usadas.

Com as credenciais configuradas já é possível fazermos o deploy para produção com o seguinte comando:
- `sls deploy --stage prod`
> O comando fará deploy para produção.

## Configurações adicionais
Renomeie os arquivos:
- .env.example -> .env
> Nele é necessário configurar as váriaveis de ambiente.
- serverless.yml.example -> serverless.yml
> Nele é necessário configurar os serviços que serão levantados na AWS.

## Fluxo de funcionamento

mermaid
graph LR
A((Appsolar)) -- Request --> B[Lambda] -- Salva o PDF --> C(S3) -- Retorna a URL do PDF --> B -- Response --> A