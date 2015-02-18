function s = makeIndentByLevel(level, offset)
  if nargin < 2
    offset = 2;
  end
  s = repmat(' ', 1, level*offset);
end
