
function res = rotateLeft(vec, offset)
  l = length(vec);
  i = mod(l + mod(offset, l), l) + 1;
  %% 1 <= i <= l
  if i == 1
    res = vec;
  else
    res = [vec(i:end), vec(1:i-1)];
  end
end
