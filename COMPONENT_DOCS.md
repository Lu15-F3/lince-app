# 📚 Documentação de Componentes (Front-end)

Este documento descreve a arquitetura de interface e a lógica de componentes do LYNX v3.1.

### 1. Arquitetura de Estado Contextual (App.tsx)
O componente principal foi otimizado para suportar hardware legante e moderno:

bootMode: Estado centralizado que define se o plano segue o padrão UEFI ou MBR. Este estado agora é propagado para a WikiSection e para o motor de exportação.

partitionPlan (Memoized): O algoritmo de cálculo foi refinado para garantir que partições críticas (como /boot/efi) sejam omitidas automaticamente se o bootMode for MBR, redistribuindo o espaço para a partição Raiz (/).

### 2. Componentes Dinâmicos
WikiSection.tsx (Smart Wiki)
A biblioteca técnica deixou de ser estática.

Lógica de Filtro: O componente recebe a prop isUefi e filtra as chaves do objeto de tradução em tempo real.

Internacionalização: Consome dados diretamente de translations.ts, eliminando a dependência de ficheiros de constantes externas para textos.

ExportSection.tsx (Terminal & Docs)
O motor de exportação agora possui consciência de barramento:

Detecção NVMe: Implementa uma função de tratamento de strings que identifica caminhos de dispositivo. Se o caminho contiver nvme, o script shell insere o sufixo p antes do índice da partição.

Sequenciamento de Partições: Filtra partições não formatáveis (Swap/NTFS) do cálculo de índice para garantir que os comandos mkfs sigam uma ordem numérica lógica (1, 2, 3...).

### 3. Gestão de Conteúdo (translations.ts)
Abandonámos o ficheiro constants.tsx para armazenamento de strings.

Unificação: Todos os títulos, descrições técnicas da Wiki e alertas de segurança estão agora centralizados por idioma.

Escalabilidade: A nova estrutura permite adicionar novos idiomas (como Espanhol ou Francês) apenas replicando o objeto de tradução, sem tocar na lógica dos componentes.

### 4. Estilização e Feedback Visual
Diferenciação por Cor:

UEFI utiliza tons Emerald (Verde) para sinalizar o padrão moderno.

MBR utiliza tons Amber (Laranja) para sinalizar o padrão legado.

Animações: Utilização de framer-motion ou classes animate-in para transições suaves quando o utilizador alterna entre perfis ou modos de boot.