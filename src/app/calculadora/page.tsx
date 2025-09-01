'use client';

import { useState } from 'react';
import CalculadoraFinanceira from '../components/CalculadoraFinanceira';
import CalculadoraVPL from '../components/CalculadoraVPL';

type TabType = 'financiamento' | 'vpl';

export default function CalculadoraPage() {
  const [activeTab, setActiveTab] = useState<TabType>('financiamento');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculadora Financeira
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ferramenta completa para análise financeira incluindo sistemas de amortização 
            (SAC, SAF, SAA) e cálculo de Valor Presente Líquido (VPL) com TIR e Payback.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex justify-center space-x-8">
              <button
                onClick={() => setActiveTab('financiamento')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'financiamento'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sistemas de Financiamento
              </button>
              <button
                onClick={() => setActiveTab('vpl')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'vpl'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Análise de Investimentos (VPL)
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {activeTab === 'financiamento' && (
            <div>
              <CalculadoraFinanceira />
              
              {/* Informações sobre os sistemas */}
              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Sistemas de Amortização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-semibold text-blue-700 mb-2">SAC</h4>
                    <p className="text-gray-600">
                      Sistema de Amortização Constante. As parcelas são decrescentes, 
                      com amortização constante e juros decrescentes.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-semibold text-blue-700 mb-2">SAF (Price)</h4>
                    <p className="text-gray-600">
                      Sistema de Amortização Francês. Parcelas constantes com 
                      amortização crescente e juros decrescentes.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-semibold text-blue-700 mb-2">SAA</h4>
                    <p className="text-gray-600">
                      Sistema de Amortização Americano. Pagamento apenas de juros 
                      durante o período, com amortização total no final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vpl' && (
            <div>
              <CalculadoraVPL />
              
              {/* Informações sobre VPL */}
              <div className="mt-8 bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Análise de Investimentos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-semibold text-green-700 mb-2">VPL</h4>
                    <p className="text-gray-600">
                      Valor Presente Líquido. Se VPL &gt; 0, o projeto é viável. 
                      Representa o valor adicionado ao patrimônio.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-semibold text-green-700 mb-2">TIR</h4>
                    <p className="text-gray-600">
                      Taxa Interna de Retorno. Taxa que torna o VPL igual a zero. 
                      Deve ser maior que a taxa de desconto para viabilidade.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h4 className="font-semibold text-green-700 mb-2">Payback</h4>
                    <p className="text-gray-600">
                      Tempo necessário para recuperar o investimento inicial, 
                      considerando o valor do dinheiro no tempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Calculadora Financeira - Sistemas de Amortização e Análise de Investimentos
          </p>
          <p className="mt-1">
            Desenvolvido com Next.js e TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}
