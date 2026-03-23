export const ICON_OPTIONS = [
  'Target', 'FileText', 'Book', 'Laptop', 'Palette', 'Activity', 'Music',
  'Pizza', 'Coffee', 'Dumbbell', 'Moon', 'Rocket', 'Gift', 'Smartphone', 'Star',
  'Lightbulb', 'Gamepad2', 'Zap', 'Smile', 'Bug', 'Cat', 'Dna',
  'Flower2', 'Leaf', 'Ticket', 'Clapperboard', 'Mic', 'Headphones',
];

export const PRIORITY_COLORS = {
  high: '#FFB3BA', // red pastel
  medium: '#FFFFB3', // yellow pastel
  normal: '#B3D9FF', // blue pastel
} as const;

export const ACCENT_COLORS = [
  { name: 'lavender', hex: '#E8D7F1' },
  { name: 'peach', hex: '#FFD5B8' },
  { name: 'mint', hex: '#D4F1E8' },
  { name: 'lilac', hex: '#DCC9E8' },
  { name: 'rose', hex: '#FFD7E3' },
  { name: 'sky', hex: '#C8E6F5' },
  { name: 'lemon', hex: '#FFFACD' },
  { name: 'cream', hex: '#FFF9E6' },
];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Sin repetición' },
  { value: 'every-3h', label: 'Cada 3 horas' },
  { value: 'every-5h', label: 'Cada 5 horas' },
  { value: 'every-8h', label: 'Cada 8 horas' },
  { value: 'daily', label: 'Cada día' },
  { value: 'monthly', label: 'Cada mes' },
  { value: 'quarterly', label: 'Cada 3 meses' },
  { value: 'yearly', label: 'Cada año' },
  { value: 'custom', label: 'Personalizado' },
];

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'];

export const LIZZARD_EASTER_EGG = '🦎';

// Configuración de animaciones Framer Motion
export const ANIMATIONS = {
  containerSpring: {
    type: 'spring',
    damping: 15,
    stiffness: 100,
  },
  containerTransition: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
  itemVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      }
    }
  },
};
