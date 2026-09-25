import React from 'react';
import {
  Calculator,
  Atom,
  BookOpen,
  Globe,
  Laptop,
  Languages,
  Award,
  Sparkles,
  Compass,
  BookMarked,
  Medal,
  Trophy,
  Target,
  Flame,
  Footprints,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  ScrollText,
  MessageSquare,
  MessagesSquare,
} from 'lucide-react';

interface BadgeIconProps {
  name: string;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'BookMarked':
      return <BookMarked className={className} />;
    case 'Medal':
      return <Medal className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'AlertCircle':
      return <AlertCircle className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'ScrollText':
      return <ScrollText className={className} />;
    case 'MessageSquare':
    case 'MessagesSquare':
      return <MessageSquare className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
