import React from 'react';

interface PlantGrowthAnimationProps {
  className?: string;
  size?: number;
}

export const PlantGrowthAnimation: React.FC<PlantGrowthAnimationProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`relative w-full flex items-center justify-center bg-transparent select-none pointer-events-none ${className}`}
      aria-label="We are still building - Plant growth animation"
    >
      <img
        src="/images/plant-growth-animation.svg"
        alt="Plant growth animation"
        className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[340px] h-auto object-contain select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );
};
