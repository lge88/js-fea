function res = normalizedCell(cell)
  [~,i] = min(cell);
  res = rotateLeft(cell, i-1);
end
