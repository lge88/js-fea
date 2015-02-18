function json = ems2json(ems)
json = '[\n';
mats = get(ems, 'mat');
eqns = get(ems, 'eqnums');
N = length(mats);

for i = 1:N
    mat = mats{i};
    eqn = eqns{i};

    if i > 1
        json = strcat(json, ',\n');
    end

    json = strcat(json, '{\n');

    json = strcat(json, '"matrix":\n');
    json = strcat(json, mat2json(mat), ',\n');

    json = strcat(json, '"equationNumbers":\n');
    json = strcat(json, vec2json(eqn));

    json = strcat(json, '\n}');

end

json = strcat(json, '\n]\n');
end
