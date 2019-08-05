export function buildStyle(color: string) {
  const r = parseInt(color.slice(0, 2), 16) * 0.95 + 255 * 0.05;
  const g = parseInt(color.slice(2, 4), 16) * 0.95 + 255 * 0.05;
  const b = parseInt(color.slice(4, 6), 16) * 0.95 + 255 * 0.05;
  return `

.simpleframe-btn { 
  background: #${color}; 
  
}
.simpleframe-route {
  color: #${color}; 
}
.simpleframe-btn:hover {
  background: rgba(${r}, ${g}, ${b}, 0.5); 
}
.simpleframe-btn:disabled {
  background: #F7F7F7;
  color: #C6C8CE;
  border: 1px solid #DCDEE2; 
}
.ui-s-frame .ivu-radio-inner:after {
  background: #${color}; 
}

  `;
}