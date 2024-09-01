import React from 'react';

const HeroSettings = ({ hero, onChange }) => {
  const handleSpeedChange = (e) => {
    onChange({ speed: parseInt(e.target.value, 10) });
  };

const handleSpellFrequencyChange = (e) => {
    onChange({ spellFrequency: parseInt(e.target.value, 10) });
  };

const handleSpellColorChange = (e) => {
    onChange({ spellColor: e.target.value });
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
      <h3>Настройки героя</h3>
      <div>
        <label>Скорость:</label>
        <input type="range" min="1" max="10" value={hero.speed} onChange={handleSpeedChange} />
      </div>
      <div>
        <label>Частота заклинаний:</label>
        <input type="range" min="500" max="2000" value={hero.spellFrequency} onChange={handleSpellFrequencyChange} />
      </div>
      <div>
        <label>Цвет заклинаний:</label>
        <input type="color" value={hero.spellColor} onChange={handleSpellColorChange} />
      </div>
    </div>
  );
};

export default HeroSettings;
