import React from 'react';

const ColorScore = (props) => {
  const color = props.color;
  const score = props.score || 0;
  
  return (
    <tr>
      <td className={color}>{color}:</td>
      <td>{score}</td>
    </tr>
  )
}

export default ColorScore;