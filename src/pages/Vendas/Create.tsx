import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { useState, useEffect } from "react";
import Form from "@/components/form/Form";
import apiClient from "@/api/apiClient";

interface Cliente {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface ItemVenda {
  ProdutoId: number;
  Quantidade: number;
  ValorUnitario: number;
}

export default function NovaVenda() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [clienteId, setClienteId] = useState<number | "">("");
  const [descricao, setDescricao] = useState("");
  const [desconto, setDesconto] = useState<number>(0);
  const [itens, setItens] = useState<ItemVenda[]>([{ ProdutoId: 0, Quantidade: 1 }]);
  const [loading, setLoading] = useState(true)

  // Carregar clientes e produtos da API
  useEffect(() => {
    apiClient
      .get("/Clientes")
      .then((res) => setClientes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    apiClient.get("/Produto")
      .then((res) => setProdutos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    const vendaPayload = {
    ClienteId: clienteId,
    Descricao: descricao,
    DescontoPercentual: desconto,
    EmpresaId: 1,
    Itens: itens.map(i => ({
        ProdutoId: i.ProdutoId,       // maiúscula igual ao DTO do backend
        Quantidade: i.Quantidade,     // maiúscula igual ao DTO do backend
        ValorUnitario: produtos.find(p => p.id === i.ProdutoId)?.preco || 0
    }))
    };


    console.log("Enviando venda:", vendaPayload);

    apiClient
  .post("/Vendas", vendaPayload) // não precisa de body: JSON.stringify
  .then((res) => {
    if (res.status === 200 || res.status === 201) {
      alert("Venda registrada com sucesso!");
    } else {
      alert("Erro ao registrar a venda.");
    }
  })
  .catch((err) => {
    console.error("Erro ao registrar a venda:", err);
    alert("Erro ao registrar a venda.");
  });

  };

  const handleItemChange = (index: number, field: keyof ItemVenda, value: any) => {
  const newItens = [...itens];

  if (field === "ProdutoId") {
    const produto = produtos.find(p => p.id === Number(value));
        newItens[index] = { 
            ...newItens[index], 
            ProdutoId: Number(value),
            ValorUnitario: produto ? produto.preco : 0
        };
    } else {
        newItens[index] = { ...newItens[index], [field]: value };
    }

  setItens(newItens);
};


  const addItem = () => {
    setItens([...itens, { ProdutoId: 0, Quantidade: 1, ValorUnitario: 0 }]);

  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  return (
    <div>
      <PageMeta
        title="Nova Venda | Aliance ERP"
        description="Página para registrar nova venda"
      />
      <PageBreadcrumb pageTitle="Nova venda" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className=" w-full max-w-[1090px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Nova Venda
          </h3>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6 mt-6 max-w-2xl">
          {/* Cliente */}
          <div>
            <label className="block mb-1">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
              className="border rounded w-full p-2"
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>

          {/* Desconto */}
          <div>
            <label className="block mb-1">Desconto (%)</label>
            <input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              className="border rounded w-full p-2"
              min="0"
              max="100"
            />
          </div>

          {/* Itens da Venda */}
          <div>
            <h4 className="font-semibold mb-2">Produtos</h4>
            {itens.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.ProdutoId}
                    onChange={(e) =>
                    handleItemChange(index, "ProdutoId", Number(e.target.value))
                    }
                  className="border rounded p-2 flex-1"
                >
                  <option value={0}>Selecione um produto</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - R$ {p.preco}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.Quantidade}
                  onChange={(e) =>
                    handleItemChange(index, "Quantidade", Number(e.target.value))
                  }
                  className="border rounded p-2 w-24"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Adicionar Produto
            </button>
          </div>

          {/* Botão */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </Form>
      </div>
    </div>
  );
}
