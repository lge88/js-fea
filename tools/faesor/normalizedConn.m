function conn = normalizedConn(conn)
  l = size(conn, 1);
  for i=1:l
    conn(i, :) = normalizedCell(conn(i, :));
  end

  conn = sortByLexical(conn);
end
