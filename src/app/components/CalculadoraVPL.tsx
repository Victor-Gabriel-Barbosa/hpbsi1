'use client';

import { useState } from 'react';

export interface FluxoCaixa {
  periodo: number;
  valor: number;
}

export interface EntradaVPL {
  investimentoInicial: number;
  taxa: number;
  tempo: number;
  fluxosCaixa: FluxoCaixa[];
  valorResidual: number;
  periodoValorResidual: number;
}

export interface SaidaVPL {
  periodo: number;
  fluxoCaixa: number;
  fatorDesconto: number;
  valorPresente: number;
  valorPresenteAcumulado: number;
}

export default function CalculadoraVPL() {
  const [input, setInput] = useState<EntradaVPL>({
    investimentoInicial: 0,
    taxa: 0,
    tempo: 0,
    fluxosCaixa: [],
    valorResidual: 0,
    periodoValorResidual: 0
  });

  const [results, setResults] = useState<SaidaVPL[]>([]);
  const [vplFinal, setVplFinal] = useState<number | null>(null);
  const [tir, setTir] = useState<number | null>(null);
  const [payback, setPayback] = useState<number | null>(null);

  const adicionarFluxoCaixa = () => {
    const novoFluxo: FluxoCaixa = {
      periodo: input.fluxosCaixa.length + 1,
      valor: 0
    };
    setInput({
      ...input,
      fluxosCaixa: [...input.fluxosCaixa, novoFluxo]
    });
  };

  const removerFluxoCaixa = (index: number) => {
    const novosFluxos = input.fluxosCaixa.filter((_, i) => i !== index);
    const fluxosRenumerados = novosFluxos.map((fluxo, i) => ({
      ...fluxo,
      periodo: i + 1
    }));
    setInput({
      ...input,
      fluxosCaixa: fluxosRenumerados
    });
  };

  const atualizarFluxoCaixa = (index: number, valor: number) => {
    const novosFluxos = [...input.fluxosCaixa];
    novosFluxos[index].valor = valor;
    setInput({
      ...input,
      fluxosCaixa: novosFluxos
    });
  };

  const gerarFluxosAutomaticos = () => {
    if (input.tempo <= 0) {
      alert('Por favor, defina o tempo do projeto primeiro.');
      return;
    }

    const fluxosAutomaticos: FluxoCaixa[] = [];
    for (let i = 1; i <= input.tempo; i++) {
      fluxosAutomaticos.push({
        periodo: i,
        valor: 0
      });
    }
    setInput({
      ...input,
      fluxosCaixa: fluxosAutomaticos
    });
  };

  const calcularVPL = () => {
    if (input.investimentoInicial <= 0 || input.taxa <= 0 || input.fluxosCaixa.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const resultados: SaidaVPL[] = [];
    const taxaDecimal = input.taxa / 100;
    let valorPresenteAcumulado = -input.investimentoInicial; // Investimento inicial é negativo

    // Calcular VPL para cada período
    input.fluxosCaixa.forEach((fluxo) => {
      const fatorDesconto = Math.pow(1 + taxaDecimal, fluxo.periodo);
      const valorPresente = fluxo.valor / fatorDesconto;
      valorPresenteAcumulado += valorPresente;

      resultados.push({
        periodo: fluxo.periodo,
        fluxoCaixa: fluxo.valor,
        fatorDesconto: Number(fatorDesconto.toFixed(6)),
        valorPresente: Number(valorPresente.toFixed(2)),
        valorPresenteAcumulado: Number(valorPresenteAcumulado.toFixed(2))
      });
    });

    // Adicionar valor residual se especificado
    if (input.valorResidual > 0 && input.periodoValorResidual > 0) {
      const fatorDescontoResidual = Math.pow(1 + taxaDecimal, input.periodoValorResidual);
      const valorPresenteResidual = input.valorResidual / fatorDescontoResidual;
      valorPresenteAcumulado += valorPresenteResidual;

      // Adicionar linha do valor residual
      resultados.push({
        periodo: input.periodoValorResidual,
        fluxoCaixa: input.valorResidual,
        fatorDesconto: Number(fatorDescontoResidual.toFixed(6)),
        valorPresente: Number(valorPresenteResidual.toFixed(2)),
        valorPresenteAcumulado: Number(valorPresenteAcumulado.toFixed(2))
      });
    }

    setResults(resultados);
    setVplFinal(Number(valorPresenteAcumulado.toFixed(2)));

    // Calcular Payback Descontado
    calcularPayback(resultados);

    // Calcular TIR (aproximação)
    calcularTIR();
  };

  const calcularPayback = (resultados: SaidaVPL[]) => {
    let acumulado = -input.investimentoInicial;
    let periodoPayback = null;

    for (const resultado of resultados) {
      if (acumulado < 0 && acumulado + resultado.valorPresente >= 0) {
        // Interpolação para encontrar o período exato
        const periodoAnterior = resultado.periodo - 1;
        const fracaoAno = Math.abs(acumulado) / resultado.valorPresente;
        periodoPayback = periodoAnterior + fracaoAno;
        break;
      }
      acumulado += resultado.valorPresente;
    }

    setPayback(periodoPayback ? Number(periodoPayback.toFixed(2)) : null);
  };

  const calcularTIR = () => {
    // Método de Newton-Raphson simplificado para TIR
    let taxa = 0.1; // Taxa inicial de 10%
    const precisao = 0.0001;
    const maxIteracoes = 100;

    for (let i = 0; i < maxIteracoes; i++) {
      let vpl = -input.investimentoInicial;
      let dvpl = 0;

      // Calcular VPL e sua derivada
      input.fluxosCaixa.forEach((fluxo) => {
        const fator = Math.pow(1 + taxa, fluxo.periodo);
        vpl += fluxo.valor / fator;
        dvpl -= (fluxo.periodo * fluxo.valor) / (fator * (1 + taxa));
      });

      // Valor residual
      if (input.valorResidual > 0 && input.periodoValorResidual > 0) {
        const fator = Math.pow(1 + taxa, input.periodoValorResidual);
        vpl += input.valorResidual / fator;
        dvpl -= (input.periodoValorResidual * input.valorResidual) / (fator * (1 + taxa));
      }

      if (Math.abs(vpl) < precisao) {
        setTir(Number((taxa * 100).toFixed(2)));
        return;
      }

      if (dvpl === 0) break;
      taxa = taxa - vpl / dvpl;

      if (taxa < -1) taxa = -0.99; // Evitar taxas muito negativas
    }

    setTir(null); // TIR não convergiu
  };

  const limparCalculos = () => {
    setResults([]);
    setVplFinal(null);
    setTir(null);
    setPayback(null);
    setInput({
      investimentoInicial: 0,
      taxa: 0,
      tempo: 0,
      fluxosCaixa: [],
      valorResidual: 0,
      periodoValorResidual: 0
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Calculadora de VPL</h2>
      
      {/* Formulário de entrada básico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investimento Inicial (R$)
          </label>
          <input
            type="number"
            value={input.investimentoInicial || ''}
            onChange={(e) => setInput({...input, investimentoInicial: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: 50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Desconto (% ao período)
          </label>
          <input
            type="number"
            step="0.01"
            value={input.taxa || ''}
            onChange={(e) => setInput({...input, taxa: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: 12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempo do Projeto (períodos)
          </label>
          <input
            type="number"
            value={input.tempo || ''}
            onChange={(e) => setInput({...input, tempo: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: 5"
          />
        </div>
      </div>

      {/* Valor Residual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Residual (R$) - Opcional
          </label>
          <input
            type="number"
            value={input.valorResidual || ''}
            onChange={(e) => setInput({...input, valorResidual: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: 10000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período do Valor Residual
          </label>
          <input
            type="number"
            value={input.periodoValorResidual || ''}
            onChange={(e) => setInput({...input, periodoValorResidual: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: 5"
          />
        </div>
      </div>

      {/* Fluxos de Caixa */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Fluxos de Caixa</h3>
          <div className="flex gap-2">
            <button
              onClick={gerarFluxosAutomaticos}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm"
            >
              Gerar Períodos
            </button>
            <button
              onClick={adicionarFluxoCaixa}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Adicionar Fluxo
            </button>
          </div>
        </div>

        {input.fluxosCaixa.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {input.fluxosCaixa.map((fluxo, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm font-medium text-gray-600 w-16">
                  Período {fluxo.periodo}:
                </span>
                <input
                  type="number"
                  value={fluxo.valor || ''}
                  onChange={(e) => atualizarFluxoCaixa(index, Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="0"
                />
                <button
                  onClick={() => removerFluxoCaixa(index)}
                  className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={calcularVPL}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Calcular VPL
        </button>
        <button
          onClick={limparCalculos}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Limpar
        </button>
      </div>

      {/* Resultado do VPL */}
      {vplFinal !== null && (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Resultado da Análise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">VPL:</span>
              <div className={`text-2xl font-bold ${vplFinal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {vplFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600">
                {vplFinal >= 0 ? 'Projeto viável' : 'Projeto inviável'}
              </div>
            </div>
            
            {tir !== null && (
              <div>
                <span className="font-medium">TIR:</span>
                <div className="text-2xl font-bold text-blue-600">
                  {tir.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">
                  Taxa Interna de Retorno
                </div>
              </div>
            )}

            {payback !== null && (
              <div>
                <span className="font-medium">Payback Descontado:</span>
                <div className="text-2xl font-bold text-orange-600">
                  {payback.toFixed(2)} períodos
                </div>
                <div className="text-sm text-gray-600">
                  Tempo de retorno
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabela de resultados detalhados */}
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Análise Detalhada dos Fluxos</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Período</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Fluxo de Caixa</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Fator Desconto</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Valor Presente</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">VP Acumulado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="px-4 py-2 border-b text-sm font-medium">0</td>
                <td className="px-4 py-2 border-b text-sm text-red-600 font-medium">
                  -R$ {input.investimentoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 border-b text-sm">1.000000</td>
                <td className="px-4 py-2 border-b text-sm text-red-600 font-medium">
                  -R$ {input.investimentoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 border-b text-sm text-red-600 font-medium">
                  -R$ {input.investimentoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {results.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 border-b text-sm">{result.periodo}</td>
                  <td className="px-4 py-2 border-b text-sm">
                    R$ {result.fluxoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">{result.fatorDesconto}</td>
                  <td className="px-4 py-2 border-b text-sm">
                    R$ {result.valorPresente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-4 py-2 border-b text-sm font-medium ${result.valorPresenteAcumulado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {result.valorPresenteAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
