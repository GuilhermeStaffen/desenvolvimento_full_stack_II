import React, { useEffect, useState } from "react";
import {
  listProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
  listSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/PrivateRoute";
import toast from "react-hot-toast";
import CustomForm from "../components/CustomForm";
import CustomListGrid from "../components/CustomListGrid";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierPage, setSupplierPage] = useState(1);
  const [supplierTotalPages, setSupplierTotalPages] = useState(1);


  async function loadProducts(p = 1) {
    try {
      const res = await listProdutos({ page: p, limit: 6 });
      const payload = res.data ?? res;
      setProducts(payload.items ?? []);
      setProductPage(payload.page ?? p);
      setProductTotalPages(payload.totalPages ?? 1);
    } catch {
      toast.error("Erro ao carregar produtos");
    }
  }

  async function handleSaveProduct(prod) {
    try {
      const productPayload = {
        name: prod.name,
        description: prod.description,
        price: Number(prod.price),
        quantity: Number(prod.quantity),
        images: prod.images,
      };

      if (prod.id) {
        await updateProduto(prod.id, productPayload);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduto(productPayload);
        toast.success("Produto criado com sucesso!");
      }
      setSelectedProduct(null);
      loadProducts();
    } catch {
      toast.error("Erro ao salvar produto");
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Excluir?")) return;
    try {
      await deleteProduto(id);
      loadProducts();
    } catch {
      toast.error("Erro ao excluir produto");
    }
  }

  
  async function loadSuppliers(p = 1) {
  try {
    const res = await listSuppliers({ page: p, limit: 6 });
    const payload = res.data ?? res;
    setSuppliers(payload.items ?? []);
    setSupplierPage(payload.page ?? p);
    setSupplierTotalPages(payload.totalPages ?? 1);
  } catch (err) {
    console.error(err);
    toast.error("Erro ao carregar fornecedores");
  }
}

  async function handleSaveSupplier(supplier) {
    try {
      const payload = {
        name: supplier.name,
        email: supplier.email,
        cnpj: supplier.cnpj,
        phone: supplier.phone,
        website: supplier.website,
      };

      if (supplier.id) {
        await updateSupplier(supplier.id, payload);
        toast.success("Fornecedor atualizado com sucesso!");
      } else {
        await createSupplier(payload);
        toast.success("Fornecedor criado com sucesso!");
      }
      setSelectedSupplier(null);
      loadSuppliers();
    } catch {
      toast.error("Erro ao salvar fornecedor");
    }
  }

  async function handleDeleteSupplier(id) {
    if (!confirm("Excluir fornecedor?")) return;
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch {
      toast.error("Erro ao excluir fornecedor");
    }
  }



  useEffect(() => {
    if (user?.userType === "admin") {
      loadProducts();
      loadSuppliers();
    }
  }, [user]);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto py-12 px-6 space-y-16">
        <h1 className="text-4xl font-bold text-center md:text-left">
          Painel Administrativo
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          <section className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedProduct ? "Editar produto" : "Novo produto"}
            </h2>
            <CustomForm
              current={selectedProduct}
              onSave={handleSaveProduct}
              onCancel={() => setSelectedProduct(null)}
              fields={[
                { name: "name", type: "text", label: "Nome" },
                { name: "price", type: "number", label: "Preço" },
                { name: "quantity", type: "number", label: "Quantidade" },
                { name: "images", type: "array", label: "Imagens" },
                { name: "description", type: "textarea", label: "Descrição" },
              ]}
            />
          </section>

          <section className="md:flex-2 rounded-xl shadow-lg">
            <CustomListGrid
              title="Produtos"
              items={products.map((p) => ({
                id: p.id,
                itemTitle: p.name,
                text1: `R$ ${Number(p.price).toFixed(2)}`,
                text2: `Estoque: ${p.quantity}`,
                image: p.images?.[0]?.url || null,
              }))}
              rawItems={products}
              onEdit={(id) => {
                const prod = products.find(p => p.id === id);
                setSelectedProduct(prod);
              }}
              onDelete={(id) => handleDeleteProduct(id)}
              page={productPage}
              totalPages={productTotalPages}
              onPrevPage={() => loadProducts(productPage - 1)}
              onNextPage={() => loadProducts(productPage + 1)}
            />
          </section>
        </div>


        <div className="flex flex-col md:flex-row gap-12">
          <section className=" md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedSupplier ? "Editar fornecedor" : "Novo fornecedor"}
            </h2>
            <CustomForm
              current={selectedSupplier}
              onSave={handleSaveSupplier}
              onCancel={() => setSelectedSupplier(null)}
              fields={[
                { name: "name", type: "text", label: "Nome" },
                { name: "email", type: "text", label: "Email" },
                { name: "cnpj", type: "text", label: "CNPJ" },
                { name: "phone", type: "text", label: "Telefone" },
                { name: "website", type: "text", label: "Website" },
              ]}
            />
          </section>

          <section className="md:flex-2 rounded-xl shadow-lg flex flex-row flex-wrap flex-grow">
            <CustomListGrid
              title="Fornecedores"
              items={suppliers.map((s) => ({
                id: s.id,
                itemTitle: s.name,
                text1: s.email,
                text2: s.phone,
              }))}
              rawItems={suppliers}
              onEdit={(id) => {
                const supplier = suppliers.find((s) => s.id === id);
                setSelectedSupplier(supplier);
              }}
              onDelete={(id) => handleDeleteSupplier(id)}
              page={supplierPage}
              totalPages={supplierTotalPages}
              onPrevPage={() => loadSuppliers(supplierPage - 1)}
              onNextPage={() => loadSuppliers(supplierPage + 1)}
            />
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
