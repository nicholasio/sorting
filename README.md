Sorting
=======

Um website e framework javascript para simulação de algoritmos de ordenação

Como Funciona
=======

Os Algoritmos de Ordenação estão implementados em js/sort.js, cada algoritmo de ordenação é processado e um vetor de "passos" é gerado, nos algoritmos mais simples como bubble, insertion e selection esse vetor de "passos" contém simplesmente as trocas que são realizadas ao longo da execução do algoritmo, posteriormente é simulado a execução manipulando elementos do DOM.

Este vetor de "passos" é repassado para o algoritmo de animação, o algoritmo de animação simula a execução do algoritmo baseado no vetor de "passos", a simultaneidade das execuções é simulada enfileirados os diversos passos de cada uma das animações, dando a impressão de execução simultânea.

