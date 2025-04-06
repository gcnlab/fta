// /app/contents/tools/components/SumUp.tsx

import React, { useState, useEffect } from 'react';

interface Variable {
  name: string;
  value: number;
}

interface Calculation {
  id: number;
  formula: string;
  result: number;
  isActive: boolean;
  editingFormula: string;
}

const SumUp: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>(() => {
    const saved = localStorage.getItem('sumup-variables');
    return saved ? JSON.parse(saved) : [
      { name: 'a', value: 0 },
      { name: 'b', value: 0 },
      { name: 'c', value: 0 }
    ];
  });

  const [editingValues, setEditingValues] = useState<{[key: string]: string}>(() => {
    const saved = localStorage.getItem('sumup-editing-values');
    return saved ? JSON.parse(saved) : {
      a: '',
      b: '',
      c: ''
    };
  });

  const [calculations, setCalculations] = useState<Calculation[]>(() => {
    const saved = localStorage.getItem('sumup-calculations');
    return saved ? JSON.parse(saved) : [
      { id: 1, formula: '', result: 0, isActive: false, editingFormula: '' },
      { id: 2, formula: '', result: 0, isActive: false, editingFormula: '' }
    ];
  });

  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('sumup-variables', JSON.stringify(variables));
    localStorage.setItem('sumup-editing-values', JSON.stringify(editingValues));
    localStorage.setItem('sumup-calculations', JSON.stringify(calculations));
  }, [variables, editingValues, calculations]);

  const handleVariableChange = (name: string, value: string) => {
    // 入力中の値をそのまま保持
    setEditingValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariableBlur = (name: string, value: string) => {
    let numValue = 0;
    try {
      // 空文字列の場合は0
      if (value.trim() === '') {
        numValue = 0;
      } else {
        // カンマを除去
        const processedValue = value.replace(/,/g, '');
        
        // 数式を評価
        try {
          // 数式を評価（変数は使用しない）
          numValue = new Function('return ' + processedValue)();
          // 数値でない場合は0
          if (typeof numValue !== 'number' || isNaN(numValue)) {
            numValue = 0;
          }
        } catch (e) {
          numValue = 0;
        }
      }
    } catch (e) {
      numValue = 0;
    }

    setVariables(variables.map(v => 
      v.name === name ? { ...v, value: numValue } : v
    ));

    // 正しい表示形式に更新
    setEditingValues(prev => ({
      ...prev,
      [name]: numValue === 0 ? '' : numValue.toLocaleString()
    }));
  };

  const handleFormulaChange = (id: number, value: string) => {
    setCalculations(calculations.map(calc => 
      calc.id === id ? { 
        ...calc, 
        editingFormula: value,
        isActive: value.trim() !== ''
      } : calc
    ));
  };

  const handleFormulaBlur = (id: number) => {
    setCalculations(calculations.map(calc => 
      calc.id === id ? { 
        ...calc, 
        formula: calc.editingFormula,
        isActive: calc.editingFormula.trim() !== ''
      } : calc
    ));
  };

  const handleToggleActive = (id: number) => {
    setCalculations(calculations.map(calc => 
      calc.id === id ? { ...calc, isActive: !calc.isActive } : calc
    ));
  };

  const addCalculation = () => {
    const newId = Math.max(...calculations.map(c => c.id), 0) + 1;
    setCalculations([...calculations, { 
      id: newId, 
      formula: '', 
      result: 0, 
      isActive: false,
      editingFormula: '' 
    }]);
  };

  const removeCalculation = (id: number) => {
    setCalculations(calculations.filter(calc => calc.id !== id));
  };

  const calculateResult = (formula: string): number => {
    try {
      if (!formula.trim()) return 0;
      let expression = formula.replace(/\s+/g, '');
      variables.forEach(v => {
        expression = expression.replace(new RegExp(v.name, 'g'), v.value.toString());
      });
      return new Function('return ' + expression)();
    } catch (e) {
      return 0;
    }
  };

  useEffect(() => {
    const updatedCalculations = calculations.map(calc => ({
      ...calc,
      result: calculateResult(calc.formula)
    }));
    setCalculations(updatedCalculations);

    const activeTotal = updatedCalculations
      .filter(calc => calc.isActive)
      .reduce((sum, calc) => sum + calc.result, 0);
    setTotal(activeTotal);
  }, [variables, calculations.map(c => c.formula).join(','), calculations.map(c => c.isActive).join(',')]);

  const handleClear = () => {
    // 計算式をクリア
    setCalculations([]);
    // 変数をリセット
    setVariables([
      { name: 'a', value: 0 },
      { name: 'b', value: 0 },
      { name: 'c', value: 0 }
    ]);
    // 編集中の値をリセット
    setEditingValues({
      a: '',
      b: '',
      c: ''
    });
  };

  return (
    <div className="p-4">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-base font-semibold text-gray-700 mb-1">Sum Up</h2>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex gap-4 mb-4">
              {/* 変数入力セクション */}
              <div className="flex-1 bg-white">
                <div className="px-5 py-2">
                  <div className="flex items-center">
                    <div className="w-12">変数</div>
                    <div className="flex gap-6">
                      {variables.map(variable => (
                        <div key={variable.name} className="flex items-center">
                          <div className="w-6 mr-2">{variable.name}</div>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={editingValues[variable.name]}
                            onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                            onBlur={(e) => handleVariableBlur(variable.name, e.target.value)}
                            className="w-[100px] h-8 px-2 text-center border rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 合計表示 */}
              <div className="w-[240px] bg-white rounded shadow-[0_0_6px_rgba(0,0,0,0.1)]">
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>合計</div>
                    <div className="text-2xl">
                      {total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 計算式セクション */}
            <div className="bg-white">
              <div className="px-5 h-[170px]">
                <div className="flex justify-between items-center mb-3">
                  <div>計算式</div>
                  <div className="flex gap-2">
                    <button
                      onClick={addCalculation}
                      className="h-7 px-4 bg-[#0D99FF] text-white text-sm rounded hover:bg-[#0D99FF]/90"
                    >
                      計算式を追加
                    </button>
                    <button
                      onClick={handleClear}
                      className="h-7 px-4 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      クリア
                    </button>
                  </div>
                </div>
                
                <div className="h-[150px] overflow-y-auto">
                  {calculations.map(calc => (
                    <div key={calc.id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={calc.isActive}
                        onChange={() => handleToggleActive(calc.id)}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        value={calc.editingFormula}
                        onChange={(e) => handleFormulaChange(calc.id, e.target.value)}
                        onBlur={() => handleFormulaBlur(calc.id)}
                        placeholder={calc.id === 1 ? '例：a+b+c' : '例：a*b'}
                        className="w-[500px] h-8 px-2 border rounded placeholder:text-gray-400"
                      />
                      <div className="w-[50px] text-right">
                        =
                      </div>
                      <div className="w-[100px] text-right">
                        {calc.result.toLocaleString()}
                      </div>
                      <div className="w-[20px] text-right">
                         
                      </div>
                      <button
                        onClick={() => removeCalculation(calc.id)}
                        className="h-8 px-3 bg-[#FF0000] text-white text-sm rounded hover:bg-[#FF0000]/90"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SumUp; 