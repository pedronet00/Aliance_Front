type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded font-medium";

  const sizeStyles = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
  };

  // novo mapeamento de cores no mesmo estilo que seu exemplo
  const colorStyles: Record<BadgeColor, string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    primary: "bg-indigo-100 text-indigo-700",
    light: "bg-gray-100 text-gray-700",
    dark: "bg-gray-800 text-white",
    gray: "bg-gray-100 text-gray-700",
  };

  const classes = [
    baseStyles,
    sizeStyles[size],
    colorStyles[color] ?? colorStyles.light,
  ].join(" ");

  return (
    <span className={classes}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
