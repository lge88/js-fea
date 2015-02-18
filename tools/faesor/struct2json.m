function json = struct2json(s)
json = '{\n';
keys = fieldnames(s);
for i=1:length(keys)
    if i > 1
        json = strcat(json, ',\n');
    end
    
    key = keys{i};
    val = s.(key);
    json = strcat(json, '"', key, '":');
    
    if isstruct(val)
        json = strcat(json, struct2json(val));
%     elseif isscalar(val)
%         json = strcat(json, num2str(val));
%     elseif isvector(val)
%         json = strcat(json, vec2json(val));
    elseif ismatrix(val)
        json = strcat(json, mat2json(val));
    end
end

json = strcat(json, '\n}');
end