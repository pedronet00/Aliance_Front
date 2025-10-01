import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ProdutoDTO } from "@/types/Produto/ProdutoDTO";
import apiClient from "@/api/apiClient";
import TextArea from "@/components/form/input/TextArea";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";

type CategoriaProduto = {
  id: number;
  nome: string;
};

type Fornecedor = {
  id: number;
  nome: string;
};

type Props = {
  initialData?: ProdutoDTO;
  onSubmit: (data: ProdutoDTO) => Promise<void>;
};

export default function FormProduto({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ProdutoDTO>(
    initialData ?? {
      nome: "",
      descricao: "",
      quantidadeEstoque: 0,
      fornecedorId: 0,
      preco: 0,
      status: true,
      categoriaProdutoId: 0,
      empresaId: user?.empresaId ?? 0,
    }
  );

  const [categoriaOptions, setCategoriaOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [fornecedorOptions, setFornecedorOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    apiClient
      .get<CategoriaProduto[]>("/CategoriaProdutos")
      .then((res) =>
        setCategoriaOptions(
          res.data.map((cat) => ({
            value: String(cat.id),
            label: cat.nome,
          }))
        )
      )
      .catch((err) => console.error("Erro ao carregar categorias", err));

    apiClient
      .get<Fornecedor[]>("/Fornecedores")
      .then((res) =>
        setFornecedorOptions(
          res.data.map((f) => ({
            value: String(f.id),
            label: f.nome,
          }))
        )
      )
      .catch((err) => console.error("Erro ao carregar fornecedores", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          placeholder="Insira o nome do produto"
          value={formData.nome}
          onChange={(e) =>
            setFormData({ ...formData, nome: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <TextArea
          placeholder="Insira a descrição do produto"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Quantidade no estoque</Label>
        <Input
          type="number"
          value={formData.quantidadeEstoque}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantidadeEstoque: Number(e.target.value),
            })
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <Label>Preço unitário</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.preco}
          onChange={(e) =>
            setFormData({ ...formData, preco: Number(e.target.value) })
          }
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <Label>Categoria</Label>
        <Select
          options={categoriaOptions}
          placeholder="Selecione uma categoria"
          defaultValue={formData.categoriaProdutoId?.toString() || ""}
          onChange={(val) =>
            setFormData({ ...formData, categoriaProdutoId: Number(val) })
          }
        />
      </div>

      <div>
        <Label>Fornecedor</Label>
        <Select
          options={fornecedorOptions}
          placeholder="Selecione um fornecedor"
          defaultValue={formData.fornecedorId?.toString() || ""}
          onChange={(val) =>
            setFormData({ ...formData, fornecedorId: Number(val) })
          }
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
