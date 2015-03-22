function Ltract3D
  disp('L-shaped domain, 3-D geometry');

                                % Parameters:
  E=1e7;
  nu=0.3;
  integration_order=2;
  scale = 1;

                                % Mesh
  [fens,gcells] = L2x2;
  ## [fens,gcells]=Q4_refine(fens,gcells);
  ## [fens,gcells]=Q4_refine(fens,gcells);
  ## [fens,gcells]=Q4_refine(fens,gcells);
  % [fens,gcells]=refineq4(fens,gcells);
  xy=get (fens,'xyz');
  fens=set(fens,'xyz', [0*xy(:,1),xy]);
                                % Material
  prop = property_linel_iso (struct('E',E,'nu',nu));
  mater = mater_defor_ss_linel_biax (struct('property',prop, ...
                                            'reduction','stress'));
                                % Finite element block
  feb = feblock_defor_ss (struct ('mater',mater, 'gcells',gcells,...
                                  'integration_rule',gauss_rule (2, integration_order),...
                                  'Rm',[[0, 1, 0]', [0, 0, 1]']));
                                %         'Rm',@geniso_Rm));
                                % Geometry
  geom = field(struct ('name',['geom'], 'dim', 3, 'fens',fens));
                                % Define the displacement field
  u   = clone(geom,'u');
  u   = u*0; % zero out
             % Apply EBC's
             % first out of plane
  ebc_fenids=(1:count(fens));
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=1*ones(1,length (ebc_fenids));
  ebc_val=ebc_fenids*0;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
                                % and now the in plane
  ebc_fenids=fenode_select (fens,struct('box',[0 0 0 0 0 1],'inflate', 0.0001));
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=2*ones(1,length (ebc_fenids));
  ebc_val=ebc_fenids*0;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  ebc_fenids=fenode_select (fens,struct('box',[0 0 0 1 0 0],'inflate', 0.0001));
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=3*ones(1,length (ebc_fenids));
  ebc_val=ebc_fenids*0;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  ebc_fenids=fenode_select (fens,struct('box',[0 0 0 1 1 1],'inflate', 0.0001));
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=3*ones(1,length (ebc_fenids));
  ebc_val=ebc_fenids*0+0.25;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  u   = apply_ebc (u);
                                % Number equations
  u   = numbereqns (u);
                                % Assemble the system matrix
  ems = stiffness(feb, geom, u);
  K = dense_sysmat;
  K = start (K, get(u, 'neqns'));
  K = assemble (K, ems);
  K = finish (K);
                                % Load
  F = sysvec;
  F = start (F, get(u, 'neqns'));
  evs = nz_ebc_loads(feb, geom, u);
  F = assemble (F, evs);
  F = finish(F);

  a = get(K,'mat');
  b = get(F,'vec');
  x = a\b;
  u = scatter_sysvec(u, x);
  get(u,'values')

  return


end
