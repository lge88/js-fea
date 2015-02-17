function json = mat2json(mat)
json = '[\n';
nrows = size(mat, 2);
for i = 1:nrows
    if i > 1
        json = strcat(json, ',\n');
    end
    json = strcat(json, vec2json(mat(i, :)));
end
json = strcat(json, '\n]\n');
end