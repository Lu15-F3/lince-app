# 🐆 LINCE PROJECT v3.0

> **Planejamento inteligente de discos para entusiastas e profissionais Linux.**

[![Acesse o Lince Online](https://img.shields.io/badge/Acesse%20o%20Lince-Online-emerald?style=for-the-badge&logo=linux&logoColor=white)](https://lu15-f3.github.io/lince-app/)

O **LINCE** é uma ferramenta interativa desenvolvida para simplificar uma das etapas mais críticas da migração para Linux: o particionamento. Ele automatiza cálculos complexos, gerencia múltiplos discos e gera planos técnicos detalhados com base no hardware do utilizador.

---

## 🌐 Teste Agora
Não precisa instalar nada. O projeto está disponível em:
👉 **[https://lu15-f3.github.io/lince-app/](https://lu15-f3.github.io/lince-app/)**

---

## 🚀 Funcionalidades Principais

* **Algoritmo de Alocação Adaptativo**: Cálculos automáticos baseados em hardware (RAM/Disco).
* **Gestão Multi-Disco**: Suporte para até 4 unidades físicas simultâneas com priorização inteligente.
* **Perfis de Usuário**: 
    * **Básico**: Foco em simplicidade e segurança (Root + Home integrada/separada).
    * **Médio**: Otimização para produtividade e snapshots.
    * **Avançado**: Estrutura robusta para servidores e workstations (/var, /srv, /opt, etc).
* **Motor de Exportação**: Gere relatórios profissionais em **PDF** e **TXT** ou scripts shell prontos para o terminal.
* **Modo Dual-Boot**: Proteção nativa para partições Windows (NTFS) existentes.

## 🛠️ Tecnologias Utilizadas

* **React + TypeScript**: Interface reativa e segura.
* **Tailwind CSS**: Design moderno com suporte nativo a Dark Mode.
* **Lucide React**: Biblioteca de ícones minimalistas.
* **jsPDF**: Geração de documentos PDF no lado do cliente.

## 💻 Como Rodar Localmente (Desenvolvimento)

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/Lu15-F3/lince-app.git](https://github.com/Lu15-F3/lince-app.git)
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## 📄 Licença

Este projeto está sob a licença **MIT** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---
## ⚠️ Aviso de Responsabilidade (Disclaimer)

O **LINCE PROJECT** é uma ferramenta de auxílio visual e pedagógico para planejamento de partições. Ao utilizar este software, você concorda que:

1. **Risco do Utilizador**: O particionamento de discos e a instalação de sistemas operativos são procedimentos que envolvem risco real de perda de dados.
2. **Uso de Comandos**: Os scripts shell e planos gerados são sugestões baseadas nos parâmetros inseridos. Verifique sempre os nomes dos dispositivos (ex: `/dev/sda`, `/dev/nvme0n1`) antes de executar qualquer comando no terminal.
3. **Sem Garantias**: O software é fornecido "como está", sem garantias de qualquer tipo. O desenvolvedor não se responsabiliza por:
    * Formatações acidentais de partições.
    * Perda de arquivos pessoais ou documentos.
    * Danos físicos ao hardware ou falhas de inicialização (boot).
4. **Backup**: É **altamente recomendável** que você possua um backup atualizado de seus dados importantes antes de realizar qualquer alteração em seus discos rígidos.

> **"Com grandes poderes vêm grandes responsabilidades."** — Use a ferramenta com cautela e conhecimento técnico.

---
Desenvolvido com ☕ e 🐧 por **Lu15-F3**.
