require('dotenv').config({path: '.env'});
const shell = require('shelljs');
const fs = require('fs');
const Enumeration = require('../Models/Enumerations');
const Program = require('../Models/Programs');
const dateFormat = require('dateformat');
const Monitorings = require('../Models/Monitorings');
const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

const GO_DIR=`${process.env.GO_DIR}`;



ExecuteSubdomainEnumeration = (client) => {
    client.on('execute-subdomain-enumeration', async (payload) => {
        await Enumeration.findById(payload._id, async (err, enumeration) => {
            console.log(payload);
            var firstExecution = false;
            
            let allSubdomainsFile = `${enumeration.Directory}/Subdomains-${enumeration.Scope.toUpperCase()}.txt`;
    
            let newSubdomainsFile = `${enumeration.Directory}/NewSubdomains-${enumeration.Scope.toUpperCase()}-${date}.txt`;
            let auxNewSubdomainsFile = `${enumeration.Directory}/AuxNewSubdomains-${enumeration.Scope}-${date}.txt`;
    
    
            let findomainFile = `${enumeration.Directory}/Findomain-${enumeration.Scope}-${date}.txt`;
            let subfinderFile = `${enumeration.Directory}/Subfinder-${enumeration.Scope}-${date}.txt`;
            let assetFinderFile = `${enumeration.Directory}/Assetfinder-${enumeration.Scope}-${date}.txt`;
            
            if(!fs.existsSync(newSubdomainsFile)){
                fs.appendFileSync(newSubdomainsFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                    }
                });
            };
    
            if(!fs.existsSync(auxNewSubdomainsFile)){
                fs.appendFileSync(auxNewSubdomainsFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                    }
                });
            };
    
            /* SINTAXIS DE CADA HERRAMIENTA */
            const findomain = `findomain -t ${enumeration.Scope} -u ${findomainFile}`;
            const subfinder = `subfinder -d ${enumeration.Scope} -t 65 -timeout 15 -o ${subfinderFile}`;
            const assetFinder = `${GO_DIR}assetfinder --subs-only ${enumeration.Scope} | tee -a ${assetFinderFile}`; 
    
            enumeration.Syntax=[findomain,subfinder,assetFinder];
    
            client.emit('executed-subdomain-enumeration', {
                success: true,
                msg: `Executing Subdomain Enumeration on ${enumeration.Scope}...`
            });
    
            shell.exec(findomain); //Ejecuto Findomain
            shell.exec(subfinder); //Ejecuto Subfinder
            shell.exec(assetFinder); //Ejecuto Assetfinder
    
            shell.exec(`cat ${findomainFile} ${subfinderFile} ${assetFinderFile} >> ${auxNewSubdomainsFile}`); // Guardo todos los resultados en un Txt Auxiliar
            shell.exec(`sort -u ${auxNewSubdomainsFile} -o ${auxNewSubdomainsFile}`); // Ordeno y filtro resultados.
    
            if(!fs.existsSync(allSubdomainsFile)){
                fs.appendFileSync(allSubdomainsFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                    }
                });
                firstExecution = true;
                shell.exec(`cat ${auxNewSubdomainsFile} >> ${allSubdomainsFile}`); // Si no existe ningun archivo AllSubd inicializo con todos los encontrados.
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allSubdomainsFile} ${auxNewSubdomainsFile} >> ${newSubdomainsFile}`); // Filtro entre AllSubd y NewSub para luego armar un Txt de NuevosSubdominios a Monitorear.
            shell.exec(`rm -r ${auxNewSubdomainsFile} ${findomainFile} ${subfinderFile} ${assetFinderFile}`); //Elimino txts.
            shell.exec(`cat ${newSubdomainsFile} >> ${allSubdomainsFile}`); // Guardo todos los resultados en AllSubdomains.
    
            enumeration.NewFile = newSubdomainsFile; // Guardo New Subdomains.
            enumeration.File = allSubdomainsFile; // Guardo File.
            enumeration.Executed = true; //Cambio estado a Executed.
            enumeration.save();
    
            let Results = {
                Type: 1,
                Data: FileToArray(newSubdomainsFile)
            }

            const monitoring = new Monitorings({
                Program: enumeration.Program,
                Scope: enumeration.Scope,
                Results: Results
            });

            const program = await Program.findById(payload.Program._id);
            program.Files.push(allSubdomainsFile);

            if(firstExecution){
                let Results = {
                    Type: 1,
                    Data: FileToArray(allSubdomainsFile)
                }

                monitoring.Results = Results;

                Results.Data.forEach(element => {
                    program.Subdomains.push(element);
                });

            } else {

                Results.Data.forEach(element => {
                    program.Subdomains.push(element);
                });

            }

            monitoring.save();
            program.save();

            client.emit('executed-subdomain-enumeration', {
                success: true,
                msg: `Subdomain enumeration executed Succesfully...`
            });
            
        });
    });
}

ExecuteAlive = (client) => {
    client.on('execute-alive', async (payload) => {
        
        await Enumeration.findById(payload.Alive._id, async (err, enumeration) => {

            fs.access(payload.Alive.Directory, function(err) {
                if (err && err.code === 'ENOENT') {
                  fs.mkdir(payload.Alive.Directory); //CREA DIRECTORIO POR SI ES NULL
                  enumeration.Directory = payload.Alive.Directory;
                } else {
                    enumeration.Directory = payload.Alive.Directory;
                }
            });
            var firstExecution = false;

            let allAlivesFile = `${enumeration.Directory}/Alives-${enumeration.Scope.toUpperCase()}.txt`;
            let newAlivesFile = `${enumeration.Directory}/NewAlives-${enumeration.Scope.toUpperCase()}-${date}.txt`;
            let auxNewAlivesFile = `${enumeration.Directory}/AuxNewAlives-${enumeration.Scope.toUpperCase()}-${date}.txt`;

            /* SINTAXIS DE CADA HERRAMIENTA */            
            const httprobe = `cat ${payload.Subdomain.File} | ${GO_DIR}httprobe | tee -a ${auxNewAlivesFile}`;
            
            enumeration.Syntax = [httprobe];
            
            client.emit('executed-alive', {
                success: true,
                executing: true,
                msg: `Executing Subdomain Enumeration on ${enumeration.Scope}...`
            });
                
            shell.exec(httprobe); //Ejecuto Httprobe
    
            if(!fs.existsSync(allAlivesFile)){
                fs.appendFileSync(allAlivesFile, '', (err) => {
                    if (err) {
                        return fs.appendFileSync(`${enumeration.Directory}/Error.txt`, err);
                    }
                });
                firstExecution = true;
                shell.exec(`cat ${auxNewAlivesFile} >> ${allAlivesFile}`); // Si no existe ningun archivo All inicializo con todos los encontrados.
            }
        
            shell.exec(`awk 'NR == FNR{ a[$0] = 1;next } !a[$0]' ${allAlivesFile} ${auxNewAlivesFile} >> ${newAlivesFile}`); // Filtro entre AllAlive y NewAlives para luego armar un Txt de NuevosSubdominios a Monitorear.
            shell.exec(`rm -r ${auxNewAlivesFile}`); //Elimino txt auxiliar.

            shell.exec(`cat ${newAlivesFile} >> ${allAlivesFile}`); // Guardo todos los resultados en AllAlives.
    
            enumeration.NewFile = newAlivesFile; // Guardo New Alives.
            enumeration.File = allAlivesFile; // Guardo File.
            enumeration.Executed = true; //Cambio estado a Executed.
            enumeration.save();
    
            let Results = {
                Type: 2,
                Data: FileToArray(newAlivesFile)
            }

            const monitoring = new Monitorings({
                Program: enumeration.Program,
                Scope: enumeration.Scope,
                Results: Results
            });

            const program = await Program.findById(payload.Alive.Program._id);

            program.Files.push(allAlivesFile);

            if(firstExecution){

                let Results = {
                    Type: 2,
                    Data: FileToArray(allAlivesFile)
                }
                monitoring.Results = Results;

                Results.Data.forEach(element => {
                    program.Alives.push(element);
                });
            } else {
                Results.Data.forEach(element => {
                    program.Alives.push(element);
                });
            }

            monitoring.save();
            program.save();

            client.emit('executed-alive', {
                success: true,
                executing: false,
                msg: `Alive enumeration executed Succesfully...`
            });
            
        });
    });
}

function FileToArray(file){

    let fileToArray = [];

    fileToArray = fs.readFileSync(file, {encoding: 'utf-8'}).split('\n');
    
    return fileToArray;
}


module.exports = {
    ExecuteSubdomainEnumeration,
    ExecuteAlive
}
