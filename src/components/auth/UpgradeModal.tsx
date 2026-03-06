import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Same PLAN_VALUES and PLAN_DETAILS
const PLAN_VALUES: Record<string, number> = {
    Básico: 79.9,
    Essencial: 119.9,
    Premium: 199.9,
};

const PLAN_DETAILS: Record<string, { description: string, features: string[] }> = {
    Básico: {
        description: 'Ideal para pequenas congregações.',
        features: [
            'Até 100 membros ativos',
            'Controle financeiro simples',
            'Relatórios básicos de gestão',
            'Suporte via e-mail',
            'Acesso seguro e backups diários'
        ]
    },
    Essencial: {
        description: 'Feito para igrejas em crescimento rápido.',
        features: [
            'Membros ilimitados',
            'Gestão de células e grupos',
            'Painel financeiro avançado',
            'Controle de eventos e calendário',
            'Suporte prioritário (WhatsApp)',
            'Relatórios detalhados exportáveis'
        ]
    },
    Premium: {
        description: 'A solução completa para múltiplas sedes.',
        features: [
            'Gestão avançada de filiais',
            'Dashboard 100% personalizado',
            'Controle rigoroso de patrimônio',
            'Treinamento de equipe e onboarding',
            'API nativa para integrações',
            'Gerente de conta dedicado 24/7'
        ]
    }
};

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null;

    const handleSelectPlan = () => {
        // For now, redirect to the subscription details page where they can upgrade
        window.location.href = '/detalhes-assinatura';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-6xl max-h-[100vh] overflow-y-auto px-4 py-8 pointer-events-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 p-2 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white shadow z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-white">
                        Faça um upgrade para acessar
                    </h2>
                    <p className="mt-4 text-xl text-gray-200">
                        Desbloqueie essa e outras funcionalidades exclusivas escolhendo um dos nossos planos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center max-w-5xl mx-auto">
                    {Object.entries(PLAN_VALUES).map(([planName, price]) => {
                        const isHighlighted = planName === 'Essencial';
                        const details = PLAN_DETAILS[planName] || { description: '', features: [] };

                        return (
                            <div
                                key={planName}
                                className={`relative flex flex-col rounded-3xl p-8 shadow-xl cursor-pointer transition-all hover:-translate-y-1 bg-white dark:bg-gray-800 ${isHighlighted
                                    ? 'border-2 border-brand-500 ring-4 ring-brand-500/10 md:scale-105 z-10 shadow-2xl'
                                    : 'border border-gray-200 dark:border-gray-700 z-0'
                                    }`}
                                onClick={() => handleSelectPlan()}
                            >
                                {isHighlighted && (
                                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-500 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md whitespace-nowrap">
                                        Mais Escolhido
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{planName}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm h-10">{details.description}</p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                                        R$ {price.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">/mês</span>
                                </div>

                                <ul className="mb-8 flex-1 space-y-4">
                                    {details.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start">
                                            <svg className={`shrink-0 w-5 h-5 mt-0.5 ${isHighlighted ? 'text-brand-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 text-left w-full">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={isHighlighted ? "default" : "outline"}
                                    className={`w-full py-6 text-base font-semibold rounded-xl transition-all mt-auto ${isHighlighted ? 'bg-brand-500 hover:bg-brand-600 shadow-md text-white' : ''}`}
                                >
                                    Selecionar {planName}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
