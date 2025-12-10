// Toasts.ts
import { toast } from "react-toastify";

export const showToggleStatusToast = () => {
  toast.success(
    <div>
      <p><b>Sucesso!</b></p>
      <p>Status alterado com sucesso.</p>
    </div>
  );
};

export const showInfoToast = (message: string) => {
  toast.info(
    <div>
      <p><b>Aviso!</b></p>
      <p>{message}</p>
    </div>
  );
};

export const showCreatedSuccessfullyToast = () => {
  toast.success(
    <div>
      <p><b>Sucesso!</b></p>
      <p>Criado com sucesso.</p>
    </div>
  );
};

export const showEditedSuccessfullyToast = () => {
  toast.success(
    <div>
      <p><b>Sucesso!</b></p>
      <p>Editado com sucesso.</p>
    </div>
  );
};

export const showDeletedToast = () => {
  toast.success(
    <div>
      <p><b>Sucesso!</b></p>
      <p>Deletado com sucesso.</p>
    </div>
  );
};

export const showSuccessfulLogininToast = () => {
  toast.success(
    <div>
      <p><b>Sucesso!</b></p>
      <p>Sua sessão foi iniciada.</p>
    </div>
  );
};

export const showErrorLogininToast = () => {
  toast.error(
    <div>
      <p><b>Ops!</b></p>
      <p>Ocorreu um erro ao iniciar sua sessão.</p>
    </div>
  );
};

export const showLogoffToast = () => {
  toast.success(
    <div>
      <p><b>Sucesso!</b></p>
      <p>Sua sessão foi encerrada.</p>
    </div>
  );
};

export const showSessionExpiredToast = () => {
  toast.info(
    <div>
      <p><b>Ops!</b></p>
      <p>Sua sessão expirou. Faça o login novamente.</p>
    </div>
  );
};

export const showErrorToast = (message: string) => {
    toast.error(
        <div>
          <p><b>Erro!</b></p>
          <p>{message}</p>
        </div>
    );
};

export const showLoadingToast = (message: string) => {
    toast.info(
        <div>
          <p><b>Carregando...</b></p>
          <p>{message}</p>
        </div>
    );
};

export const showSuccessToast = (message: string) => {
    toast.success(
        <div>
          <p><b>Sucesso!</b></p>
          <p>{message}</p>
        </div>
    );
};