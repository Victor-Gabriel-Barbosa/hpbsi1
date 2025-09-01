'use client';

import { useState } from 'react';

export interface EntradaFinanceira {
  valorFinanciado: number;
  taxaJuros: number;
  numeroMeses: number;
}

export interface SaidaFinanceira {
  periodo: number;
  saldoDevedor: number;
  amortizacao: number;
  juros: number;
  prestacao: number;
}

export default function CalculadoraFinanceira() {
  const [input, setInput] = useState<EntradaFinanceira>({
    valorFinanciado: 0,
    taxaJuros: 0,
    numeroMeses: 0
  });

  const [sistema, setSistema] = useState<'SAC' | 'SAF' | 'SAA'>('SAC');
  const [results, setResults] = useState<SaidaFinanceira[]>([]);
  const [resumo, setResumo] = useState<{
    totalJuros: number;
    totalAmortizacao: number;
    totalPrestacoes: number;
  } | null>(null);

  // Cálculo SAC (Sistema de Amortização Constante)
  const calcularSAC = (vp: number, taxa: number, n: number): SaidaFinanceira[] => {
    const resultados: SaidaFinanceira[] = [];
    const taxaMensal = taxa / 100;
    const amortizacaoConstante = vp / n;
    let saldoDevedor = vp;

    for (let periodo = 1; periodo <= n; periodo++) {
      const juros = saldoDevedor * taxaMensal;
      const prestacao = amortizacaoConstante + juros;
      
      resultados.push({
        periodo,
        saldoDevedor: Number(saldoDevedor.toFixed(2)),
        amortizacao: Number(amortizacaoConstante.toFixed(2)),
        juros: Number(juros.toFixed(2)),
        prestacao: Number(prestacao.toFixed(2))
      });

      saldoDevedor -= amortizacaoConstante;
    }

    return resultados;
  };

  // Cálculo SAF (Sistema de Amortização Francês - Price)
  const calcularSAF = (vp: number, taxa: number, n: number): SaidaFinanceira[] => {
    const resultados: SaidaFinanceira[] = [];
    const taxaMensal = taxa / 100;
    const prestacaoConstante = (vp * taxaMensal * Math.pow(1 + taxaMensal, n)) / 
                               (Math.pow(1 + taxaMensal, n) - 1);
    let saldoDevedor = vp;

    for (let periodo = 1; periodo <= n; periodo++) {
      const juros = saldoDevedor * taxaMensal;
      const amortizacao = prestacaoConstante - juros;
      
      resultados.push({
        periodo,
        saldoDevedor: Number(saldoDevedor.toFixed(2)),
        amortizacao: Number(amortizacao.toFixed(2)),
        juros: Number(juros.toFixed(2)),
        prestacao: Number(prestacaoConstante.toFixed(2))
      });

      saldoDevedor -= amortizacao;
    }

    return resultados;
  };

  // Cálculo SAA (Sistema de Amortização Americano)
  const calcularSAA = (vp: number, taxa: number, n: number): SaidaFinanceira[] => {
    const resultados: SaidaFinanceira[] = [];
    const taxaMensal = taxa / 100;
    const jurosMensal = vp * taxaMensal;

    for (let periodo = 1; periodo <= n; periodo++) {
      const amortizacao = periodo === n ? vp : 0;
      const prestacao = periodo === n ? vp + jurosMensal : jurosMensal;
      
      resultados.push({
        periodo,
        saldoDevedor: Number(vp.toFixed(2)),
        amortizacao: Number(amortizacao.toFixed(2)),
        juros: Number(jurosMensal.toFixed(2)),
        prestacao: Number(prestacao.toFixed(2))
      });
    }

    return resultados;
  };

  const calcularFinanciamento = () => {
    if (input.valorFinanciado <= 0 || input.taxaJuros <= 0 || input.numeroMeses <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos.');
      return;
    }

    let resultados: SaidaFinanceira[] = [];

    switch (sistema) {
      case 'SAC':
        resultados = calcularSAC(input.valorFinanciado, input.taxaJuros, input.numeroMeses);
        break;
      case 'SAF':
        resultados = calcularSAF(input.valorFinanciado, input.taxaJuros, input.numeroMeses);
        break;
      case 'SAA':
        resultados = calcularSAA(input.valorFinanciado, input.taxaJuros, input.numeroMeses);
        break;
    }

    setResults(resultados);

    // Calcular resumo
    const totalJuros = resultados.reduce((sum, item) => sum + item.juros, 0);
    const totalAmortizacao = resultados.reduce((sum, item) => sum + item.amortizacao, 0);
    const totalPrestacoes = resultados.reduce((sum, item) => sum + item.prestacao, 0);

    setResumo({
      totalJuros: Number(totalJuros.toFixed(2)),
      totalAmortizacao: Number(totalAmortizacao.toFixed(2)),
      totalPrestacoes: Number(totalPrestacoes.toFixed(2))
    });
  };

  const limparCalculos = () => {
    setResults([]);
    setResumo(null);
    setInput({ valorFinanciado: 0, taxaJuros: 0, numeroMeses: 0 });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Calculadora de Financiamento</h2>
      
      {/* Formulário de entrada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor do Financiamento (R$)
          </label>
          <input
            type="number"
            value={input.valorFinanciado || ''}
            onChange={(e) => setInput({...input, valorFinanciado: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 100000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Juros (% ao mês)
          </label>
          <input
            type="number"
            step="0.01"
            value={input.taxaJuros || ''}
            onChange={(e) => setInput({...input, taxaJuros: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Meses
          </label>
          <input
            type="number"
            value={input.numeroMeses || ''}
            onChange={(e) => setInput({...input, numeroMeses: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sistema de Amortização
          </label>
          <select
            value={sistema}
            onChange={(e) => setSistema(e.target.value as 'SAC' | 'SAF' | 'SAA')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SAC">SAC - Sistema de Amortização Constante</option>
            <option value="SAF">SAF - Sistema de Amortização Francês (Price)</option>
            <option value="SAA">SAA - Sistema de Amortização Americano</option>
          </select>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={calcularFinanciamento}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calcular
        </button>
        <button
          onClick={limparCalculos}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Limpar
        </button>
      </div>

      {/* Resumo */}
      {resumo && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Resumo do Financiamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Total de Juros:</span>
              <div className="text-lg font-bold text-blue-600">
                R$ {resumo.totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="font-medium">Total Amortizado:</span>
              <div className="text-lg font-bold text-green-600">
                R$ {resumo.totalAmortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="font-medium">Total Pago:</span>
              <div className="text-lg font-bold text-gray-800">
                R$ {resumo.totalPrestacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de resultados */}
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tabela de Amortização - {sistema}</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Período</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Saldo Devedor</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Amortização</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Juros</th>
                <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">Prestação</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 border-b text-sm">{result.periodo}</td>
                  <td className="px-4 py-2 border-b text-sm">
                    R$ {result.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    R$ {result.amortizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 border-b text-sm">
                    R$ {result.juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 border-b text-sm font-medium">
                    R$ {result.prestacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
