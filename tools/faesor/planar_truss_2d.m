% Example 18: planar truss, example 3.7, p.72 from Hutton
disp('Example: planar truss, with animated deflection');

% Parameters:
E=1e7;
integration_order=1;

% Mesh
fens=[  fenodeset(struct ('id',1:6','xyz',[[0 0]; ...
    [0 40];...
    [40 0];...
    [40 40];...
    [80 0];...
    [80 40]]))...
    ];

gcells = [ gcellset_L2(struct ('id',1,'conn',[[1 3];[1 4];[2 4];[3 4];[3 5];[5 4];[6 4];[5 6]],'other_dimension',  1.5));...
         ];

ebc_fenids=[1 1 2 2];
ebc_prescribed=[1 1 1 1];
ebc_comp=[1 2 1 2];
ebc_val=ebc_comp*0;

% Material
prop = property_linel_iso (struct('E',E));
mater = mater_defor_ss_linel_uniax (struct('property',prop));

% Finite element block
feb = feblock_defor_ss (struct ('mater',mater, 'gcells',gcells, ...
    'integration_rule',gauss_rule(1,integration_order),...
    'Rm',@geniso_Rm));

% Geometry
geom = field(struct ('name',['geom'], 'dim', 2, 'fens',fens));

% Define the displacement field
u   = clone(geom,'u');
u   = u*0; % zero out

% Apply EBC's
u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
u   = apply_ebc (u);

% Number equations
u   = numbereqns (u);

% Assemble the system matrix
ems = stiffness(feb, geom, u);
K = dense_sysmat;
K = start (K, get(u, 'neqns'));
K = assemble(K, ems);

% Assemble loads vector
F = sysvec;
F = start (F, get(u, 'neqns'));
n=nodal_load(struct('id',3,'dir',2,'magn',-2000));
evs = loads(n, u);
F = assemble (F, evs);
n=nodal_load(struct('id',5,'dir',1,'magn',+2000));
evs = loads(n, u);
F = assemble (F, evs);
n=nodal_load(struct('id',6,'dir',1,'magn',+4000));
evs = loads(n, u);
F = assemble (F, evs);
n=nodal_load(struct('id',6,'dir',2,'magn',+6000));
evs = loads(n, u);
F = assemble (F, evs);

% Solve
a = get(K,'mat');
b = get(F,'vec');
x = a\b;

u = scatter_sysvec(u, x);
get(u,'values')

% x =
%
%     0.0213
%     0.0408
%    -0.0160
%     0.0462
%     0.0427
%     0.1501
%    -0.0053
%     0.1661
%
% u.values =
%
%          0         0
%          0         0
%     0.0213    0.0408
%    -0.0160    0.0462
%     0.0427    0.1501
%    -0.0053    0.1661
