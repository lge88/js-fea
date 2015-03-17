% Infinite plane with a circular hole of radius a, subject to  uniform tension in the X direction.
function plane_w_hole
                                % Parameters:
  U=physical_units_struct;
  E=210000*U.MEGA*U.PA;
  nu=0.49999;
  G =E/2/(1+nu);
  L= 0.3*U.M; % in-plane dimension
  W = 0.3*U.M; % in-plane dimension
  a= 0.15*U.M; % hole radius
  H = 0.01*U.M; % thickness of the plate

  %nL=15;nH=1;nW=15;na=15;
  nL=2;nH=1;nW=2;na=2;
  tol = a*10e-7;
  sigma0=1*U.MEGA*U.PA;
  graphics = false;

                                % Mesh
  [fens,gcells]=Q4_elliphole(a,a,L,W,nL,nW,na,[]);
  get(fens, 'xyz')

  [fens,gcells] = Q4_extrude(fens,gcells,nH,@(x,i)([x,0]+[0,0,H*i]));
  get(fens, 'xyz')

  [fens,gcells] = H8_to_H20(fens,gcells);
  get(fens, 'xyz')

  return;
                                % Material
  prop = property_linel_iso (struct('E',E,'nu',nu));
  mater = mater_defor_ss_linel_triax (struct('property',prop));
                                % Finite element block
  feb = feblock_defor_ss (struct ('mater',mater, 'gcells',gcells,...
                                  'integration_rule',gauss_rule(3,2)));
                                % Geometry
  geom = field(struct ('name',['geom'], 'dim', 3, 'fens',fens));
                                % Define the displacement field
  u   = 0*geom; % zero out
                % Apply EBC's
  ebc_fenids=fenode_select (fens,struct('box',[0,0,-Inf,Inf,-Inf,Inf],'inflate',tol));
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=ones(1,length (ebc_fenids))*1;
  ebc_val=ebc_fenids*0;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  ebc_fenids=fenode_select (fens,struct('box',[-Inf,Inf,0,0,-Inf,Inf],'inflate',tol));
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=ones(1,length (ebc_fenids))*2;
  ebc_val=ebc_fenids*0;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  ebc_fenids=[fenode_select(fens,struct('box',[-Inf,Inf,-Inf,Inf,0,0],'inflate',tol)),fenode_select(fens,struct('box',[-Inf,Inf,-Inf,Inf,H,H],'inflate',tol))];
  ebc_prescribed=ones(1,length (ebc_fenids));
  ebc_comp=ones(1,length (ebc_fenids))*3;
  ebc_val=ebc_fenids*0;
  u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
  u   = apply_ebc (u);
                                % Number equations
  u   = numbereqns (u);
                                % Assemble the system matrix
                                % Load
  bdry_gcells = mesh_bdry(gcells, []);
  bclx = gcell_select(fens, bdry_gcells, ...
                      struct ('box',[L,L,-Inf,Inf,-Inf,Inf],'inflate',tol));
  lfebx = feblock_defor_ss(struct ('mater',mater, 'gcells',subset(bdry_gcells,bclx),...
                                   'integration_rule',gauss_rule(2,2)));
  bcly = gcell_select(fens, bdry_gcells, ...
                      struct ('box',[-Inf,Inf,W,W,-Inf,Inf],'inflate',tol));
  lfeby = feblock_defor_ss(struct ('mater',mater, 'gcells',subset(bdry_gcells,bcly),...
                                   'integration_rule',gauss_rule(2,2)));
                                % Assemble the system matrix
  K = start (sparse_sysmat, get(u, 'neqns'));
  K = assemble (K, stiffness(feb, geom, u));

       % Load
       % Analytical solution, displacement and stress, on the boundary
       % of the  finite subset of the plane.
  function [r,th]=rth(x)
    r=norm(x(1:2));
    th =atan2(x(2),x(1));
  end
  kappa =3-4*nu; % plane strain
  function u =ur(x)
    [r,th]=rth(x);
    u = sigma0/4/G*(r*((kappa-1)/2+cos(2*th)) + a^2/r*(1+(1+kappa)*cos(2*th)) - a^4/r^3*cos(2*th));
  end
  function u =uth(x)
    [r,th]=rth(x);
    u = sigma0/4/G*((kappa-1)*a^2/r-r-a^4/r^3)*sin(2*th);
  end
  function sxx =sigmaxx(x)
    [r,th]=rth(x);
    sxx = sigma0*(1-a^2/r^2*(3/2*cos(2*th)+cos(4*th))+3/2*a^4/r^4*cos(4*th));
  end
  function syy =sigmayy(x)
    [r,th]=rth(x);
    syy = -sigma0*(a^2/r^2*(1/2*cos(2*th)-cos(4*th))+3/2*a^4/r^4*cos(4*th));
  end
  function sxy =sigmaxy(x)
    [r,th]=rth(x);
    sxy = -sigma0*(a^2/r^2*(1/2*sin(2*th)+sin(4*th))-3/2*a^4/r^4*sin(4*th));
  end
  F = start (sysvec, get(u, 'neqns'));
  fi=force_intensity(struct('magn',@(x) ([sigmaxx(x),sigmaxy(x),0])));

  F = assemble (F, distrib_loads(lfebx, geom, u, fi, 2));
  fi=force_intensity(struct('magn',@(x) ([sigmaxy(x),sigmayy(x),0])));
  F = assemble (F, distrib_loads(lfeby, geom, u, fi, 2));
                                % Solve
  u = scatter_sysvec(u, K\F);
  uv = get(u,'values')

  xyz =get(geom,'values');
  uerrn=0;
  for j=1:size(xyz,1)
    [r,th]=rth(xyz(j,:));
    ur1 = ur(xyz(j,:));
    uth1 = uth(xyz(j,:));
    u1 = [ur1*cos(th)-uth1*sin(th),ur1*sin(th)+uth1*cos(th),0];
    uerrn=max([uerrn,norm(u1-uv(j,:))/norm(uv(j,:))]);
  end
  uerrn

  return
                                % Plot
  gv=graphic_viewer;
  gv=reset (gv,struct ([]));
  scale=10000;
  cmap = jet;
  fld = field_from_integration_points(feb, geom, u, [], 'Cauchy',4);
  nvals=get(fld,'values')/(U.MEGA*U.PA);%min(nvals),max(nvals)
  nvalsrange=[min(nvals),max(nvals)];
  dcm=data_colormap(struct ('range',nvalsrange, 'colormap',cmap));
  colorfield=field(struct ('name', ['colorfield'], 'data',map_data(dcm, nvals)));
  draw(feb,gv, struct ('x', geom, 'u', +scale*u,'colorfield',colorfield, 'shrink',1.0));
  draw(feb,gv, struct ('x', geom, 'u', 0*u,'facecolor','none', 'shrink',0.8));
      % draw(efeb,gv, struct ('x', geom, 'u', 0*u,'facecolor','red'));
  colormap(cmap);
  cbh=colorbar;
  set(cbh,...
      'Position',[0.815 0.15 0.05 0.7],...
      'YLim',[0,1],...
      'YTick',[0,1],...
      'YTickLabel',{[num2str(nvalsrange(1))],[num2str(nvalsrange(2))]});

  %{[num2str((min(nvals)))],[num2str((max(nvals)))]%}

  set(get(cbh,'XLabel'),'String','\sigma_z');
  view (2)
  set_graphics_defaults(gcf)


end
