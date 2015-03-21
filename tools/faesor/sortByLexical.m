function mat = sortByLexical(mat)
  %% 3 4 6 2
  %% 3 4 1 8
  %% 4 1 2 2
  %% ->
  %% 3 4 1 8
  %% 3 4 6 2
  %% 4 1 2 2
  [nrows, ncols] = size(mat);
  sortRowsAtCol(1:nrows, 1);

  function sortRowsAtCol(rows, col)
    [~, perm] = sort(mat(rows, col));
    mat(rows, :) = mat(rows(perm), :);

    if col < ncols
      grps = groupNotDoneRows(rows, col);
      for i=1:length(grps)
        sortRowsAtCol(grps{i}, col+1);
      end
    end
  end

  function groups = groupNotDoneRows(rows, col)
    uniqueVals = unique(mat(rows, col));
    groups = {};
    for i=1:length(uniqueVals)
      rowIndices = find(mat(rows, col) == uniqueVals(i));
      if length(rowIndices) > 1
        groups{end+1} = rows(rowIndices);
      end
    end
  end
end
