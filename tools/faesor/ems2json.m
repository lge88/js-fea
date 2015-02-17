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
    json = strcat(json, '[\n');
    
    json = strcat(json, '{\n"matrix":\n');
    json = strcat(json, mat2json(mat));
    json = strcat(json, '},\n');
    
    json = strcat(json, '{\n"equationNumbers":\n');
    json = strcat(json, vec2json(eqn), '\n');
    json = strcat(json, '}\n');
    
    json = strcat(json, ']');    
end

json = strcat(json, '\n]\n');
end
