# Aplicação de agendamento de churrasco

Esse é um projeto de consulta e agendamento de churrascos.

## Scripts

Na pasta do projeto, você pode rodar:

### `npm start`

Roda o app em modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para ver no navegador.

## Funcionalidades

***MVP-1***

- Tela de login com validação dos campos de e-mail e senha.
- Consulta à agenda de churrascos.
- Consulta aos detalhes de determinado churrasco, como descrição, quantidade de convidados, o valor arrecadado, possibilidade de alterar opção por bebida por convidado e marcar convidados que já efetuaram o pagamento.
- Cadastro de novo churrasco, com preenchimento dos campos de nome ou motivo do churrasco, descrição (com no máximo 140 caracteres), seleção de convidados, observações adicionais (opcional, ativado mediante clique em checkbox), data e valor do evento. Os campos apresentam validação de obrigatoriedade de preenchimento.
- Toda a aplicação está responsiva até width = 375px.

## Débitos técnicos

- Validação do componente de select de convidados.
- Implementação da máscara monetária no componente de valor total.
- Melhorar as respostas de erro e implementar retornos de sucesso.
- Implementar cadastro e autenticação de usuário.

## Melhorias futuras

- Implementar notificação de avisos dos eventos para os convidados.
