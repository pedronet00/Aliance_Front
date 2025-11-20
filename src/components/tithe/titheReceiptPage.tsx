import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import html2pdf from "html2pdf.js";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import ComponentCard from "@/components/common/ComponentCard";

export default function TitheReceiptPage() {
  const { guid } = useParams();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!guid) return;
    carregarHtml();
  }, [guid]);

  const carregarHtml = async () => {
    const res = await apiClient.get(`/Tithe/receipt/${guid}`, {
      responseType: "text",
    });
    setHtmlContent(res.data);
  };

  const downloadPDF = async () => {
    if (!htmlContent) return;

    // Criar container invisível
    const temp = document.createElement("div");
    temp.style.position = "fixed";
    temp.style.top = "-200%";
    temp.innerHTML = htmlContent;
    document.body.appendChild(temp);

    await html2pdf()
      .set({
        margin: 10,
        filename: `comprovante-dizimo-${guid}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(temp)
      .save();

    temp.remove();
  };

  if (!htmlContent) return <p>Carregando comprovante...</p>;

  return (
    
<>
          {/* Renderiza o HTML vindo do backend */}
          <div
            ref={containerRef}
            className=""
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="">
            <Button onClick={downloadPDF}>
              Baixar PDF
            </Button>
          </div>
</>
  );
}
