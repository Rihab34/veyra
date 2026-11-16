interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const MARK_SIZE = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-14 w-14',
};

const TEXT_SIZE = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/assets/images/ChatGPT_Image_Aug_21,_2026,_01_55_04_PM.png"
        alt=""
        aria-hidden="true"
        className={`${MARK_SIZE[size]} object-contain mix-blend-multiply`}
      />
      {showText && (
        <span className={`font-semibold tracking-[-0.03em] text-[#0e1217] ${TEXT_SIZE[size]}`}>
          Veyra
        </span>
      )}
    </span>
  );
}
