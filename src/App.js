import React, { useRef, useEffect, useState, useCallback } from 'react';
import HeroSettings from './HeroSettings';

const App = () => {
  const canvasRef = useRef(null);
  const [heroes, setHeroes] = useState([
    { x: 50, y: 150, dy: 0.5, color: 'red', spellColor: 'blue', spellFrequency: 1000, speed: 0.2 },
    { x: 550, y: 150, dy: 0.5, color: 'green', spellColor: 'purple', spellFrequency: 1000, speed: 0.2 }
  ]);
  const [spells, setSpells] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedHero, setSelectedHero] = useState(null);

  // рисовка героев
  const drawHeroes = useCallback((ctx) => {
    heroes.forEach(hero => {
      ctx.fillStyle = hero.color;
      ctx.beginPath();
      ctx.arc(hero.x, hero.y, 20, 0, Math.PI * 2); 
      ctx.fill();
    });
  }, [heroes]);

  // рисовка заклинания
  const drawSpells = useCallback((ctx) => {
    spells.forEach(spell => {
      ctx.fillStyle = spell.color;
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [spells]);

  // обнова позиций героев
  const updateHeroesPosition = useCallback(() => {
    setHeroes(prevHeroes =>
      prevHeroes.map(hero => {
        let newY = hero.y + hero.dy * hero.speed;
        if (newY < 20 || newY > canvasRef.current.height - 20) {
          hero.dy = -hero.dy;  // Отскок от верхнего и нижнего краев
        }
        if (Math.abs(newY - mousePosition.y) < 20) {
          hero.dy = -hero.dy;  // отскок от мышки
        }
        return { ...hero, y: newY };
      })
    );
  }, [mousePosition]);

  // обнова позиций заклинаний
  const updateSpellsPosition = useCallback(() => {
    setSpells(prevSpells =>
      prevSpells.map(spell => ({
        ...spell,
        x: spell.x + spell.dx,
        y: spell.y + spell.dy
      }))
      .filter(spell => spell.x > 0 && spell.x < canvasRef.current.width && spell.y > 0 && spell.y < canvasRef.current.height)
    );
  }, []);

  // Обнаружение столкновений
  const detectCollisions = useCallback(() => {
    spells.forEach(spell => {
      heroes.forEach(hero => {
        if (Math.hypot(spell.x - hero.x, spell.y - hero.y) < 25) {
          setSpells(prevSpells => prevSpells.filter(s => s !== spell));
        }
      });
    });
  }, [spells, heroes]);

  // Периодическая стрельба заклинаниями для героев
  useEffect(() => {
    const intervals = heroes.map((hero, index) => 
      setInterval(() => {
        setSpells(prevSpells => [
          ...prevSpells,
          {
            x: hero.x,
            y: hero.y,
            dx: index === 0 ? 1 : -1,  // низкая скорость
            dy: 0,
            color: hero.spellColor
          }
        ]);
      }, hero.spellFrequency)
    );

    // Интервалы очистки при отключении компонента
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [heroes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawHeroes(ctx);
      drawSpells(ctx);
      updateHeroesPosition();
      updateSpellsPosition();
      detectCollisions();
      requestAnimationFrame(updateGame);
    };

    updateGame();
  }, [drawHeroes, drawSpells, updateHeroesPosition, updateSpellsPosition, detectCollisions]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    heroes.forEach((hero, index) => {
      if (Math.hypot(hero.x - clickX, hero.y - clickY) < 20) {
        setSelectedHero(index);
      }
    });
  };

  const handleChangeSettings = (index, settings) => {
    setHeroes(prevHeroes =>
      prevHeroes.map((hero, i) => (i === index ? { ...hero, ...settings } : hero))
    );
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        style={{ border: '1px solid black' }}
      />
      {selectedHero !== null && (
        <HeroSettings
          hero={heroes[selectedHero]}
          onChange={(settings) => handleChangeSettings(selectedHero, settings)}
        />
      )}
    </div>
  );
};

export default App;
