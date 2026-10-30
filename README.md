# Convite de 50 anos — Armando Jomboce

Projecto mobile-first em HTML, CSS e JavaScript, com funções serverless da Vercel e armazenamento persistente no Supabase.

## O que inclui

- Convite público com a fotografia fornecida, data, hora e local.
- Formulário para confirmar presença com nome completo.
- Painel administrativo em `/admin.html`.
- Acesso ao painel protegido por senha configurada no servidor.
- Lista de convidados com data e hora da confirmação, no fuso `Africa/Maputo`.
- Registos guardados no Supabase. A interface e a API não incluem operações de apagar ou editar confirmações.

## 1. Criar a base de dados

1. Crie um projecto em https://supabase.com.
2. Abra **SQL Editor**.
3. Copie e execute o conteúdo de `supabase.sql`.
4. Em **Project Settings → API**, copie a Project URL e a chave `service_role`. A chave `service_role` é secreta: nunca a coloque em ficheiros HTML ou JavaScript do navegador.

## 2. Configurar variáveis na Vercel

Importe este projecto para um repositório GitHub e ligue-o à Vercel. Em **Project → Settings → Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `SUPABASE_URL` | URL do projecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta `service_role` |
| `ADMIN_PASSWORD` | `1976` |
| `ADMIN_TOKEN_SECRET` | Uma sequência longa e aleatória, diferente da senha |

Depois de adicionar as variáveis, faça um novo deploy.

## 3. Publicar

- Na Vercel, importe o repositório.
- Não precisa de comando de build.
- Framework preset: **Other**.
- Diretório raiz: `./`.
- Depois do deploy, o convite fica disponível no domínio principal e o painel em `/admin.html`.

## 4. Personalização

- Fotografia: substitua `assets/armando.jpg` por outra fotografia, mantendo o mesmo nome.
- Textos, data e local: edite `index.html`.
- Cores e tipografia: edite as variáveis no início de `styles.css`.
- Senha: altere `ADMIN_PASSWORD` nas variáveis da Vercel, não no código.

## Notas importantes sobre os registos

A lista é persistente porque fica guardada na base de dados Supabase, não no navegador. O projecto não tem botão nem endpoint para apagar registos. Ainda assim, nenhum serviço pode garantir conservação absoluta perante eliminação da conta, falhas do fornecedor ou intervenção de um administrador da base de dados. Para conservação a longo prazo, active também backups no fornecedor e mantenha acesso à conta Supabase.

A senha `1976` é simples e pode ser adivinhada. Para um painel publicado na Internet, recomenda-se uma senha mais forte. Se mantiver `1976`, limite a divulgação do endereço do painel e considere alterar a senha depois do evento.

## Estrutura

```text
convite-armando-50/
├── index.html
├── admin.html
├── styles.css
├── app.js
├── admin.js
├── supabase.sql
├── vercel.json
├── api/
│   ├── _utils.js
│   ├── rsvp.js
│   ├── admin-login.js
│   └── guests.js
└── assets/
    └── armando.jpg
```
