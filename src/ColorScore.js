import React from 'react';

// Componente que muestra un color y su puntaje como una fila de tabla
const ColorScore = (props) => {
  const color = props.color;          // Color
  const score = props.score || 0;     // Puntaje, 0 por defecto
  
  return (
    <tr>
      <td className={color} style={{"width":"30px", "background": color}}></td>
      <td style={{"padding":"0 10px"}}>{score}</td>
    </tr>
  )
}

export default ColorScore;