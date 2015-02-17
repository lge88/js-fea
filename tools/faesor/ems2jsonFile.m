function ems2jsonFile(ems, filename)
fid = fopen(filename, 'w');
fprintf(fid, ems2json(ems));
fclose(fid);
end