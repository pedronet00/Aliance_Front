import { Tithe } from "@/types/Tithe/Tithe";
import ComponentCard from "@/components/common/ComponentCard";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

interface TitheReceiptProps {
  tithe: Tithe;
}

export default function TitheReceipt({ tithe }: TitheReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!receiptRef.current) return;

    const options = {
      margin: 10,
      filename: `comprovante-dizimo-${tithe.guid}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(options).from(receiptRef.current).save();
  };

  return (
    <div className="flex justify-center py-10 print:p-0">
      <div className="w-full max-w-lg print:shadow-none print:border-none">

        {/* ÁREA QUE VIRA PDF */}
        <div ref={receiptRef}>
          <ComponentCard title="Comprovante de Dízimo">
            <div className="space-y-8 p-4">

              <div className="text-center space-y-2 border-b pb-4">
                <img
                  src="/images/logo/PNG PRETO.png"
                  alt="Logo"
                  className="mx-auto h-16 object-contain"
                />

                <h2 className="text-lg font-semibold">Igreja Aliança em Cristo</h2>
                <p className="text-sm text-gray-600">CNPJ: 12.345.678/0001-90</p>

                <p className="text-xs text-gray-500 leading-4">
                  Rua da Esperança, 123 — Centro  
                  <br />
                  São Paulo/SP — CEP 00000-000
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Membro:</span>
                  <span>{tithe.userName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Data:</span>
                  <span>{new Date(tithe.date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Valor:</span>
                  <span>R$ {tithe.amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Código:</span>
                  <span className="text-xs">{tithe.guid}</span>
                </div>
              </div>

              <div className="border-t pt-4 text-center">
                <p className="text-xs italic text-gray-600 leading-5">
                  “Cada um dê conforme determinou em seu coração,
                  não com pesar ou obrigação, pois Deus ama quem dá com alegria.”  
                  <br />
                  <span className="text-[10px]">— 2 Coríntios 9:7</span>
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Botão PDF */}
        <div className="pt-4 flex justify-center">
          <Button onClick={downloadPDF}>Baixar PDF</Button>
        </div>
      </div>
    </div>
  );
}
