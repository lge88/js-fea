function testH8
  [fens, gcells] = H8_block(1,1,1,2,2,2);
  xyz = get(fens, 'xyz')
  conn = get(gcells, 'conn')
end
