import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@+esm'

// URL do seu projeto e sua chave anon/public do Supabase
const SUPABASE_URL = 'https://cioehcrhmnmqlsnrsagz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_bccEzkeuzuAOhnWzXSFRiw_JBtHCX8f'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const loginForm = document.getElementById('loginForm')
const mensagemErro = document.getElementById('mensagemErro')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const usuarioDigitado = document.getElementById('usuario').value.trim()
    const senhaDigitada = document.getElementById('senha').value.trim()
    const botao = loginForm.querySelector('button[type="submit"]')

    mensagemErro.textContent = ''
    botao.textContent = 'Verificando...'
    botao.disabled = true

    try {
        // Busca na tabela 'usuarios' comparando o "e-mail" ou o "nome" com a senha
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .or(`"e-mail".eq.${usuarioDigitado},nome.eq.${usuarioDigitado}`)
            .eq('senha', senhaDigitada)

        if (error) throw error

        if (data && data.length > 0) {
            // Salva na memória do navegador que o login deu certo
            localStorage.setItem('usuarioLogado', JSON.stringify(data[0]))
            
            // Redireciona para o dashboard do projeto
            window.location.href = 'dashboard.html'
        } else {
            mensagemErro.style.color = 'red'
            mensagemErro.textContent = 'Usuário ou senha incorretos. Tente novamente!'
        }
    } catch (err) {
        console.error('Erro ao conectar:', err)
        mensagemErro.style.color = 'red'
        mensagemErro.textContent = 'Erro ao conectar com o banco de dados. Verifique a chave API.'
    } finally {
        botao.textContent = 'Entrar'
        botao.disabled = false
    }
})