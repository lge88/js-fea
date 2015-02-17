function json = vec2json(vec)
json = '[';
for i = 1:length(vec)
    if i > 1
        json = strcat(json, ',');
    end
    json = strcat(json, num2str(vec(i)));
end
json = strcat(json, ']');
end