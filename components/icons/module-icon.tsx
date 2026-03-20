import Image from 'next/image';

type ModuleColor = 'white' | 'yellow' | 'blue' | 'emerald';

// CSS filter values to tint the black SVG paths to each color
const COLOR_FILTERS: Record<ModuleColor, string> = {
  white:   'brightness(0) invert(1)',
  yellow:  'brightness(0) saturate(100%) invert(75%) sepia(85%) saturate(1500%) hue-rotate(5deg) brightness(105%)',
  blue:    'brightness(0) saturate(100%) invert(45%) sepia(90%) saturate(1200%) hue-rotate(200deg) brightness(104%)',
  emerald: 'brightness(0) saturate(100%) invert(62%) sepia(58%) saturate(726%) hue-rotate(116deg) brightness(96%)',
};

interface ModuleIconProps {
  module: 'ops' | 'brain' | 'labs';
  className?: string;
  color?: ModuleColor;
}

export function ModuleIcon({ module, className = 'w-8 h-8', color = 'white' }: ModuleIconProps) {
  const iconMap = {
    ops:   '/icons/SVG/ops.svg',
    brain: '/icons/SVG/brain.svg',
    labs:  '/icons/SVG/labs.svg',
  };

  return (
    <Image
      src={iconMap[module]}
      alt={module}
      width={32}
      height={32}
      className={className}
      style={{ filter: COLOR_FILTERS[color] }}
    />
  );
}
