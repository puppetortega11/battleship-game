import { ShipType } from '../types/game';

interface ShipSelectorProps {
  ship: ShipType;
  isSelected: boolean;
  isDeployed: boolean;
  onSelect: () => void;
}

export default function ShipSelector({ ship, isSelected, isDeployed, onSelect }: ShipSelectorProps) {
  const handleDragStart = (e: React.DragEvent) => {
    if (isDeployed) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: ship.type,
      size: ship.size,
      orientation: 'horizontal'
    }));
  };

  return (
    <div
      className={`ship-selector ${isSelected ? 'selected' : ''} ${isDeployed ? 'deployed' : ''}`}
      data-type={ship.type}
      data-size={ship.size}
      draggable={!isDeployed}
      onDragStart={handleDragStart}
      onClick={onSelect}
    >
      {ship.name.toUpperCase()} [{ship.size}]
    </div>
  );
}
