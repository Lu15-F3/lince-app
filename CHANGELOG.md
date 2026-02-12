# 📝 Changelog - LYNX PROJECT

## [v3.1.0] - 2026-02-12 (Versão "Contexto Inteligente")
### Adicionado
* **Smart Wiki**: A Biblioteca Técnica agora é contextual. Se o usuário escolher UEFI, vê o card de EFI; se escolher MBR, vê o card de Legacy.
* **NVMe Detection**: Lógica aprimorada no script shell para detectar caminhos `nvme` e adicionar automaticamente o sufixo `p` (ex: p1, p2).
* **Internacionalização Unificada**: Centralização de todos os textos (incluindo Wiki) no `translations.ts` para facilitar futuras traduções.

### Melhorado
* **Lógica de Particionamento**: Numeração sequencial inteligente no script shell (não pula números se houver Swap ou partições ocultas).
* **PDF Export**: Cabeçalho técnico e rodapé jurídico sincronizados com o idioma selecionado.
* **Clean Code**: Remoção de arquivos duplicados e constantes redundantes.

### Corrigido
* Bug onde os subtítulos dos botões de exportação permaneciam em inglês mesmo em modo PT-BR.
* Erro na contagem de índices de partição em setups com múltiplos discos físicos.