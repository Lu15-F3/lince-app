# 🐈 LINCE - Particionamento Inteligente

> Planejamento estratégico de partições Linux baseado no seu hardware e perfil de uso.

![Lince Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🎯 Sobre o Projeto

O **LINCE** é uma ferramenta de apoio para usuários que desejam migrar para o Linux ou otimizar suas instalações atuais. Ele calcula automaticamente o tamanho ideal das partições (como `/`, `/home`, `swap`, `/var`), levando em conta a quantidade de memória RAM, o tipo de disco (SSD/NVMe/HDD) e o nível de experiência do usuário.

## ✨ Funcionalidades

* **Perfis de Usuário:** Sugestões personalizadas para perfis Básico, Médio e Avançado.
* **Suporte a Dual Boot:** Reserva espaço para sistemas existentes (Windows) com alertas de segurança.
* **Gestão de Múltiplos Discos:** Planeje a distribuição de pastas em até 4 unidades físicas.
* **Modo UEFI/Legacy:** Ajuste automático das partições de boot.
* **Exportação:** Gere relatórios em **PDF Profissional** ou **TXT** para consultar durante a instalação.
* **Interface Moderna:** Dark Mode nativo e interface responsiva com Tailwind CSS.

## 🛠️ Tecnologias Utilizadas

* **React 18** + **TypeScript**
* **Vite** (Build Tool)
* **Tailwind CSS** (Estilização)
* **Lucide React** (Ícones)
* **jsPDF** (Geração de documentos)

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/lince-app.git](https://github.com/SEU-USUARIO/lince-app.git)
    ```

2.  **Entre na pasta:**
    ```bash
    cd lince-app
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse no navegador:** `http://localhost:5173`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Feito com ☕ por [Lu15-F3](https://github.com/SEU-USUARIO)
