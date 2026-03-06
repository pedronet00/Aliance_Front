import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { useEffect } from "react";

interface PlanRouteProps {
    blockedPlans: string[];
}

export default function PlanRoute({ blockedPlans }: PlanRouteProps) {
    const { user } = useAuth();

    const isBlocked = blockedPlans.includes(user?.plan || "Gratuito");

    useEffect(() => {
        if (isBlocked) {
            Swal.fire({
                icon: "warning",
                title: "Funcionalidade Indisponível",
                text: "O seu plano atual (Gratuito) não permite acessar esta funcionalidade. Acesse as opções de assinatura para fazer um upgrade.",
                confirmButtonText: "Ver Planos",
                showCancelButton: true,
                cancelButtonText: "Voltar",
                confirmButtonColor: '#16a34a'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/detalhes-assinatura';
                }
            });
        }
    }, [isBlocked]);

    if (isBlocked) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
