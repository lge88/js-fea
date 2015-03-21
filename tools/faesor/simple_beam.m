function  simple_beam(n)
  E=1000;
  nu=0.4999999;
  nu=0.;
  W=2.5;
  H=5;
  L= 50;
  htol=min([L,H,W])/1000;
  uzex =-12.6;
  magn = 0.2*uzex/4;
  Force =magn*W*H*2;
  Force*L^3/(3*E*W*H^3*2/12);
  graphics = true;

  ## Number of elements
  #n=12;
  mult =4;

  eix=1;

  ## Selective reduced integration hexahedron
  ## eltyd(eix).mf =@H8_block;
  ## eltyd(eix).blf =@feblock_defor_ss_sri;
  ## eltyd(eix).integration_rule=gauss_rule (3,[1,2]);
  ## eltyd(eix).surface_integration_rule=gauss_rule(2, 2);
  ## eltyd(eix).styl='md-';
  ## eix=eix+1;

  %% Full integration hexahedron
  eltyd(eix).mf =@H8_block;
  eltyd(eix).blf =@feblock_defor_ss;
  eltyd(eix).integration_rule=gauss_rule (3,2);
  eltyd(eix).surface_integration_rule=gauss_rule(2, 2);
  eltyd(eix).styl='mx--';
  eix=eix+1;

  % Reduced integration H20
  ## eltyd(eix).mf =@H20_block;
  ## eltyd(eix).blf =@feblock_defor_ss;
  ## eltyd(eix).integration_rule=gauss_rule (3,2);
  ## eltyd(eix).surface_integration_rule=gauss_rule(2, 2);
  ## eltyd(eix).styl='ro-';
  ## eix=eix+1;

  ## Full integration H20
  ## eltyd(eix).mf =@H20_block;
  ## eltyd(eix).blf =@feblock_defor_ss;
  ## eltyd(eix).integration_rule=gauss_rule (3,3);
  ## eltyd(eix).surface_integration_rule=gauss_rule(2, 2);
  ## eltyd(eix).styl='b*-';
  ## eix=eix+1;

  ## T10 tetrahedron
  ## eltyd(eix).mf =@T10_block;
  ## eltyd(eix).blf =@feblock_defor_ss;
  ## eltyd(eix).integration_rule=tet_rule (4);
  ## eltyd(eix).surface_integration_rule=tri_rule(3);
  ## eltyd(eix).styl='gd-';
  ## eix=eix+1;

  eix = 1;

  ## Create the mesh and initialize the geometry
  [fens,gcells]= feval (eltyd(eix).mf, W, L, H, n,mult*n,2*n);

  xyz = get(fens, 'xyz');
  xyz(101:105, :)

  conn = get(gcells, 'conn');
  conn(101:105, :)

  ## mesh{1}=fens;
  ## mesh{2}=gcells;
  ## drawmesh(mesh,'shrink', 0.9,'facecolor','red'); view (2); pause
  ## return;

  prop = property_linel_iso (struct('E',E,'nu',nu));
  mater = mater_defor_ss_linel_triax (struct('property',prop));

  feb = feval (eltyd(eix).blf, struct ('mater',mater, 'gcells',gcells, 'integration_rule',eltyd(eix).integration_rule));
  geom = field(struct ('name',['geom'], 'dim', 3, 'fens',fens));

  ## Define the displacement field, and zero it out
  u   = 0*geom;

  %% Apply the EBC''s
  ebc_fenids=fenode_select(fens,struct('box',[0 W 0 0 0 H]));
  ebc_prescribed=ones(length(ebc_fenids),1);
  ebc_comp=[];
  ebc_val=zeros(length(ebc_fenids),1);
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  ebc_fenids=fenode_select(fens,struct('box',[W W 0 L 0 H]));
  ebc_prescribed=ones(length(ebc_fenids),1);
  ebc_comp=ebc_fenids*0+1;
  ebc_val=zeros(length(ebc_fenids),1);
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  u   = apply_ebc (u);

  %% Number the equations
  u   = numbereqns (u);
  disp (['n=' num2str(n) ', number of equations =' num2str(get(u,'neqns'))])

  %% Assemble the stiffness matrix
  %% K = start (sparse_iter_sysmat, get(u, 'neqns'));
  K = start (sparse_sysmat, get(u, 'neqns'));
                    % K = start (sparse_chol_sysmat, get(u, 'neqns'));
  K = assemble (K, stiffness(feb, geom, u));
  ## mat = get(K, 'mat');
  ## fprintf('k:\n')
  ## full(mat([32,40,7,18], [32,40,7,18]))
  ## mat(3,3)
  ## mat(4,4)
  ## mat(77,77)
  ## mat(8,8)

  %% Assemble the load vector
  fi= force_intensity(struct ('magn',[0;0; magn]));
  bdry_gcells = mesh_bdry(gcells, []);

  nbdrycells = count(bdry_gcells);
  bdry_conn = get(bdry_gcells, 'conn');
  ## bdry_conn = normalizedConn(bdry_conn)
  ## bdry_conn_201_205 = bdry_conn(201:205, :)

  bcl = gcell_select(fens, bdry_gcells, ...
                     struct ('box',[0 W L L 0 H],'inflate',htol));

  selected_bdry_cells = subset(bdry_gcells,bcl);
  selected_bdry_cells_conn = get(selected_bdry_cells, 'conn');
  ## selected_bdry_cells_conn = normalizedConn(selected_bdry_cells_conn)

  lfeb = feblock_defor_ss(struct ('mater',mater, 'gcells',subset(bdry_gcells,bcl),...
                                  'integration_rule',eltyd(eix).surface_integration_rule));
  F = start (sysvec, get(u, 'neqns'));

  evs = distrib_loads(lfeb, geom, u, fi,2);
  ## evs_vec = get(evs, 'vec');
  ## evs_eqnums = get(evs, 'eqnums');
  ## for i=1:length(evs_vec)
  ##   i
  ##   evs_vec{i}
  ##   evs_eqnums{i}
  ## end
  F = assemble (F, distrib_loads(lfeb, geom, u, fi,2));


  %% Solve K*u=F
  b=get(F,'vec');
  ## tic;
  x=K\b;
  ## toc

  %% Transfer the solution to the field u
  u = scatter_sysvec(u, x);
  ebc_fenids=fenode_select(fens,struct('box',[0 W L L 0 H]));
  uv=gather (u,ebc_fenids,'values','noreshape');
  uz=sum(uv(:, 3))/length(ebc_fenids);
  disp (['   Free end displacement =' num2str(uz)])

end
