function json = gaussIntRuleDebug()
json = '[\n';

for dim=[1,2,3]
    for order=[1,2,3,4]        
        if order > 1 || dim > 1
            json = strcat(json, ',\n');
        end
        
        integration_rule = gauss_rule(dim, order);
        pc = get(integration_rule, 'param_coords');
        ws  = get(integration_rule, 'weights');
        npts = get(integration_rule, 'npts');
        
        s.dim = dim;
        s.order = order;
        s.expectedParamCoords = pc;
        s.expectedWeights = ws;
        s.expectedNpts = npts;
        
        json = strcat(json, struct2json(s));
    end
end

json = strcat(json, '\n]\n');

end