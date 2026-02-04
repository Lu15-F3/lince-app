# 📚 Documentação de Componentes (Front-end)

Este documento descreve a arquitetura de interface do LINCE v3.0.

## 1. Núcleo de Estado (`App.tsx`)
O componente principal gerencia todo o estado da aplicação através de Hooks:
* **`useMemo (partitionPlan)`**: O "cérebro" do app. Recalcula toda a lógica de particionamento sempre que um parâmetro (RAM, discos, perfil) é alterado.
* **`useEffect`**: Gerencia a persistência do Dark Mode e a atualização automática de Distros/FileSystems conforme o perfil.

## 2. Componentes de Interface
* **Seletor de Perfil**: Altera dinamicamente as cores e o rigor da ferramenta (Emerald/Basic, Orange/Medium, Rose/Advanced).
* **Card de Unidade Física**: Componente dinâmico que permite gerenciar até 4 discos, ajustando tamanhos e tipos (SSD/HDD).
* **Mapa Logístico**: Um gráfico visual de barras que traduz os dados técnicos em uma representação visual proporcional ao tamanho dos discos.
* **Biblioteca Técnica (Wiki)**: Acordeões integrados que puxam explicações do `constants.tsx` para educar o usuário sobre cada ponto de montagem.

## 3. Sistema de Temas
Utiliza a configuração `THEMES` no topo do arquivo para centralizar cores, sombras e bordas, facilitando a manutenção estética.