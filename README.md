# Calculadora Financeira

Uma aplicação web completa para cálculos financeiros desenvolvida com Next.js e TypeScript, oferecendo sistemas de amortização e análise de investimentos.

## 🚀 Funcionalidades

### 💰 Sistemas de Financiamento
- **SAC (Sistema de Amortização Constante)**: Parcelas decrescentes com amortização constante
- **SAF (Sistema Francês - Price)**: Parcelas constantes com amortização crescente
- **SAA (Sistema Americano)**: Pagamento de juros durante o período, amortização no final

### 📊 Análise de Investimentos
- **VPL (Valor Presente Líquido)**: Análise de viabilidade de projetos
- **TIR (Taxa Interna de Retorno)**: Cálculo automático da taxa de retorno
- **Payback Descontado**: Tempo de recuperação do investimento

## 🛠️ Como Usar

### Sistemas de Financiamento

1. **Acesse a aba "Sistemas de Financiamento"**
2. **Preencha os campos:**
   - Valor do Financiamento (R$)
   - Taxa de Juros (% ao mês)
   - Número de Meses
   - Sistema de Amortização (SAC, SAF ou SAA)
3. **Clique em "Calcular"**
4. **Visualize:**
   - Resumo com totais de juros, amortização e prestações
   - Tabela detalhada período a período

#### Exemplo de Entrada:
- Financiamento: R$ 100.000,00
- Taxa: 1,5% ao mês
- Tempo: 60 meses
- Sistema: SAC

### Análise de Investimentos (VPL)

1. **Acesse a aba "Análise de Investimentos"**
2. **Preencha os campos básicos:**
   - Investimento Inicial (R$)
   - Taxa de Desconto (% ao período)
   - Tempo do Projeto (períodos)
3. **Configure os fluxos de caixa:**
   - Use "Gerar Períodos" para criar campos automaticamente
   - Ou adicione fluxos individuais com "Adicionar Fluxo"
   - Preencha os valores para cada período
4. **Opcionalmente, configure o Valor Residual**
5. **Clique em "Calcular VPL"**
6. **Analise os resultados:**
   - VPL final (se > 0, projeto é viável)
   - TIR calculada automaticamente
   - Payback descontado
   - Tabela detalhada com análise período a período

#### Exemplo de Entrada:
- Investimento: R$ 50.000,00
- Taxa: 12% ao ano
- Tempo: 5 anos
- Fluxos de Caixa: R$ 15.000,00 por ano
- Valor Residual: R$ 10.000,00 no ano 5

## 📋 Outputs Detalhados

### Tabela de Amortização (Financiamentos)
- **Período**: Número da parcela
- **Saldo Devedor**: Valor ainda devido
- **Amortização**: Valor que reduz a dívida
- **Juros**: Valor dos juros do período
- **Prestação**: Valor total da parcela

### Análise de Fluxos (VPL)
- **Período**: Período do fluxo de caixa
- **Fluxo de Caixa**: Valor do período
- **Fator Desconto**: Fator de desconto aplicado
- **Valor Presente**: Valor descontado para o presente
- **VP Acumulado**: Valor presente acumulado (VPL progressivo)

## 🎯 Critérios de Decisão

### Sistemas de Financiamento
- **SAC**: Ideal quando se quer reduzir o valor das parcelas ao longo do tempo
- **SAF (Price)**: Ideal para parcelas constantes e previsibilidade no orçamento
- **SAA**: Ideal quando há expectativa de aumento de renda no futuro

### Análise de Investimentos
- **VPL > 0**: Projeto viável, agrega valor
- **VPL = 0**: Projeto neutro, retorno igual ao custo de capital
- **VPL < 0**: Projeto inviável, destrói valor
- **TIR > Taxa de Desconto**: Projeto atrativo
- **Payback**: Menor tempo é melhor para recuperação do investimento

## 🚀 Como Executar

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo desenvolvimento:**
```bash
npm run dev
```

3. **Acessar a aplicação:**
```
http://localhost:3000
```

## 🏗️ Tecnologias Utilizadas

- **Next.js 15**: Framework React com renderização server-side
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS para estilização
- **React Hooks**: Gerenciamento de estado moderno

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                    # Página inicial
│   ├── layout.tsx                  # Layout principal
│   └── calculadora/
│       ├── page.tsx               # Página principal da calculadora
│       └── components/
│           ├── FinancingCalculator.tsx  # Calculadora de financiamentos
│           └── VPLCalculator.tsx        # Calculadora de VPL
```

## 💡 Fórmulas Implementadas

### SAC
- Amortização = Valor Financiado / Número de Meses
- Juros = Saldo Devedor × Taxa de Juros
- Prestação = Amortização + Juros

### SAF (Price)
- PMT = VP × [i × (1+i)^n] / [(1+i)^n - 1]
- Juros = Saldo Devedor × Taxa de Juros
- Amortização = PMT - Juros

### SAA
- Juros = Valor Financiado × Taxa de Juros (todos os períodos)
- Amortização = Valor Financiado (apenas no último período)

### VPL
- VPL = Σ [FCt / (1+i)^t] - Investimento Inicial
- TIR: Taxa que torna VPL = 0 (método Newton-Raphson)
- Payback: Período onde VP Acumulado ≥ 0

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
