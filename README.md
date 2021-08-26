# Glass

O projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.

<br/>

## Requisitos:
<hr/>

- [Node](https://nodejs.org/en/)
- [Angular CLI](https://angular.io/cli)
- [Git](https://git-scm.com/downloads)
- [.NET v5.0](https://dotnet.microsoft.com/download)
- [MySQL]()

<br />

## Instalação:
1. Com o node e o angular instalado clone esse repositório usando o comando:
```bash
> git clone https://github.com/rodrigoliveirasantos/Glass.git
```

<br />

2. Clone o repositório do [backend do Glass](https://github.com/Diogo2550/Glass) em um diretório diferente:
```bash
> git clone https://github.com/Diogo2550/Glass.git
```

<br />

3. Atualize as dependencias do frontend:
```bash
> cd <diretorio_do_glass_frontend>
> npm update
```

<br />

4. Abra o Mysql e execute o `Modelo_Fisico.sql` para criar o modelo físico do banco de dados e o `Carga_Inicial.sql` para popular as tabelas.

<br />


## Executando o projeto:

1. Execute o `Glass-Backend/bin/debug/Glass.exe` para iniciar o servidor da API.

<br />

2. Entre no diretório do Glass frontend e use o comando abaixo para iniciar o servidor de desenvolvimento do Angular:
```bash
> ng serve
```




