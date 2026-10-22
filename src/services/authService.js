
/**
 * Veneza Santa Massa
 * Serviço temporário de autenticação.
 *
 * ATENÇÃO: esta versão é apenas uma demonstração.
 * Não cria contas reais nem verifica senhas em um servidor.
 */

export async function loginUser({ email, password }) {
  if (!email?.trim() || !password) {
    return {
      ok: false,
      message: "Preencha seu e-mail e sua senha.",
    };
  }

  // FUTURO: enviar os dados para o endpoint de login.
  // Exemplo: POST /auth/login

  return {
    ok: true,
    message: "Demonstração: tela de login funcionando!",
    user: {
      email: email.trim().toLowerCase(),
    },
  };
}

export async function registerUser({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password) {
    return {
      ok: false,
      message: "Preencha todos os campos.",
    };
  }

  if (password.length < 8) {
    return {
      ok: false,
      message: "A senha deve ter pelo menos 8 caracteres.",
    };
  }

  // FUTURO: enviar os dados para o endpoint de cadastro.
  // Exemplo: POST /auth/register
  // Nunca armazene senhas em texto puro no aplicativo.

  return {
    ok: true,
    message: "Demonstração: cadastro validado com sucesso!",
    user: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    },
  };
}
