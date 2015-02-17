% Example 18: planar truss, example 3.7, p.72 from Hutton
disp('Example: planar truss, with animated deflection');

% Parameters:
E=1e7;
integration_order=1;

% Mesh
fens=[  fenodeset(struct ('id',1:6','xyz',[[0 0 0]; ...
    [0 40 0];...
    [40 0 0];...
    [40 40 0];...
    [80 0 0];...
    [80 40 0]]))...
    ];
gcells = [ gcellset_L2(struct ('id',1,'conn',[[1 3];[1 4];[2 4];[3 4];[3 5];[5 4];[6 4];[5 6]],'other_dimension',  1.5));...
         ];

ebc_fenids=[1 1 1 2 2 2];
ebc_prescribed=[1 1 1 1 1 1];
ebc_comp=[1 2 3 1 2 3];
ebc_val=ebc_comp*0;

% Material
prop = property_linel_iso (struct('E',E));
mater = mater_defor_ss_linel_uniax (struct('property',prop));
% Finite element block
feb = feblock_defor_ss (struct ('mater',mater, 'gcells',gcells, ...
    'integration_rule',gauss_rule(1,integration_order),...
    'Rm',@geniso_Rm));
% Geometry
geom = field(struct ('name',['geom'], 'dim', 3, 'fens',fens));
% Define the displacement field
u   = clone(geom,'u');
u   = u*0; % zero out
% Apply EBC's
u   = set_ebc(u, ebc_fenids, ebc_prescribed, ebc_comp, ebc_val);
for i=1:count(fens) % this loop sets the zero out-of-plane displacement
    u=set_ebc(u, [i],[1],[3],[0]);
end
u   = apply_ebc (u);
% Number equations
u   = numbereqns (u);
% Assemble the system matrix
ems = stiffness(feb, geom, u);
K = dense_sysmat;
K = start (K, get(u, 'neqns'));
% axis square
% surf(get(K,'mat')); view(2); axis square; title('K blank'); pause(3);
for i=1:length(ems)
    K = assemble (K, ems(i:i));
    %   surf(get(K,'mat')); view(2); axis square; title(['K with ' num2str(i) ' elements assembled']); pause(2);
end
K = finish (K);
% title('Assembly done');
% pause(4);
% Load
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
F = finish(F);
% Solve
a = get(K,'mat');
b = get(F,'vec');
x = a\b
u = scatter_sysvec(u, x);
get(u,'values')
