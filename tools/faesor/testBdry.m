function testBdry
  [fens, gcells] = H8_block(1,1,1,2,2,2);
  xyz = get(fens, 'xyz')
  conn = get(gcells, 'conn')
  bdry_gcells = mesh_bdry(gcells, []);
  bdy_conn = get(bdry_gcells, 'conn')
  bdy_conn = normalizedConn(bdy_conn)
end
